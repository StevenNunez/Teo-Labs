'use client';

import { useEffect, useRef } from 'react';

/**
 * SmokeCursor
 *
 * Rastro de humo que sigue al cursor, igual que el del footer de ApeChain.
 * Por debajo es una simulacion de fluidos (Navier-Stokes) en WebGL: el mouse
 * inyecta tinta blanca y velocidad en el campo, y cada frame se advecta, se
 * resuelve la presion para que quede incompresible y se le devuelve el rizo
 * con confinamiento de vorticidad, que es lo que hace las volutas de humo.
 *
 * El canvas se estira sobre su contenedor con `pointer-events: none`, asi que
 * se puede montar encima del contenido sin robarle clicks ni hovers.
 */

interface SmokeCursorProps {
  className?: string;
  /** Resolucion de la grilla de la simulacion (velocidad, presion). */
  simResolution?: number;
  /** Resolucion de la tinta: mas alto = humo mas fino, mas caro. */
  dyeResolution?: number;
  /** Que tan rapido se desvanece el humo. */
  densityDissipation?: number;
  /** Que tan rapido se frena el fluido. */
  velocityDissipation?: number;
  /** Cuanta presion se conserva entre frames (0-1). */
  pressure?: number;
  pressureIterations?: number;
  /** Confinamiento de vorticidad: sube los remolinos. */
  curl?: number;
  /** Radio de cada pincelada del cursor. */
  splatRadius?: number;
  /** Cuanto empuja el cursor al fluido. */
  splatForce?: number;
  /**
   * Paradas de color del humo, en 0-1, muestreadas segun la posicion
   * horizontal del cursor. Una sola parada = color plano.
   */
  colorStops?: [number, number, number][];
  /** Opacidad global del humo. */
  intensity?: number;
}

// A nivel de modulo para que la referencia sea estable entre renders.
const WHITE_SMOKE: [number, number, number][] = [[1, 1, 1]];

/** Muestrea el gradiente en t (0-1) interpolando entre las dos paradas vecinas. */
function sampleGradient(
  stops: [number, number, number][],
  t: number
): [number, number, number] {
  if (stops.length === 0) return [1, 1, 1];
  if (stops.length === 1) return stops[0];

  const clamped = t < 0 ? 0 : t > 1 ? 1 : t;
  const scaled = clamped * (stops.length - 1);
  const i = Math.min(stops.length - 2, Math.floor(scaled));
  const f = scaled - i;
  const a = stops[i];
  const b = stops[i + 1];
  return [
    a[0] + (b[0] - a[0]) * f,
    a[1] + (b[1] - a[1]) * f,
    a[2] + (b[2] - a[2]) * f,
  ];
}

const BASE_VERTEX_SHADER = `
precision highp float;

attribute vec2 aPosition;

varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;

uniform vec2 texelSize;

void main () {
  vUv = aPosition * 0.5 + 0.5;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const COPY_SHADER = `
precision mediump float;
precision mediump sampler2D;

varying highp vec2 vUv;
uniform sampler2D uTexture;

void main () {
  gl_FragColor = texture2D(uTexture, vUv);
}
`;

const CLEAR_SHADER = `
precision mediump float;
precision mediump sampler2D;

varying highp vec2 vUv;
uniform sampler2D uTexture;
uniform float value;

void main () {
  gl_FragColor = value * texture2D(uTexture, vUv);
}
`;

const SPLAT_SHADER = `
precision highp float;
precision highp sampler2D;

varying vec2 vUv;
uniform sampler2D uTarget;
uniform float aspectRatio;
uniform vec3 color;
uniform vec2 point;
uniform float radius;

void main () {
  vec2 p = vUv - point.xy;
  p.x *= aspectRatio;
  vec3 splat = exp(-dot(p, p) / radius) * color;
  vec3 base = texture2D(uTarget, vUv).xyz;
  gl_FragColor = vec4(base + splat, 1.0);
}
`;

const ADVECTION_SHADER = `
precision highp float;
precision highp sampler2D;

varying vec2 vUv;
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 texelSize;
uniform vec2 dyeTexelSize;
uniform float dt;
uniform float dissipation;

vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
  vec2 st = uv / tsize - 0.5;
  vec2 iuv = floor(st);
  vec2 fuv = fract(st);

  vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
  vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
  vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
  vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);

  return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
}

void main () {
#ifdef MANUAL_FILTERING
  vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
  vec4 result = bilerp(uSource, coord, dyeTexelSize);
#else
  vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
  vec4 result = texture2D(uSource, coord);
#endif
  float decay = 1.0 + dissipation * dt;
  gl_FragColor = result / decay;
}
`;

const DIVERGENCE_SHADER = `
precision mediump float;
precision mediump sampler2D;

varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D uVelocity;

void main () {
  float L = texture2D(uVelocity, vL).x;
  float R = texture2D(uVelocity, vR).x;
  float T = texture2D(uVelocity, vT).y;
  float B = texture2D(uVelocity, vB).y;

  vec2 C = texture2D(uVelocity, vUv).xy;
  if (vL.x < 0.0) { L = -C.x; }
  if (vR.x > 1.0) { R = -C.x; }
  if (vT.y > 1.0) { T = -C.y; }
  if (vB.y < 0.0) { B = -C.y; }

  float div = 0.5 * (R - L + T - B);
  gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
}
`;

const CURL_SHADER = `
precision mediump float;
precision mediump sampler2D;

varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D uVelocity;

void main () {
  float L = texture2D(uVelocity, vL).y;
  float R = texture2D(uVelocity, vR).y;
  float T = texture2D(uVelocity, vT).x;
  float B = texture2D(uVelocity, vB).x;
  float vorticity = R - L - T + B;
  gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
}
`;

const VORTICITY_SHADER = `
precision highp float;
precision highp sampler2D;

varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float curl;
uniform float dt;

void main () {
  float L = texture2D(uCurl, vL).x;
  float R = texture2D(uCurl, vR).x;
  float T = texture2D(uCurl, vT).x;
  float B = texture2D(uCurl, vB).x;
  float C = texture2D(uCurl, vUv).x;

  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001;
  force *= curl * C;
  force.y *= -1.0;

  vec2 velocity = texture2D(uVelocity, vUv).xy;
  velocity += force * dt;
  velocity = min(max(velocity, -1000.0), 1000.0);
  gl_FragColor = vec4(velocity, 0.0, 1.0);
}
`;

const PRESSURE_SHADER = `
precision mediump float;
precision mediump sampler2D;

varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D uPressure;
uniform sampler2D uDivergence;

void main () {
  float L = texture2D(uPressure, vL).x;
  float R = texture2D(uPressure, vR).x;
  float T = texture2D(uPressure, vT).x;
  float B = texture2D(uPressure, vB).x;
  float divergence = texture2D(uDivergence, vUv).x;
  float pressure = (L + R + B + T - divergence) * 0.25;
  gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
}
`;

const GRADIENT_SUBTRACT_SHADER = `
precision mediump float;
precision mediump sampler2D;

varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D uPressure;
uniform sampler2D uVelocity;

void main () {
  float L = texture2D(uPressure, vL).x;
  float R = texture2D(uPressure, vR).x;
  float T = texture2D(uPressure, vT).x;
  float B = texture2D(uPressure, vB).x;
  vec2 velocity = texture2D(uVelocity, vUv).xy;
  velocity.xy -= vec2(R - L, T - B);
  gl_FragColor = vec4(velocity, 0.0, 1.0);
}
`;

// El canvas es transparente: el alpha sale del propio humo, asi el fondo del
// footer se ve por debajo en vez de quedar tapado por un rectangulo negro.
const DISPLAY_SHADER = `
precision highp float;
precision highp sampler2D;

varying vec2 vUv;
uniform sampler2D uTexture;
uniform float uIntensity;

void main () {
  vec3 c = texture2D(uTexture, vUv).rgb * uIntensity;
  c = clamp(c, 0.0, 1.0);
  float a = max(c.r, max(c.g, c.b));
  gl_FragColor = vec4(c, a);
}
`;

interface FBO {
  texture: WebGLTexture | null;
  fbo: WebGLFramebuffer | null;
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  attach: (id: number) => number;
}

interface DoubleFBO {
  read: FBO;
  write: FBO;
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  swap: () => void;
}

export default function SmokeCursor({
  className,
  simResolution = 128,
  dyeResolution = 768,
  densityDissipation = 1.9,
  velocityDissipation = 0.25,
  pressure = 0.8,
  pressureIterations = 20,
  curl = 24,
  splatRadius = 0.11,
  splatForce = 4200,
  colorStops = WHITE_SMOKE,
  intensity = 0.85,
}: SmokeCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Solo con mouse/lapiz: en tactil no hay cursor que seguir y la simulacion
    // seria puro gasto de bateria.
    if (
      !window.matchMedia('(pointer: fine)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const params: WebGLContextAttributes = {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: false,
      premultipliedAlpha: false,
    };

    const gl2 = canvas.getContext('webgl2', params) as WebGL2RenderingContext | null;
    const isWebGL2 = !!gl2;
    const gl = (gl2 ||
      canvas.getContext('webgl', params) ||
      canvas.getContext('experimental-webgl', params)) as WebGLRenderingContext | null;
    if (!gl) return;

    // --- Formatos de textura -------------------------------------------------
    let halfFloatTexType: number;
    let supportLinearFiltering: unknown;

    if (isWebGL2) {
      gl.getExtension('EXT_color_buffer_float');
      supportLinearFiltering = gl.getExtension('OES_texture_float_linear');
      halfFloatTexType = (gl as unknown as WebGL2RenderingContext).HALF_FLOAT;
    } else {
      const halfFloat = gl.getExtension('OES_texture_half_float');
      supportLinearFiltering = gl.getExtension('OES_texture_half_float_linear');
      if (!halfFloat) return;
      halfFloatTexType = (halfFloat as { HALF_FLOAT_OES: number }).HALF_FLOAT_OES;
    }

    const supportRenderTextureFormat = (
      internalFormat: number,
      format: number,
      type: number
    ) => {
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);

      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        texture,
        0
      );
      const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.deleteFramebuffer(fbo);
      gl.deleteTexture(texture);
      return status === gl.FRAMEBUFFER_COMPLETE;
    };

    const getSupportedFormat = (
      internalFormat: number,
      format: number,
      type: number
    ): { internalFormat: number; format: number } | null => {
      if (!supportRenderTextureFormat(internalFormat, format, type)) {
        if (!isWebGL2) return null;
        const gl2c = gl as unknown as WebGL2RenderingContext;
        switch (internalFormat) {
          case gl2c.R16F:
            return getSupportedFormat(gl2c.RG16F, gl2c.RG, type);
          case gl2c.RG16F:
            return getSupportedFormat(gl.RGBA, gl.RGBA, type);
          default:
            return null;
        }
      }
      return { internalFormat, format };
    };

    let formatRGBA: { internalFormat: number; format: number } | null;
    let formatRG: { internalFormat: number; format: number } | null;
    let formatR: { internalFormat: number; format: number } | null;

    if (isWebGL2) {
      const gl2c = gl as unknown as WebGL2RenderingContext;
      formatRGBA = getSupportedFormat(gl2c.RGBA16F, gl.RGBA, halfFloatTexType);
      formatRG = getSupportedFormat(gl2c.RG16F, gl2c.RG, halfFloatTexType);
      formatR = getSupportedFormat(gl2c.R16F, gl2c.RED, halfFloatTexType);
    } else {
      formatRGBA = getSupportedFormat(gl.RGBA, gl.RGBA, halfFloatTexType);
      formatRG = formatRGBA;
      formatR = formatRGBA;
    }

    if (!formatRGBA || !formatRG || !formatR) return;

    const fmtRGBA = formatRGBA;
    const fmtRG = formatRG;
    const fmtR = formatR;
    const texFilter = supportLinearFiltering ? gl.LINEAR : gl.NEAREST;

    // --- Shaders y programas -------------------------------------------------
    const compile = (type: number, source: string, keywords?: string[]) => {
      let src = source;
      if (keywords) {
        src = keywords.map((k) => `#define ${k}\n`).join('') + source;
      }
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const shaders: WebGLShader[] = [];
    const programs: WebGLProgram[] = [];

    const baseVertex = compile(gl.VERTEX_SHADER, BASE_VERTEX_SHADER);
    if (!baseVertex) return;
    shaders.push(baseVertex);

    type Program = {
      program: WebGLProgram;
      uniforms: Record<string, WebGLUniformLocation | null>;
    };

    const makeProgram = (fragSource: string, keywords?: string[]): Program | null => {
      const frag = compile(gl.FRAGMENT_SHADER, fragSource, keywords);
      if (!frag) return null;
      shaders.push(frag);

      const program = gl.createProgram();
      if (!program) return null;
      gl.attachShader(program, baseVertex);
      gl.attachShader(program, frag);
      gl.bindAttribLocation(program, 0, 'aPosition');
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
      programs.push(program);

      const uniforms: Record<string, WebGLUniformLocation | null> = {};
      const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) as number;
      for (let i = 0; i < count; i++) {
        const info = gl.getActiveUniform(program, i);
        if (info) uniforms[info.name] = gl.getUniformLocation(program, info.name);
      }
      return { program, uniforms };
    };

    const copyProgram = makeProgram(COPY_SHADER);
    const clearProgram = makeProgram(CLEAR_SHADER);
    const splatProgram = makeProgram(SPLAT_SHADER);
    const advectionProgram = makeProgram(
      ADVECTION_SHADER,
      supportLinearFiltering ? undefined : ['MANUAL_FILTERING']
    );
    const divergenceProgram = makeProgram(DIVERGENCE_SHADER);
    const curlProgram = makeProgram(CURL_SHADER);
    const vorticityProgram = makeProgram(VORTICITY_SHADER);
    const pressureProgram = makeProgram(PRESSURE_SHADER);
    const gradienSubtractProgram = makeProgram(GRADIENT_SUBTRACT_SHADER);
    const displayProgram = makeProgram(DISPLAY_SHADER);

    if (
      !copyProgram ||
      !clearProgram ||
      !splatProgram ||
      !advectionProgram ||
      !divergenceProgram ||
      !curlProgram ||
      !vorticityProgram ||
      !pressureProgram ||
      !gradienSubtractProgram ||
      !displayProgram
    ) {
      return;
    }

    // --- Quad de pantalla completa -------------------------------------------
    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
      gl.STATIC_DRAW
    );
    const quadIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, quadIndexBuffer);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array([0, 1, 2, 0, 2, 3]),
      gl.STATIC_DRAW
    );
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    const blit = (target: FBO | null, clear = false) => {
      if (target === null) {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      } else {
        gl.viewport(0, 0, target.width, target.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
      }
      if (clear) {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    };

    // --- Framebuffers ---------------------------------------------------------
    const createFBO = (
      w: number,
      h: number,
      internalFormat: number,
      format: number,
      type: number,
      param: number
    ): FBO => {
      gl.activeTexture(gl.TEXTURE0);
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        texture,
        0
      );
      gl.viewport(0, 0, w, h);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      return {
        texture,
        fbo,
        width: w,
        height: h,
        texelSizeX: 1 / w,
        texelSizeY: 1 / h,
        attach(id: number) {
          gl.activeTexture(gl.TEXTURE0 + id);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          return id;
        },
      };
    };

    const createDoubleFBO = (
      w: number,
      h: number,
      internalFormat: number,
      format: number,
      type: number,
      param: number
    ): DoubleFBO => {
      const fbo1 = createFBO(w, h, internalFormat, format, type, param);
      const fbo2 = createFBO(w, h, internalFormat, format, type, param);
      return {
        read: fbo1,
        write: fbo2,
        width: w,
        height: h,
        texelSizeX: fbo1.texelSizeX,
        texelSizeY: fbo1.texelSizeY,
        swap() {
          const temp = this.read;
          this.read = this.write;
          this.write = temp;
        },
      };
    };

    const resizeFBO = (
      target: FBO,
      w: number,
      h: number,
      internalFormat: number,
      format: number,
      type: number,
      param: number
    ) => {
      const newFBO = createFBO(w, h, internalFormat, format, type, param);
      gl.useProgram(copyProgram.program);
      gl.uniform1i(copyProgram.uniforms.uTexture ?? null, target.attach(0));
      blit(newFBO);
      gl.deleteFramebuffer(target.fbo);
      gl.deleteTexture(target.texture);
      return newFBO;
    };

    const resizeDoubleFBO = (
      target: DoubleFBO,
      w: number,
      h: number,
      internalFormat: number,
      format: number,
      type: number,
      param: number
    ) => {
      if (target.width === w && target.height === h) return target;
      target.read = resizeFBO(target.read, w, h, internalFormat, format, type, param);
      gl.deleteFramebuffer(target.write.fbo);
      gl.deleteTexture(target.write.texture);
      target.write = createFBO(w, h, internalFormat, format, type, param);
      target.width = w;
      target.height = h;
      target.texelSizeX = 1 / w;
      target.texelSizeY = 1 / h;
      return target;
    };

    const getResolution = (resolution: number) => {
      let aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
      if (aspectRatio < 1) aspectRatio = 1 / aspectRatio;
      const min = Math.round(resolution);
      const max = Math.round(resolution * aspectRatio);
      if (gl.drawingBufferWidth > gl.drawingBufferHeight) {
        return { width: max, height: min };
      }
      return { width: min, height: max };
    };

    // --- Tamano del canvas ----------------------------------------------------
    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        return true;
      }
      return false;
    };

    resizeCanvas();

    const initialSimRes = getResolution(simResolution);
    const initialDyeRes = getResolution(dyeResolution);

    // Tinta a resolucion alta (es lo que se ve), campos de la simulacion a
    // resolucion baja (es lo que cuesta).
    let dye = createDoubleFBO(
      initialDyeRes.width,
      initialDyeRes.height,
      fmtRGBA.internalFormat,
      fmtRGBA.format,
      halfFloatTexType,
      texFilter
    );
    let velocity = createDoubleFBO(
      initialSimRes.width,
      initialSimRes.height,
      fmtRG.internalFormat,
      fmtRG.format,
      halfFloatTexType,
      texFilter
    );
    const makeSimField = (width: number, height: number) =>
      createFBO(
        width,
        height,
        fmtR.internalFormat,
        fmtR.format,
        halfFloatTexType,
        gl.NEAREST
      );
    let divergence = makeSimField(initialSimRes.width, initialSimRes.height);
    let curlFBO = makeSimField(initialSimRes.width, initialSimRes.height);
    let pressureFBO = createDoubleFBO(
      initialSimRes.width,
      initialSimRes.height,
      fmtR.internalFormat,
      fmtR.format,
      halfFloatTexType,
      gl.NEAREST
    );

    const disposeFBO = (target: FBO) => {
      gl.deleteFramebuffer(target.fbo);
      gl.deleteTexture(target.texture);
    };

    const resizeFramebuffers = () => {
      const simRes = getResolution(simResolution);
      const dyeRes = getResolution(dyeResolution);

      gl.disable(gl.BLEND);

      dye = resizeDoubleFBO(
        dye,
        dyeRes.width,
        dyeRes.height,
        fmtRGBA.internalFormat,
        fmtRGBA.format,
        halfFloatTexType,
        texFilter
      );
      velocity = resizeDoubleFBO(
        velocity,
        simRes.width,
        simRes.height,
        fmtRG.internalFormat,
        fmtRG.format,
        halfFloatTexType,
        texFilter
      );

      if (divergence.width === simRes.width && divergence.height === simRes.height) {
        return;
      }
      // Divergencia, rizo y presion se recalculan enteros cada frame: no hace
      // falta conservar su contenido al redimensionar.
      disposeFBO(divergence);
      disposeFBO(curlFBO);
      disposeFBO(pressureFBO.read);
      disposeFBO(pressureFBO.write);
      divergence = makeSimField(simRes.width, simRes.height);
      curlFBO = makeSimField(simRes.width, simRes.height);
      pressureFBO = createDoubleFBO(
        simRes.width,
        simRes.height,
        fmtR.internalFormat,
        fmtR.format,
        halfFloatTexType,
        gl.NEAREST
      );
    };

    // --- Cursor ---------------------------------------------------------------
    // Coordenadas normalizadas al canvas; y invertida porque el fluido vive en
    // espacio de textura (origen abajo a la izquierda).
    let pointerActive = false;
    let pointerMoved = false;
    let prevX = 0;
    let prevY = 0;
    let posX = 0;
    let posY = 0;
    let deltaX = 0;
    let deltaY = 0;

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (!inside) {
        pointerActive = false;
        return;
      }

      const x = (e.clientX - rect.left) / rect.width;
      const y = 1 - (e.clientY - rect.top) / rect.height;

      if (!pointerActive) {
        // Reentrada: sin delta, para no dibujar una linea de lado a lado.
        prevX = x;
        prevY = y;
        pointerActive = true;
      } else {
        prevX = posX;
        prevY = posY;
      }

      posX = x;
      posY = y;
      deltaX = posX - prevX;
      deltaY = posY - prevY;
      // Correccion de aspecto para que el trazo no se estire en pantallas anchas.
      const aspectRatio = canvas.width / canvas.height;
      if (aspectRatio < 1) deltaX *= aspectRatio;
      else deltaY /= aspectRatio;

      if (Math.abs(deltaX) > 0 || Math.abs(deltaY) > 0) pointerMoved = true;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    // --- Pasos de la simulacion ------------------------------------------------
    const correctRadius = (radius: number) => {
      const aspectRatio = canvas.width / canvas.height;
      return aspectRatio > 1 ? radius * aspectRatio : radius;
    };

    const splat = (
      x: number,
      y: number,
      dx: number,
      dy: number,
      tint: [number, number, number]
    ) => {
      gl.useProgram(splatProgram.program);
      gl.uniform1i(splatProgram.uniforms.uTarget ?? null, velocity.read.attach(0));
      gl.uniform1f(splatProgram.uniforms.aspectRatio ?? null, canvas.width / canvas.height);
      gl.uniform2f(splatProgram.uniforms.point ?? null, x, y);
      gl.uniform3f(splatProgram.uniforms.color ?? null, dx, dy, 0);
      gl.uniform1f(
        splatProgram.uniforms.radius ?? null,
        correctRadius(splatRadius / 100)
      );
      blit(velocity.write);
      velocity.swap();

      gl.uniform1i(splatProgram.uniforms.uTarget ?? null, dye.read.attach(0));
      gl.uniform3f(
        splatProgram.uniforms.color ?? null,
        tint[0] * 0.7,
        tint[1] * 0.7,
        tint[2] * 0.7
      );
      blit(dye.write);
      dye.swap();
    };

    const applyInputs = () => {
      if (!pointerMoved) return;
      pointerMoved = false;
      const tint = sampleGradient(colorStops, posX);
      splat(posX, posY, deltaX * splatForce, deltaY * splatForce, tint);
    };

    const step = (dt: number) => {
      gl.disable(gl.BLEND);

      // Vorticidad: rizo del campo y fuerza que lo realimenta.
      gl.useProgram(curlProgram.program);
      gl.uniform2f(
        curlProgram.uniforms.texelSize ?? null,
        velocity.texelSizeX,
        velocity.texelSizeY
      );
      gl.uniform1i(curlProgram.uniforms.uVelocity ?? null, velocity.read.attach(0));
      blit(curlFBO);

      gl.useProgram(vorticityProgram.program);
      gl.uniform2f(
        vorticityProgram.uniforms.texelSize ?? null,
        velocity.texelSizeX,
        velocity.texelSizeY
      );
      gl.uniform1i(vorticityProgram.uniforms.uVelocity ?? null, velocity.read.attach(0));
      gl.uniform1i(vorticityProgram.uniforms.uCurl ?? null, curlFBO.attach(1));
      gl.uniform1f(vorticityProgram.uniforms.curl ?? null, curl);
      gl.uniform1f(vorticityProgram.uniforms.dt ?? null, dt);
      blit(velocity.write);
      velocity.swap();

      // Divergencia y proyeccion a campo incompresible.
      gl.useProgram(divergenceProgram.program);
      gl.uniform2f(
        divergenceProgram.uniforms.texelSize ?? null,
        velocity.texelSizeX,
        velocity.texelSizeY
      );
      gl.uniform1i(divergenceProgram.uniforms.uVelocity ?? null, velocity.read.attach(0));
      blit(divergence);

      gl.useProgram(clearProgram.program);
      gl.uniform1i(clearProgram.uniforms.uTexture ?? null, pressureFBO.read.attach(0));
      gl.uniform1f(clearProgram.uniforms.value ?? null, pressure);
      blit(pressureFBO.write);
      pressureFBO.swap();

      gl.useProgram(pressureProgram.program);
      gl.uniform2f(
        pressureProgram.uniforms.texelSize ?? null,
        velocity.texelSizeX,
        velocity.texelSizeY
      );
      gl.uniform1i(pressureProgram.uniforms.uDivergence ?? null, divergence.attach(0));
      for (let i = 0; i < pressureIterations; i++) {
        gl.uniform1i(
          pressureProgram.uniforms.uPressure ?? null,
          pressureFBO.read.attach(1)
        );
        blit(pressureFBO.write);
        pressureFBO.swap();
      }

      gl.useProgram(gradienSubtractProgram.program);
      gl.uniform2f(
        gradienSubtractProgram.uniforms.texelSize ?? null,
        velocity.texelSizeX,
        velocity.texelSizeY
      );
      gl.uniform1i(
        gradienSubtractProgram.uniforms.uPressure ?? null,
        pressureFBO.read.attach(0)
      );
      gl.uniform1i(
        gradienSubtractProgram.uniforms.uVelocity ?? null,
        velocity.read.attach(1)
      );
      blit(velocity.write);
      velocity.swap();

      // Adveccion: la velocidad se arrastra a si misma y despues arrastra la tinta.
      gl.useProgram(advectionProgram.program);
      gl.uniform2f(
        advectionProgram.uniforms.texelSize ?? null,
        velocity.texelSizeX,
        velocity.texelSizeY
      );
      if (!supportLinearFiltering) {
        gl.uniform2f(
          advectionProgram.uniforms.dyeTexelSize ?? null,
          velocity.texelSizeX,
          velocity.texelSizeY
        );
      }
      const velocityId = velocity.read.attach(0);
      gl.uniform1i(advectionProgram.uniforms.uVelocity ?? null, velocityId);
      gl.uniform1i(advectionProgram.uniforms.uSource ?? null, velocityId);
      gl.uniform1f(advectionProgram.uniforms.dt ?? null, dt);
      gl.uniform1f(
        advectionProgram.uniforms.dissipation ?? null,
        velocityDissipation
      );
      blit(velocity.write);
      velocity.swap();

      if (!supportLinearFiltering) {
        gl.uniform2f(
          advectionProgram.uniforms.dyeTexelSize ?? null,
          dye.texelSizeX,
          dye.texelSizeY
        );
      }
      gl.uniform1i(advectionProgram.uniforms.uVelocity ?? null, velocity.read.attach(0));
      gl.uniform1i(advectionProgram.uniforms.uSource ?? null, dye.read.attach(1));
      gl.uniform1f(
        advectionProgram.uniforms.dissipation ?? null,
        densityDissipation
      );
      blit(dye.write);
      dye.swap();
    };

    const render = () => {
      gl.disable(gl.BLEND);
      gl.useProgram(displayProgram.program);
      gl.uniform1i(displayProgram.uniforms.uTexture ?? null, dye.read.attach(0));
      gl.uniform1f(displayProgram.uniforms.uIntensity ?? null, intensity);
      blit(null, true);
    };

    // Solo animar mientras el footer esta a la vista.
    let visible = true;
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
      },
      { rootMargin: '120px' }
    );
    intersectionObserver.observe(canvas);

    const resizeObserver = new ResizeObserver(() => {
      if (resizeCanvas()) resizeFramebuffers();
    });
    resizeObserver.observe(canvas);

    let raf = 0;
    let lastTime = performance.now();

    const update = (now: number) => {
      raf = requestAnimationFrame(update);
      const dt = Math.min(Math.max((now - lastTime) / 1000, 1 / 240), 1 / 30);
      lastTime = now;
      if (!visible || document.hidden) return;
      applyInputs();
      step(dt);
      render();
    };
    raf = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(raf);
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);

      const disposeDouble = (target: DoubleFBO) => {
        disposeFBO(target.read);
        disposeFBO(target.write);
      };
      disposeDouble(dye);
      disposeDouble(velocity);
      disposeDouble(pressureFBO);
      disposeFBO(divergence);
      disposeFBO(curlFBO);

      gl.deleteBuffer(quadBuffer);
      gl.deleteBuffer(quadIndexBuffer);
      programs.forEach((p) => gl.deleteProgram(p));
      shaders.forEach((s) => gl.deleteShader(s));
    };
  }, [
    simResolution,
    dyeResolution,
    densityDissipation,
    velocityDissipation,
    pressure,
    pressureIterations,
    curl,
    splatRadius,
    splatForce,
    colorStops,
    intensity,
  ]);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
