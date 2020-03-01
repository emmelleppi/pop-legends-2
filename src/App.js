import React, { Suspense } from "react";
import { Canvas } from "react-three-fiber";
import * as THREE from "three";

import Effects from "./Effects"
import Background from "./Background";
import Pixeloni from "./Pixeloni";
import useImage from "./useImage";
import Jumbo from "./Jumbo";
import FatLines from "./FatLines";

export default function App() {
  const { colors, alpha, columns, rows } = useImage(
    "pop.png"
  );

  return (
    <Canvas
      gl={{ antialias: false, alpha: false }}
      camera={{ position: [0, 0, 0], near: 5, far: 1000 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.Uncharted2ToneMapping;
        gl.setClearColor(new THREE.Color("#ea7bbe"));
      }}
    >
      <Suspense fallback={null}>
        <ambientLight />
        <pointLight position={[0, 0, 0]} intensity={0.2} />
        <Jumbo />
        {/* <Pixeloni colors={colors} alpha={alpha} columns={columns} rows={rows} /> */}
        <Background />
        <FatLines count={25} />
        <Effects />
      </Suspense>
    </Canvas>
  );
}
