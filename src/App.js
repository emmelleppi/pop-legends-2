import React, { useEffect, useState, useRef, useMemo } from "react";
import { Canvas, useFrame } from "react-three-fiber";
import * as THREE from "three";

import Effects from "./Effects"

const WIDTH = 400
const HEIGHT = WIDTH

const _object = new THREE.Object3D();
const _color = new THREE.Color();

function useImage(url) {
  const [imageData, setImageData] = useState([]);
  const [columns, setColumns] = useState(1);
  const [rows, setRows] = useState(1);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = url;

    img.onload = function() {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = WIDTH;
      canvas.height = HEIGHT;
      ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width , canvas.height );

      setImageData(imageData.data);
      setColumns(parseInt(canvas.width, 10));
      setRows(parseInt(canvas.height, 10));
    };
  }, [url, setImageData]);

  const [colors, alpha] = useMemo(() => {
    const color = new Float32Array(imageData.length * 4);
    const alpha = [];

    for (let i = 0, j = 0; i < imageData.length; i += 4, j += 1) {
      _color.set(
        `rgb( ${imageData[i]} , ${imageData[i + 1]} , ${imageData[i + 2]})`
      );
      _color.toArray(color, j * 3);
      alpha.push(imageData[i + 3])
    }
    return [color, alpha];
  }, [imageData]);

  return { colors, alpha, columns, rows };
}

function Pixeloni(props) {
  const { colors, alpha, columns, rows } = props

  const ref = useRef();
  const attrib = useRef();

  useFrame(state => {
    if (ref.current && attrib.current) {
      const time = state.clock.getElapsedTime()

      // ref.current.rotation.z = 2 * Math.PI * time / 100
      // ref.current.rotation.x = 2 * Math.PI * time / 100
      // ref.current.rotation.y = 2 * Math.PI * time / 100
      
      let i = 0;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
          const id = i++;

          attrib.current.needsUpdate = true;
          
          _object.position.set(
            -(WIDTH / 2) + x,
            (HEIGHT / 2) - y,
            -(WIDTH)// + WIDTH * 0.01 * Math.cos(time * y * WIDTH / 5000) 
            );
            
          _object.updateMatrix();
            
          if (alpha[id] !== 0) {
            ref.current.setMatrixAt(id, _object.matrix);
          }
        }
      }
      ref.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={ref} args={[null, null, colors.length / 3]}>
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]}>
        <instancedBufferAttribute
          ref={attrib}
          attachObject={["attributes", "color"]}
          args={[colors, 3]}
        />
      </boxBufferGeometry>
      <meshPhongMaterial attach="material" vertexColors={THREE.VertexColors} />
    </instancedMesh>
  );
}

export default function App() {
  const { colors, alpha, columns, rows } = useImage(
    "pop.png"
  );
  return (
    <Canvas
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 0], near: 5, far: 9000 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.Uncharted2ToneMapping;
        gl.setClearColor(new THREE.Color("lightpink"));
      }}
    >
      <ambientLight />
      {/* <pointLight position={[0, 0, 0]} intensity={0.55} /> */}
      <Pixeloni colors={colors} alpha={alpha} columns={columns} rows={rows} />
      {/* <Effects /> */}
    </Canvas>
  );
}
