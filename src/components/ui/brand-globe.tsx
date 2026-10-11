'use client';

import { useEffect, useRef } from 'react';

/**
 * El mundo de Teo Labs, en 3D (three.js).
 *
 * Reemplaza al globo del splash, que era una imagen de stock sacada de
 * internet. Este es nuestro y dice lo mismo que el nombre: Teo (theos, el
 * mundo) y Labs (el laboratorio).
 *
 * - El mundo es una esfera de puntos con el degradado de la marca: cobalto
 *   arriba, nebulosa abajo (paleta Cielo de Elqui). Sin continentes: no copiamos un mapa, es un
 *   mundo abstracto que se construye.
 * - El ecuador y un meridiano van trazados encima: son los dos trazos de la Θ
 *   (theta, inicial de theos) que forman la T de Teo en la propuesta de logo.
 * - Una orbita inclinada con un punto verde que la recorre: el laboratorio, un
 *   electron. Es el punto verde de la Θ.
 * - Arcos de datos entre puntos de la superficie, con pulsos que viajan: el
 *   software conectando el mundo, como las pistas de circuito de los logos 1 y 2.
 *
 * Mismo cuidado que la red de Agentes: three se importa en el efecto (chunk
 * propio), un cuadro quieto con `prefers-reduced-motion`, pixel ratio maximo 2,
 * todo se libera al desmontar. Aparece con un fundido cuando el primer cuadro
 * esta dibujado, asi nunca se ve un canvas vacio.
 */

const BLUE = 0x2f4bff;
const PURPLE = 0x8a5cff;
const GREEN = 0x22c55e;

export default function BrandGlobe({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import('three');
      if (disposed) return;

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      // En tema claro los puntos van mas saturados y sin brillo aditivo: sobre
      // blanco el `AdditiveBlending` los hace desaparecer.
      const dark = document.documentElement.classList.contains('dark');

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
      } catch {
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      const canvas = renderer.domElement;
      canvas.setAttribute('aria-hidden', 'true');
      canvas.style.cssText = 'display:block;width:100%;height:100%;opacity:0;transition:opacity 400ms ease-out';
      container.appendChild(canvas);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
      camera.position.set(0, 0, 4.9);

      const world = new THREE.Group();
      // Inclinacion del eje, como la Tierra: le da profundidad al giro.
      world.rotation.z = THREE.MathUtils.degToRad(-18);
      world.rotation.x = THREE.MathUtils.degToRad(12);
      scene.add(world);

      const disposables: { dispose: () => void }[] = [];
      const R = 1;
      const blue = new THREE.Color(BLUE);
      const purple = new THREE.Color(PURPLE);
      // El mundo va de cobalto a nebulosa, como la Θ. El verde queda solo para
      // la orbita y su electron: es el punto del laboratorio.
      const gradientAt = (t: number) => blue.clone().lerp(purple, t);

      // --- El mundo: esfera de Fibonacci (puntos repartidos parejo) ----------
      const COUNT = 1400;
      const positions = new Float32Array(COUNT * 3);
      const colors = new Float32Array(COUNT * 3);
      const golden = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < COUNT; i++) {
        const y = 1 - (i / (COUNT - 1)) * 2;
        const rr = Math.sqrt(1 - y * y);
        const th = golden * i;
        positions.set([Math.cos(th) * rr * R, y * R, Math.sin(th) * rr * R], i * 3);
        const c = gradientAt((1 - y) / 2);
        colors.set([c.r, c.g, c.b], i * 3);
      }
      const dotsGeo = new THREE.BufferGeometry();
      dotsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      dotsGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      const dotsMat = new THREE.PointsMaterial({
        size: 0.045,
        vertexColors: true,
        transparent: true,
        opacity: dark ? 0.9 : 1,
        depthWrite: false,
        blending: dark ? THREE.AdditiveBlending : THREE.NormalBlending,
      });
      disposables.push(dotsGeo, dotsMat);
      world.add(new THREE.Points(dotsGeo, dotsMat));

      // Un nucleo apenas visible tapa los puntos de la cara de atras: sin el,
      // el mundo se lee como una nube y no como una esfera.
      const coreMat = new THREE.MeshBasicMaterial({
        color: dark ? 0x0b1026 : 0xffffff,
        transparent: true,
        opacity: 0.82,
      });
      const coreGeo = new THREE.SphereGeometry(R * 0.985, 48, 48);
      disposables.push(coreMat, coreGeo);
      world.add(new THREE.Mesh(coreGeo, coreMat));

      // --- Ecuador y meridiano: los trazos de la Θ ---------------------------
      // Tubos y no `Line`: las lineas de WebGL miden siempre 1px, y en el
      // splash a 288px el trazo se perdia. Asi tienen el peso del isotipo.
      const ring = (radius: number, color: number, opacity: number, thickness = 0.012) => {
        const geo = new THREE.TorusGeometry(radius, thickness, 8, 160);
        geo.rotateX(Math.PI / 2);
        const mat = new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity });
        disposables.push(geo, mat);
        return new THREE.Mesh(geo, mat);
      };
      const equator = ring(R * 1.004, PURPLE, 1, 0.014);
      world.add(equator);
      const meridian = ring(R * 1.004, BLUE, 1, 0.014);
      meridian.rotation.z = Math.PI / 2;
      world.add(meridian);

      // --- Orbita del laboratorio, con su electron ---------------------------
      const orbit = new THREE.Group();
      // Casi de canto, como un anillo planetario: se lee como orbita y no como
      // un segundo circulo alrededor del mundo.
      orbit.rotation.x = THREE.MathUtils.degToRad(16);
      orbit.rotation.z = THREE.MathUtils.degToRad(-22);
      const orbitR = R * 1.32;
      orbit.add(ring(orbitR, GREEN, dark ? 0.7 : 0.85, 0.008));
      const electronGeo = new THREE.SphereGeometry(0.07, 24, 24);
      const electronMat = new THREE.MeshBasicMaterial({ color: GREEN });
      disposables.push(electronGeo, electronMat);
      const electron = new THREE.Mesh(electronGeo, electronMat);
      orbit.add(electron);
      scene.add(orbit);

      // --- Arcos de datos entre puntos de la superficie -----------------------
      const randomOnSphere = (seed: number) => {
        // pseudo-aleatorio fijo: el mundo es siempre el mismo, no cambia por visita
        const a = Math.sin(seed * 12.9898) * 43758.5453;
        const b = Math.sin(seed * 78.233) * 12345.6789;
        const u = a - Math.floor(a);
        const v = b - Math.floor(b);
        const th = u * Math.PI * 2;
        const ph = Math.acos(2 * v - 1);
        return new THREE.Vector3(Math.sin(ph) * Math.cos(th), Math.cos(ph), Math.sin(ph) * Math.sin(th)).multiplyScalar(R);
      };
      const ARCS = 7;
      const arcs = Array.from({ length: ARCS }, (_, i) => {
        const a = randomOnSphere(i * 2 + 1);
        const b = randomOnSphere(i * 2 + 2);
        const mid = a.clone().add(b).normalize().multiplyScalar(R * (1.25 + a.distanceTo(b) * 0.18));
        const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
        const t = i / (ARCS - 1);
        const color = gradientAt(t);
        const geo = new THREE.TubeGeometry(curve, 48, 0.006, 6, false);
        const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.7 });
        const pulseGeo = new THREE.SphereGeometry(0.03, 12, 12);
        const pulseMat = new THREE.MeshBasicMaterial({ color, transparent: true });
        disposables.push(geo, mat, pulseGeo, pulseMat);
        world.add(new THREE.Mesh(geo, mat));
        const pulse = new THREE.Mesh(pulseGeo, pulseMat);
        world.add(pulse);
        return { curve, pulse, mat: pulseMat, offset: i * 0.37, speed: 0.35 + (i % 3) * 0.08 };
      });

      // --- Tamano ---------------------------------------------------------------
      const resize = () => {
        const { clientWidth: w, clientHeight: h } = container;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      resize();
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(container);

      // --- Ciclo ----------------------------------------------------------------
      const clock = new THREE.Clock();
      let elapsed = 0.8;
      let frame = 0;
      let shown = false;

      const draw = (dt: number) => {
        elapsed += dt;
        world.rotation.y = elapsed * 0.35;
        electron.position.set(Math.cos(elapsed * 1.6) * orbitR, 0, Math.sin(elapsed * 1.6) * orbitR);
        arcs.forEach((arc) => {
          const t = (arc.offset + elapsed * arc.speed) % 1;
          arc.pulse.position.copy(arc.curve.getPoint(t));
          arc.mat.opacity = Math.sin(t * Math.PI);
        });
        renderer.render(scene, camera);
        if (!shown) {
          shown = true;
          canvas.style.opacity = '1';
        }
      };

      const loop = () => {
        draw(Math.min(clock.getDelta(), 0.05));
        frame = requestAnimationFrame(loop);
      };

      draw(0);
      if (!reducedMotion) {
        clock.getDelta();
        frame = requestAnimationFrame(loop);
      }

      cleanup = () => {
        cancelAnimationFrame(frame);
        resizeObserver.disconnect();
        disposables.forEach((d) => d.dispose());
        renderer.dispose();
        canvas.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return <div ref={ref} className={className} />;
}
