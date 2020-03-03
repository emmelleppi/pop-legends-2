import React, { useRef } from "react";
import { useFrame } from "react-three-fiber";
import * as THREE from "three";
import { WIDTH, HEIGHT } from "./useImage";


const _object = new THREE.Object3D();

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

export default Pixeloni
