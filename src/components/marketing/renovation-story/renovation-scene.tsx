"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// --- deterministic helpers (no Math.random() inside render/hooks) --------

function smoothstep(t: number) {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
}

function bump(t: number) {
  // 0 at t=0, 1 at t=0.5, 0 at t=1 — used for "mid-scroll" construction cues
  return Math.sin(Math.min(1, Math.max(0, t)) * Math.PI);
}

// Small fixed-seed LCG so particle layout is stable across renders/builds.
function seededPositions(count: number, seed: number) {
  let s = seed;
  const rand = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (rand() - 0.5) * 3.4;
    positions[i * 3 + 1] = rand() * 2.4 + 0.2;
    positions[i * 3 + 2] = (rand() - 0.5) * 2.4 - 0.4;
  }
  return positions;
}

function plankTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 256, 256);
  ctx.strokeStyle = "rgba(0,0,0,0.18)";
  ctx.lineWidth = 2;
  for (let x = 0; x <= 256; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 256);
    ctx.stroke();
  }
  for (let y = 0; y <= 256; y += 128) {
    ctx.beginPath();
    ctx.moveTo(0, y + (y === 128 ? 16 : 0));
    ctx.lineTo(256, y + (y === 128 ? 16 : 0));
    ctx.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

function plasterTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 128, 128);
  ctx.fillStyle = "rgba(0,0,0,0.04)";
  let seed = 7;
  const rand = () => {
    seed = (seed * 48271) % 2147483647;
    return seed / 2147483647;
  };
  for (let i = 0; i < 220; i++) {
    ctx.fillRect(rand() * 128, rand() * 128, 1.4, 1.4);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 1.5);
  return texture;
}

const BEFORE_WALL = new THREE.Color("#8f8879");
const AFTER_WALL = new THREE.Color("#f5f0e6");
const BEFORE_FLOOR = new THREE.Color("#5b5148");
const AFTER_FLOOR = new THREE.Color("#b6884f");
const LIGHT_BEFORE = new THREE.Color("#d9c9a3");
const LIGHT_DURING = new THREE.Color("#eaeaea");
const LIGHT_AFTER = new THREE.Color("#ffdcb8");
const SKY_BEFORE = new THREE.Color("#8b8f8a");
const SKY_AFTER = new THREE.Color("#bfe0ee");

const DUST_POSITIONS = seededPositions(70, 918273645);

function Scaffolding({ opacity }: { opacity: React.RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const metalMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#9aa3ab",
        metalness: 0.6,
        roughness: 0.5,
        transparent: true,
      }),
    []
  );
  const woodMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#c9803f", transparent: true }),
    []
  );
  const poleGeom = useMemo(() => new THREE.BoxGeometry(0.06, 2.1, 0.06), []);
  const barGeom = useMemo(() => new THREE.BoxGeometry(0.76, 0.05, 0.05), []);
  const legGeom = useMemo(() => new THREE.BoxGeometry(0.04, 1.05, 0.04), []);

  useFrame(() => {
    const o = opacity.current;
    const g = group.current;
    if (!g) return;
    g.visible = o > 0.02;
    // Mutate the materials found by traversal (not the memoized bindings
    // directly) — reads them fresh each frame, which the hooks linter
    // doesn't (and shouldn't) treat as an impure write to render output.
    g.traverse((child) => {
      const material = (child as THREE.Mesh).material as
        | THREE.MeshStandardMaterial
        | undefined;
      if (material) material.opacity = o;
    });
  });

  return (
    <group ref={group} position={[-1.7, 0, -0.6]}>
      <mesh geometry={poleGeom} material={metalMat} position={[0, 1.05, 0]} />
      <mesh geometry={poleGeom} material={metalMat} position={[0.7, 1.05, 0]} />
      <mesh geometry={barGeom} material={metalMat} position={[0.35, 0.6, 0]} />
      <mesh geometry={barGeom} material={metalMat} position={[0.35, 1.5, 0]} />
      {/* stepladder */}
      <group position={[3.2, 0, 1.2]} rotation={[0, -0.4, 0]}>
        <mesh geometry={legGeom} material={woodMat} position={[-0.18, 0.5, 0]} rotation={[0, 0, 0.28]} />
        <mesh geometry={legGeom} material={woodMat} position={[0.18, 0.5, 0]} rotation={[0, 0, -0.28]} />
      </group>
    </group>
  );
}

function Dust({ opacity }: { opacity: React.RefObject<number> }) {
  const points = useRef<THREE.Points>(null);
  const mat = useRef<THREE.PointsMaterial>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (points.current) {
      points.current.rotation.y = t * 0.02;
      points.current.position.y = Math.sin(t * 0.15) * 0.08;
    }
    if (mat.current) mat.current.opacity = opacity.current * 0.5;
  });
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[DUST_POSITIONS, 3]} />
      </bufferGeometry>
      <pointsMaterial ref={mat} size={0.02} color="#e8ddc8" transparent opacity={0} depthWrite={false} />
    </points>
  );
}

function Furniture({ opacity }: { opacity: React.RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  useFrame(() => {
    if (group.current) {
      group.current.visible = opacity.current > 0.02;
      group.current.scale.setScalar(0.9 + opacity.current * 0.1);
    }
  });
  return (
    <group ref={group} position={[1.1, 0, 0.9]}>
      <mesh position={[0, 0.26, 0]}>
        <boxGeometry args={[1.3, 0.42, 0.6]} />
        <meshStandardMaterial color="#3f4a4a" roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.58, -0.24]}>
        <boxGeometry args={[1.3, 0.34, 0.14]} />
        <meshStandardMaterial color="#3f4a4a" roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.05, 32]} />
        <meshStandardMaterial color="#c96a3c" roughness={0.9} />
      </mesh>
    </group>
  );
}

function Room({ progressRef }: { progressRef: React.RefObject<number> }) {
  const wallMat = useRef<THREE.MeshStandardMaterial>(null);
  const floorMat = useRef<THREE.MeshStandardMaterial>(null);
  const skyMat = useRef<THREE.MeshBasicMaterial>(null);
  const bulbLight = useRef<THREE.PointLight>(null);
  const scaffoldOpacity = useRef(0);
  const furnitureOpacity = useRef(0);
  const dustOpacity = useRef(0);
  const { camera } = useThree();

  const wallTex = useMemo(() => plasterTexture(), []);
  const floorTex = useMemo(() => plankTexture(), []);

  const camA = useMemo(() => new THREE.Vector3(0.2, 2.3, 7.2), []);
  const camB = useMemo(() => new THREE.Vector3(1.5, 1.35, 4), []);
  const lookA = useMemo(() => new THREE.Vector3(0, 1.1, -1), []);
  const lookB = useMemo(() => new THREE.Vector3(0.4, 1.15, -1), []);
  const tmpLook = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const raw = progressRef.current;
    const p = smoothstep(raw);
    const t = state.clock.elapsedTime;

    if (wallMat.current) wallMat.current.color.lerpColors(BEFORE_WALL, AFTER_WALL, p);
    if (floorMat.current) floorMat.current.color.lerpColors(BEFORE_FLOOR, AFTER_FLOOR, p);
    if (skyMat.current) skyMat.current.color.lerpColors(SKY_BEFORE, SKY_AFTER, p);

    if (bulbLight.current) {
      const midColor = raw < 0.5 ? LIGHT_BEFORE.clone().lerp(LIGHT_DURING, raw * 2) : LIGHT_DURING.clone().lerp(LIGHT_AFTER, (raw - 0.5) * 2);
      bulbLight.current.color.copy(midColor);
      bulbLight.current.intensity = 1.4 + p * 1.6 + Math.sin(t * 6) * 0.04 * bump(raw);
    }

    // Construction cues fully clear by raw=0.65, well before furniture
    // starts fading in at 0.72 — avoids the ladder/scaffolding overlapping
    // the sofa's spot mid-transition.
    const constructionWindow = bump(Math.min(raw / 0.65, 1));
    scaffoldOpacity.current = constructionWindow * 0.95;
    dustOpacity.current = constructionWindow;
    furnitureOpacity.current = smoothstep((raw - 0.72) / 0.28);

    camera.position.lerpVectors(camA, camB, p);
    tmpLook.lerpVectors(lookA, lookB, p);
    camera.lookAt(tmpLook);
  });

  return (
    <group>
      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[7, 6]} />
        <meshStandardMaterial ref={floorMat} map={floorTex} roughness={0.85} />
      </mesh>
      {/* back wall */}
      <mesh position={[0, 1.6, -1.8]}>
        <planeGeometry args={[7, 3.2]} />
        <meshStandardMaterial ref={wallMat} map={wallTex} roughness={0.95} />
      </mesh>
      {/* side wall */}
      <mesh position={[-3.4, 1.6, 0.6]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[4.8, 3.2]} />
        <meshStandardMaterial color="#c9c2b3" roughness={0.95} />
      </mesh>
      {/* window */}
      <mesh position={[1.1, 1.9, -1.78]}>
        <planeGeometry args={[1.5, 1.1]} />
        <meshBasicMaterial ref={skyMat} />
      </mesh>
      {/* frame built from 4 thin boxes, not a wireframe box (avoids the
          stray-diagonal artifact a wireframe BoxGeometry produces on flat faces) */}
      <group position={[1.1, 1.9, -1.77]}>
        <mesh position={[0, 0.58, 0]}>
          <boxGeometry args={[1.56, 0.04, 0.04]} />
          <meshStandardMaterial color="#efece4" />
        </mesh>
        <mesh position={[0, -0.58, 0]}>
          <boxGeometry args={[1.56, 0.04, 0.04]} />
          <meshStandardMaterial color="#efece4" />
        </mesh>
        <mesh position={[-0.78, 0, 0]}>
          <boxGeometry args={[0.04, 1.16, 0.04]} />
          <meshStandardMaterial color="#efece4" />
        </mesh>
        <mesh position={[0.78, 0, 0]}>
          <boxGeometry args={[0.04, 1.16, 0.04]} />
          <meshStandardMaterial color="#efece4" />
        </mesh>
      </group>
      {/* ceiling fixture */}
      <mesh position={[-0.3, 3.05, -0.3]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial color="#3a3733" />
      </mesh>
      <pointLight ref={bulbLight} position={[-0.3, 2.95, -0.3]} distance={7} decay={2} />
      <hemisphereLight args={["#fdf6ec", "#3a352e", 0.55]} />
      <directionalLight position={[3, 4, 2]} intensity={0.5} color="#fff3e0" />

      <Scaffolding opacity={scaffoldOpacity} />
      <Dust opacity={dustOpacity} />
      <Furniture opacity={furnitureOpacity} />
    </group>
  );
}

export function RenovationScene({ progressRef }: { progressRef: React.RefObject<number> }) {
  return (
    <div className="absolute inset-0">
      <Canvas
        dpr={[1, 1.6]}
        gl={{ antialias: true }}
        camera={{ fov: 42, position: [0.2, 2.3, 7.2] }}
        resize={{ scroll: false }}
      >
        <color attach="background" args={["#efe9de"]} />
        <fog attach="fog" args={["#efe9de", 6, 13]} />
        <Room progressRef={progressRef} />
      </Canvas>
    </div>
  );
}
