'use client';

import { useEffect, useRef } from 'react';

/**
 * Red del agente, en 3D (three.js).
 *
 * Es el dibujo de lo que vende la seccion: un agente al centro, conectado a los
 * canales por donde entra el trabajo (WhatsApp, correo, web) y a los sistemas
 * donde queda registrado (CRM, ERP, planillas). Los pulsos que viajan por cada
 * linea son mensajes entrando y datos saliendo.
 *
 * Decisiones para que no le cueste al resto del sitio:
 *
 * - three se importa adentro del efecto: queda en su propio chunk y no pesa en
 *   la carga inicial de la home. Mientras llega se ve el degradado de fondo.
 * - El ciclo de dibujo corre solo con el panel en pantalla
 *   (IntersectionObserver) y con la pestana visible.
 * - Con `prefers-reduced-motion` se dibuja un unico cuadro quieto.
 * - El pixel ratio se limita a 2: en un celular de 3x triplicaria el trabajo
 *   sin que se note la diferencia.
 * - Las etiquetas son HTML encima del canvas, proyectadas desde 3D en cada
 *   cuadro: se leen nitidas, las toman los lectores de pantalla como texto y
 *   no hay que generar texturas de texto.
 */

const NODES = [
  { label: 'WhatsApp', color: 0x22c55e },
  { label: 'Correo', color: 0x3b82f6 },
  { label: 'Sitio web', color: 0x8b5cf6 },
  { label: 'CRM', color: 0x22c55e },
  { label: 'ERP', color: 0x3b82f6 },
  { label: 'Planillas', color: 0x8b5cf6 },
];

const PULSES_PER_LINK = 2;

export default function AgentNetwork({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const coreLabelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import('three');
      if (disposed) return;

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
      } catch {
        // Sin WebGL (navegador viejo o bloqueado): queda el fondo, que ya se ve bien solo.
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.setAttribute('aria-hidden', 'true');
      renderer.domElement.style.display = 'block';
      container.prepend(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
      camera.position.set(0, 0, 11);

      const world = new THREE.Group();
      scene.add(world);

      // --- Nucleo: el agente --------------------------------------------------
      const coreGeo = new THREE.IcosahedronGeometry(1.05, 1);
      const coreWire = new THREE.LineSegments(
        new THREE.WireframeGeometry(coreGeo),
        new THREE.LineBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.55 })
      );
      const coreInner = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.62, 2),
        new THREE.MeshBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.9 })
      );
      const coreGlow = new THREE.Mesh(
        new THREE.SphereGeometry(1.5, 32, 32),
        new THREE.MeshBasicMaterial({
          color: 0x6366f1,
          transparent: true,
          opacity: 0.08,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      world.add(coreWire, coreInner, coreGlow);

      // --- Satelites: canales y sistemas -------------------------------------
      // Repartidos en una esfera inclinada para que la rotacion muestre
      // profundidad (unos pasan por delante del nucleo y otros por detras).
      const radius = 3.4;
      const nodePositions = NODES.map((_, i) => {
        const angle = (i / NODES.length) * Math.PI * 2;
        const y = Math.sin(angle * 2) * 0.9;
        return new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius * 0.75);
      });

      const nodeGeo = new THREE.SphereGeometry(0.2, 24, 24);
      const haloGeo = new THREE.SphereGeometry(0.42, 24, 24);
      const disposables: { dispose: () => void }[] = [coreGeo, nodeGeo, haloGeo];

      const nodeMeshes = NODES.map((node, i) => {
        const group = new THREE.Group();
        const mat = new THREE.MeshBasicMaterial({ color: node.color });
        const haloMat = new THREE.MeshBasicMaterial({
          color: node.color,
          transparent: true,
          opacity: 0.14,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        disposables.push(mat, haloMat);
        group.add(new THREE.Mesh(nodeGeo, mat), new THREE.Mesh(haloGeo, haloMat));
        group.position.copy(nodePositions[i]);
        world.add(group);
        return group;
      });

      // --- Conexiones: curvas del nucleo a cada satelite -----------------------
      const curves = nodePositions.map((p) => {
        const mid = p.clone().multiplyScalar(0.5);
        mid.y += 0.6;
        return new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, 0, 0), mid, p);
      });

      curves.forEach((curve, i) => {
        const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(48));
        const mat = new THREE.LineBasicMaterial({
          color: NODES[i].color,
          transparent: true,
          opacity: 0.28,
        });
        disposables.push(geo, mat);
        world.add(new THREE.Line(geo, mat));
      });

      // --- Pulsos: mensajes que entran y datos que salen ----------------------
      const pulseGeo = new THREE.SphereGeometry(0.06, 12, 12);
      disposables.push(pulseGeo);
      const pulses = curves.flatMap((curve, i) =>
        Array.from({ length: PULSES_PER_LINK }, (_, k) => {
          const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true });
          disposables.push(mat);
          const mesh = new THREE.Mesh(pulseGeo, mat);
          world.add(mesh);
          return {
            mesh,
            curve,
            // La mitad viaja hacia el nucleo (entrada) y la otra hacia afuera.
            inbound: k % 2 === 0,
            offset: (i * 0.37 + k / PULSES_PER_LINK) % 1,
            speed: 0.16 + (i % 3) * 0.04,
            color: NODES[i].color,
          };
        })
      );
      pulses.forEach((p) => (p.mesh.material as InstanceType<typeof THREE.MeshBasicMaterial>).color.setHex(p.color).lerp(new THREE.Color(0xffffff), 0.5));

      // --- Polvo de fondo ------------------------------------------------------
      const dustCount = 260;
      const dust = new Float32Array(dustCount * 3);
      for (let i = 0; i < dustCount; i++) {
        const r = 5 + Math.random() * 7;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        dust[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        dust[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        dust[i * 3 + 2] = r * Math.cos(phi);
      }
      const dustGeo = new THREE.BufferGeometry();
      dustGeo.setAttribute('position', new THREE.BufferAttribute(dust, 3));
      const dustMat = new THREE.PointsMaterial({
        color: 0x94a3b8,
        size: 0.035,
        transparent: true,
        opacity: 0.6,
        depthWrite: false,
      });
      disposables.push(dustGeo, dustMat);
      const dustPoints = new THREE.Points(dustGeo, dustMat);
      scene.add(dustPoints);

      // --- Tamano --------------------------------------------------------------
      const resize = () => {
        const { clientWidth: w, clientHeight: h } = container;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        renderer.domElement.style.width = `${w}px`;
        renderer.domElement.style.height = `${h}px`;
        camera.aspect = w / h;
        // En pantallas angostas se aleja la camara para que entren los seis nodos.
        // 11 deja aire a las etiquetas de los costados. En vertical se aleja
        // solo lo justo para que entren los seis nodos a lo ancho.
        const aspect = w / h;
        camera.position.z = aspect < 1 ? 11 / Math.max(aspect, 0.6) : 11;
        camera.updateProjectionMatrix();
      };
      resize();
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(container);

      // --- Mouse: inclina la escena levemente -----------------------------------
      const pointer = { x: 0, y: 0 };
      const onPointerMove = (e: PointerEvent) => {
        const rect = container.getBoundingClientRect();
        pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      };
      const onPointerLeave = () => {
        pointer.x = 0;
        pointer.y = 0;
      };
      container.addEventListener('pointermove', onPointerMove);
      container.addEventListener('pointerleave', onPointerLeave);

      // --- Etiquetas HTML proyectadas -------------------------------------------
      const tmp = new THREE.Vector3();
      const placeLabels = () => {
        const { clientWidth: w, clientHeight: h } = container;
        nodeMeshes.forEach((mesh, i) => {
          const el = labelRefs.current[i];
          if (!el) return;
          mesh.getWorldPosition(tmp);
          const depth = tmp.z;
          tmp.project(camera);
          const x = (tmp.x * 0.5 + 0.5) * w;
          const y = (-tmp.y * 0.5 + 0.5) * h;
          el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y - 26}px)`;
          // Los nodos que pasan por detras del nucleo se atenuan.
          el.style.opacity = String(depth < -0.5 ? 0.45 : 1);
        });
        // "Agente" va justo debajo del nucleo, siga donde siga en pantalla.
        const core = coreLabelRef.current;
        if (core) {
          tmp.set(0, -1.6, 0);
          world.localToWorld(tmp).project(camera);
          core.style.transform = `translate(-50%, -50%) translate(${(tmp.x * 0.5 + 0.5) * w}px, ${(-tmp.y * 0.5 + 0.5) * h}px)`;
        }
      };

      // --- Ciclo ----------------------------------------------------------------
      const clock = new THREE.Clock();
      let elapsed = 0;
      let frame = 0;
      let running = false;

      const draw = (dt: number) => {
        elapsed += dt;
        world.rotation.y = elapsed * 0.12;
        world.rotation.x += (pointer.y * 0.25 - world.rotation.x) * 0.05;
        world.rotation.z += (-pointer.x * 0.12 - world.rotation.z) * 0.05;

        coreWire.rotation.y = -elapsed * 0.35;
        coreWire.rotation.x = elapsed * 0.2;
        const beat = 1 + Math.sin(elapsed * 2.2) * 0.05;
        coreInner.scale.setScalar(beat);
        coreGlow.scale.setScalar(1 + Math.sin(elapsed * 2.2) * 0.08);

        nodeMeshes.forEach((m, i) => {
          m.position.y = nodePositions[i].y + Math.sin(elapsed * 1.1 + i) * 0.12;
        });

        pulses.forEach((p) => {
          const t = (p.offset + elapsed * p.speed) % 1;
          p.mesh.position.copy(p.curve.getPoint(p.inbound ? 1 - t : t));
          // Se encienden a mitad de camino y se apagan al llegar.
          (p.mesh.material as InstanceType<typeof THREE.MeshBasicMaterial>).opacity = Math.sin(t * Math.PI);
        });

        dustPoints.rotation.y = -elapsed * 0.02;

        renderer.render(scene, camera);
        placeLabels();
      };

      const loop = () => {
        if (!running) return;
        draw(Math.min(clock.getDelta(), 0.05));
        frame = requestAnimationFrame(loop);
      };

      const start = () => {
        if (running || reducedMotion) return;
        running = true;
        clock.getDelta();
        frame = requestAnimationFrame(loop);
      };
      const stop = () => {
        running = false;
        cancelAnimationFrame(frame);
      };

      // Primer cuadro siempre, para que nunca quede el canvas vacio.
      elapsed = 1.2;
      draw(0);

      let visible = false;
      const intersection = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
          if (visible && !document.hidden) start();
          else stop();
        },
        { rootMargin: '100px' }
      );
      intersection.observe(container);

      const onVisibility = () => {
        if (document.hidden) stop();
        else if (visible) start();
      };
      document.addEventListener('visibilitychange', onVisibility);

      cleanup = () => {
        stop();
        intersection.disconnect();
        resizeObserver.disconnect();
        document.removeEventListener('visibilitychange', onVisibility);
        container.removeEventListener('pointermove', onPointerMove);
        container.removeEventListener('pointerleave', onPointerLeave);
        disposables.forEach((d) => d.dispose());
        coreWire.geometry.dispose();
        (coreWire.material as InstanceType<typeof THREE.LineBasicMaterial>).dispose();
        coreInner.geometry.dispose();
        (coreInner.material as InstanceType<typeof THREE.MeshBasicMaterial>).dispose();
        coreGlow.geometry.dispose();
        (coreGlow.material as InstanceType<typeof THREE.MeshBasicMaterial>).dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden touch-pan-y ${className ?? ''}`}
    >
      {NODES.map((node, i) => (
        <span
          key={node.label}
          ref={(el) => {
            labelRefs.current[i] = el;
          }}
          className="pointer-events-none absolute left-0 top-0 whitespace-nowrap rounded-full border border-white/15 bg-black/40 px-2 py-0.5 text-[9px] sm:px-3 sm:py-1 sm:text-[11px] font-semibold uppercase tracking-[0.14em] sm:tracking-[0.18em] text-white/80 backdrop-blur-sm transition-opacity duration-300"
          // Antes del primer cuadro quedan fuera de vista, para que no se
          // amontonen en la esquina.
          style={{ transform: 'translate(-200px, -200px)' }}
        >
          {node.label}
        </span>
      ))}
      <span
        ref={coreLabelRef}
        className="pointer-events-none absolute left-0 top-0 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50"
        style={{ transform: 'translate(-200px, -200px)' }}
      >
        Agente
      </span>
    </div>
  );
}
