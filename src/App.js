import React, { Suspense, useCallback, useRef } from "react";
import { Canvas } from "react-three-fiber";
import * as THREE from "three";

import Effects from "./Effects"
import Background from "./Background2";
import Pixeloni from "./Pixeloni";
import useImage from "./useImage";
import PLText from "./PLText";
import FatLines from "./FatLines";

export default function App() {
  const { colors, alpha, columns, rows } = useImage(
    "pop.png"
  );

  const mouse = useRef([0, 0])
  const onMouseMove = useCallback(({ clientX: x, clientY: y }) => (mouse.current = [x - window.innerWidth / 2, y - window.innerHeight / 2]), [])
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  return (
    <Canvas
      pixelRatio={Math.min(2, isMobile ? window.devicePixelRatio : 1)}
      gl={{ antialias: false, alpha: false }}
      camera={{ position: [0, 0, 0], near: 5, far: 1000 }}
      onMouseMove={onMouseMove}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.Uncharted2ToneMapping;
        gl.setClearColor(new THREE.Color("#ea7bbe"));
      }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.9} />
        <pointLight position={[0, 0, 0]} intensity={0.1} />
        <PLText mouse={mouse} />
        {/* <Pixeloni colors={colors} alpha={alpha} columns={columns} rows={rows} /> */}
        <Background />
        <FatLines count={25} />
        <Effects />
      </Suspense>
    </Canvas>
  );
}
