import React from "react";
import { Canvas } from "react-three-fiber";
import * as THREE from "three";

import Effects from "./Effects"
import FancyShapes from "./FancyShapes";
import ShapeText from "./ShapeText";
import FatLines from "./FatLines";
import CameraEfx from "./CameraEfx";
import Background from "./Background";
import Dom from "./Dom";
import StoreInit from "./StoreInit";

function App() {

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  return (
    <>
      <Canvas
        pixelRatio={Math.min(2, isMobile ? window.devicePixelRatio : 1)}
        gl={{ antialias: false, alpha: false }}
        camera={{ position: [0, 0, 0], near: 5, far: 1000, }}
        onCreated={({ gl }) => { gl.toneMapping = THREE.Uncharted2ToneMapping }}
      >
          <ambientLight intensity={0.9} />
          <pointLight position={[0, 0, 0]} intensity={0.1} />
          
          <ShapeText position={[0, 0, -40]}/>
          <FancyShapes position={[0, 0, -100]} />
          <FatLines count={25} radius={120} position={[0, 0, -100]} />
          
          <StoreInit />
          <Background />
          <Effects />
          <CameraEfx />
      </Canvas>

      <Dom isMobile={isMobile} />
    </>
  );
}

export default App