'use client';

import { useEffect, useRef } from 'react';

/**
 * LiquidText
 *
 * Wordmark gigante dibujado en WebGL que se deforma como un liquido al pasar
 * el mouse, con separacion cromatica (RGB) mientras esta deformado.
 *
 * La malla es una grilla fina sobre la textura del texto; cada vertice guarda
 * su propio desplazamiento y velocidad, y se integra cada frame con la misma
 * fisica: arrastre segun la velocidad del cursor, resorte de vuelta al reposo
 * y amortiguacion. Con `chromaShift` el texto se dibuja tres veces (R, G y B)
 * con desplazamientos 0.9 / 1.0 / 1.1 en blending aditivo, asi el borde se
 * abre en rojo y cian solo cuando la letra esta estirada.
 */

interface LiquidTextProps {
  text: string;
  className?: string;
  /** Color base en hexadecimal. Multiplica al gradiente si hay uno. */
  color?: string;
  /**
   * Paradas de color del wordmark, en hexadecimal, repartidas de izquierda a
   * derecha sobre el texto. Sin esto el texto sale blanco.
   */
  gradient?: string[];
  /** Opacidad global del wordmark. */
  opacity?: number;
  /** Cuanto arrastra el cursor a las letras (0 = nada). */
  drag?: number;
  /** Cuanto empuja el cursor a las letras hacia afuera (0 = nada). */
  push?: number;
  /** Separacion cromatica RGB al deformarse. */
  chromaShift?: boolean;
  fontFamily?: string;
  fontWeight?: number;
  /** Tracking en `em`, negativo para apretar las letras. */
  letterSpacing?: number;
  /** Columnas de la grilla: mas columnas = deformacion mas suave. */
  columns?: number;
}

const VERT_SRC = `
precision highp float;

attribute vec2 aPosition;
attribute vec2 aUv;
attribute vec2 aDisplacement;

uniform vec2 uVPRatio;
uniform float uDispStrength;

varying vec2 vUv;

void main() {
  vec2 pos = aPosition + aDisplacement * uDispStrength;
  pos *= uVPRatio;
  gl_Position = vec4(pos, 0.0, 1.0);
  vUv = aUv;
}
`;

const FRAG_SRC = `
precision highp float;

uniform sampler2D uTexture;
uniform vec4 uColor;
uniform float uPremultiply;

varying vec2 vUv;

void main() {
  // La textura viene premultiplicada: tex.rgb ya es color * mascara. Asi el
  // gradiente horneado en el canvas se propaga solo, y con textura blanca
  // tex.rgb == vec3(mascara), que es el caso de siempre.
  vec4 tex = texture2D(uTexture, vUv);
  // uPremultiply = 0.0 -> pasada cromatica (RGB a full, se suman las tres)
  // uPremultiply = 1.0 -> pasada normal con alpha blending premultiplicado
  float rgbScale = mix(1.0, uColor.a, uPremultiply);
  gl_FragColor = vec4(uColor.rgb * tex.rgb * rgbScale, tex.a * uColor.a);
}
`;

// Mismos valores que usa ApeChain para la aberracion cromatica.
const CHROMA_PASSES = [
  { r: 1, g: 0, b: 0, disp: 0.9 },
  { r: 0, g: 1, b: 0, disp: 1.0 },
  { r: 0, g: 0, b: 1, disp: 1.1 },
];

// Constantes de la fisica del desplazamiento.
const CURSOR_RADIUS = 0.05;
const DRAG_SCALE = 0.02;
const SPRING = 0.1;
const DAMPING = 0.9;
const INTEGRATION_STEP = 0.1;
const MAX_TEXTURE_WIDTH = 2048;

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  return [
    parseInt(full.slice(0, 2), 16) / 255,
    parseInt(full.slice(2, 4), 16) / 255,
    parseInt(full.slice(4, 6), 16) / 255,
  ];
}

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/** Dibuja el texto en un canvas 2D y devuelve la textura y su proporcion. */
function buildTextCanvas(
  text: string,
  fontFamily: string,
  fontWeight: number,
  letterSpacing: number,
  gradient?: string[]
) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const BASE_PX = 400;
  const font = `${fontWeight} ${BASE_PX}px ${fontFamily}`;
  ctx.font = font;

  const chars = Array.from(text);
  const widths = chars.map((ch) => ctx.measureText(ch).width);
  const spacing = letterSpacing * BASE_PX;
  const textWidth =
    widths.reduce((a, b) => a + b, 0) + spacing * Math.max(0, chars.length - 1);

  const metrics = ctx.measureText(text);
  const ascent = metrics.actualBoundingBoxAscent || BASE_PX * 0.75;
  const descent = metrics.actualBoundingBoxDescent || BASE_PX * 0.25;
  const textHeight = ascent + descent;

  if (textWidth <= 0 || textHeight <= 0) return null;

  // Aire alrededor para que el texto deformado no se corte contra el borde.
  const pad = textHeight * 0.35;
  const rawWidth = textWidth + pad * 2;
  const rawHeight = textHeight + pad * 2;

  const scale = Math.min(1, MAX_TEXTURE_WIDTH / rawWidth);
  canvas.width = Math.max(2, Math.round(rawWidth * scale));
  canvas.height = Math.max(2, Math.round(rawHeight * scale));

  // Redimensionar el canvas resetea el contexto, hay que reponer el estado.
  ctx.scale(scale, scale);
  ctx.font = font;
  ctx.textBaseline = 'alphabetic';

  // El gradiente se hornea en la textura y va de punta a punta del texto (sin
  // contar el aire de los bordes), igual que el del logo del header.
  if (gradient && gradient.length > 1) {
    const fill = ctx.createLinearGradient(pad, 0, pad + textWidth, 0);
    gradient.forEach((stop, i) => {
      fill.addColorStop(i / (gradient.length - 1), stop);
    });
    ctx.fillStyle = fill;
  } else {
    ctx.fillStyle = gradient?.[0] ?? '#ffffff';
  }

  let x = pad;
  chars.forEach((ch, i) => {
    ctx.fillText(ch, x, pad + ascent);
    x += widths[i] + spacing;
  });

  return { canvas, aspect: canvas.height / canvas.width };
}

export default function LiquidText({
  text,
  className,
  color = '#FFFFFF',
  gradient,
  opacity = 1,
  drag = 1,
  push = 0,
  chromaShift = true,
  fontFamily = "'Space Grotesk', sans-serif",
  fontWeight = 700,
  letterSpacing = -0.03,
  columns = 380,
}: LiquidTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    let cleanup: (() => void) | null = null;

    const start = () => {
      if (disposed) return;

      const built = buildTextCanvas(
        text,
        fontFamily,
        fontWeight,
        letterSpacing,
        gradient
      );
      if (!built) return;
      const { canvas: textCanvas, aspect } = built;

      canvas.style.aspectRatio = `${textCanvas.width} / ${textCanvas.height}`;

      const gl = canvas.getContext('webgl', {
        alpha: true,
        depth: false,
        antialias: true,
        premultipliedAlpha: true,
      });
      if (!gl) return;

      const vs = compile(gl, gl.VERTEX_SHADER, VERT_SRC);
      const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
      const program = gl.createProgram();
      if (!vs || !fs || !program) return;
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
      gl.useProgram(program);

      // --- Grilla sobre el texto -----------------------------------------
      // El espacio de la malla es isotropico: x en [-1, 1] e y en
      // [-aspect, aspect], igual que el espacio donde se mide el cursor.
      const cols = Math.max(
        8,
        Math.min(columns, Math.floor(Math.sqrt(60000 / Math.max(aspect, 0.02))))
      );
      const rows = Math.max(2, Math.round(cols * aspect));
      const vertexCount = (cols + 1) * (rows + 1);

      const positions = new Float32Array(vertexCount * 2);
      const uvs = new Float32Array(vertexCount * 2);
      // Por vertice: [despX, despY, velX, velY]
      const state = new Float32Array(vertexCount * 4);
      const displacements = new Float32Array(vertexCount * 2);

      let p = 0;
      for (let j = 0; j <= rows; j++) {
        for (let i = 0; i <= cols; i++) {
          const u = i / cols;
          const v = j / rows;
          positions[p * 2] = -1 + u * 2;
          positions[p * 2 + 1] = aspect - v * 2 * aspect;
          uvs[p * 2] = u;
          uvs[p * 2 + 1] = v;
          p++;
        }
      }

      const indices = new Uint16Array(cols * rows * 6);
      let k = 0;
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const a = j * (cols + 1) + i;
          const b = a + 1;
          const c = a + (cols + 1);
          const d = c + 1;
          indices[k++] = a;
          indices[k++] = c;
          indices[k++] = b;
          indices[k++] = b;
          indices[k++] = c;
          indices[k++] = d;
        }
      }

      const makeBuffer = (data: Float32Array, usage: number) => {
        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, data, usage);
        return buf;
      };

      const positionBuffer = makeBuffer(positions, gl.STATIC_DRAW);
      const uvBuffer = makeBuffer(uvs, gl.STATIC_DRAW);
      const dispBuffer = makeBuffer(displacements, gl.DYNAMIC_DRAW);
      const indexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

      const aPosition = gl.getAttribLocation(program, 'aPosition');
      const aUv = gl.getAttribLocation(program, 'aUv');
      const aDisplacement = gl.getAttribLocation(program, 'aDisplacement');
      const uVPRatio = gl.getUniformLocation(program, 'uVPRatio');
      const uDispStrength = gl.getUniformLocation(program, 'uDispStrength');
      const uColor = gl.getUniformLocation(program, 'uColor');
      const uPremultiply = gl.getUniformLocation(program, 'uPremultiply');
      const uTexture = gl.getUniformLocation(program, 'uTexture');

      const bindAttrib = (loc: number, buffer: WebGLBuffer | null) => {
        if (loc < 0) return;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      };
      bindAttrib(aPosition, positionBuffer);
      bindAttrib(aUv, uvBuffer);
      bindAttrib(aDisplacement, dispBuffer);

      // --- Textura del texto ----------------------------------------------
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        textCanvas
      );
      gl.uniform1i(uTexture, 0);

      gl.disable(gl.DEPTH_TEST);
      gl.disable(gl.CULL_FACE);
      gl.enable(gl.BLEND);
      gl.clearColor(0, 0, 0, 0);

      const rgb = hexToRgb(color);

      // --- Cursor ----------------------------------------------------------
      const mouseClient = [-9999, -9999];
      const mousePos = [-9999, -9999];
      const mouseVel = [0, 0];
      let hasPointer = false;

      const onPointerMove = (e: PointerEvent) => {
        mouseClient[0] = e.clientX;
        mouseClient[1] = e.clientY;
        hasPointer = true;
      };
      document.body.addEventListener('pointermove', onPointerMove, {
        passive: true,
      });

      // --- Tamano del canvas ----------------------------------------------
      let width = 0;
      let height = 0;

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const cssWidth = canvas.clientWidth;
        const cssHeight = canvas.clientHeight;
        if (!cssWidth || !cssHeight) return;
        const w = Math.max(1, Math.round(cssWidth * dpr));
        const h = Math.max(1, Math.round(cssHeight * dpr));
        if (w === width && h === height) return;
        width = w;
        height = h;
        canvas.width = w;
        canvas.height = h;
      };
      resize();

      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(canvas);

      // Solo animar cuando el footer esta a la vista.
      let visible = true;
      const intersectionObserver = new IntersectionObserver(
        (entries) => {
          visible = entries[0]?.isIntersecting ?? true;
        },
        { rootMargin: '100px' }
      );
      intersectionObserver.observe(canvas);

      const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      // --- Loop -------------------------------------------------------------
      let raf = 0;
      let last = performance.now();

      const step = (now: number) => {
        raf = requestAnimationFrame(step);
        const dt = Math.min(Math.max((now - last) / 1000, 1 / 240), 1 / 20);
        last = now;
        if (!visible || document.hidden) return;
        if (!width || !height) return;

        // Cursor al mismo espacio isotropico de la malla.
        if (hasPointer && !reduceMotion) {
          const rect = canvas.getBoundingClientRect();
          const nx = (mouseClient[0] - rect.left) / rect.width;
          const ny = (mouseClient[1] - rect.top) / rect.height;
          const cx = nx * 2 - 1;
          const cy = (-2 * ny + 1) * (height / width);
          if (mousePos[0] === -9999) {
            mousePos[0] = cx;
            mousePos[1] = cy;
          }
          mouseVel[0] = (cx - mousePos[0]) / dt;
          mouseVel[1] = (cy - mousePos[1]) / dt;
          // Saltos bruscos (entrar de golpe a la ventana) no cuentan.
          if (Math.hypot(mouseVel[0], mouseVel[1]) > 10) {
            mouseVel[0] = 0;
            mouseVel[1] = 0;
          }
          mousePos[0] = cx;
          mousePos[1] = cy;
        } else {
          mouseVel[0] = 0;
          mouseVel[1] = 0;
        }

        // Integracion de la deformacion, vertice por vertice.
        for (let i = 0; i < vertexCount; i++) {
          const s = i * 4;
          const dx = state[s];
          const dy = state[s + 1];
          let vx = state[s + 2];
          let vy = state[s + 3];

          const px = positions[i * 2] + dx;
          const py = positions[i * 2 + 1] + dy;
          const toX = px - mousePos[0];
          const toY = py - mousePos[1];
          const dist = Math.hypot(toX, toY);
          let strength = 1 / (1 + dist / CURSOR_RADIUS) - 0.1;
          strength = strength < 0 ? 0 : strength > 1 ? 1 : strength;

          vx += mouseVel[0] * DRAG_SCALE * strength * drag;
          vy += mouseVel[1] * DRAG_SCALE * strength * drag;
          vx += -dx * SPRING;
          vy += -dy * SPRING;
          vx += toX * strength * push;
          vy += toY * strength * push;
          vx *= DAMPING;
          vy *= DAMPING;

          const ndx = Math.max(-1, Math.min(1, dx + vx * INTEGRATION_STEP));
          const ndy = Math.max(-1, Math.min(1, dy + vy * INTEGRATION_STEP));

          state[s] = ndx;
          state[s + 1] = ndy;
          state[s + 2] = Math.max(-1, Math.min(1, vx));
          state[s + 3] = Math.max(-1, Math.min(1, vy));

          displacements[i * 2] = ndx;
          displacements[i * 2 + 1] = ndy;
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, dispBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, displacements);

        gl.viewport(0, 0, width, height);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(program);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

        if (width / height > 1) {
          gl.uniform2f(uVPRatio, 1, width / height);
        } else {
          gl.uniform2f(uVPRatio, height / width, 1);
        }

        if (chromaShift) {
          // Aditivo: las tres pasadas se suman y vuelven a dar blanco donde
          // coinciden; donde la deformacion las separa quedan los bordes RGB.
          gl.blendFunc(gl.ONE, gl.ONE);
          gl.uniform1f(uPremultiply, 0);
          for (const pass of CHROMA_PASSES) {
            gl.uniform1f(uDispStrength, pass.disp);
            gl.uniform4f(
              uColor,
              pass.r * rgb[0],
              pass.g * rgb[1],
              pass.b * rgb[2],
              opacity / CHROMA_PASSES.length
            );
            gl.drawElements(
              gl.TRIANGLES,
              indices.length,
              gl.UNSIGNED_SHORT,
              0
            );
          }
        } else {
          gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
          gl.uniform1f(uPremultiply, 1);
          gl.uniform1f(uDispStrength, 1);
          gl.uniform4f(uColor, rgb[0], rgb[1], rgb[2], opacity);
          gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
        }
      };

      raf = requestAnimationFrame(step);

      cleanup = () => {
        cancelAnimationFrame(raf);
        resizeObserver.disconnect();
        intersectionObserver.disconnect();
        document.body.removeEventListener('pointermove', onPointerMove);
        gl.deleteTexture(texture);
        gl.deleteBuffer(positionBuffer);
        gl.deleteBuffer(uvBuffer);
        gl.deleteBuffer(dispBuffer);
        gl.deleteBuffer(indexBuffer);
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
      };
    };

    // Esperar a la fuente: si no, la textura sale con la tipografia de respaldo.
    if (document.fonts?.ready) {
      document.fonts.ready.then(start);
    } else {
      start();
    }

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [
    text,
    color,
    gradient,
    opacity,
    drag,
    push,
    chromaShift,
    fontFamily,
    fontWeight,
    letterSpacing,
    columns,
  ]);

  return (
    <div className={className}>
      {/* El wordmark es un canvas, se expone el texto plano para lectores de
          pantalla y rastreadores. */}
      <span className="sr-only">{text}</span>
      <canvas ref={canvasRef} aria-hidden="true" className="block w-full" />
    </div>
  );
}
