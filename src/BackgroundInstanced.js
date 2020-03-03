import React, { useRef, useMemo, useEffect } from "react";
import { useFrame } from "react-three-fiber";
import * as THREE from "three";
import niceColors from 'nice-color-palettes'

const CUBE_NUM = 200
const COLORS = niceColors[10]

const _object = new THREE.Object3D();
const _color = new THREE.Color();

function Background(props) {
    const { type } = props
    
    const ref = useRef();
    const attrib = useRef();

    const material = new THREE.MeshToonMaterial()

    const geo = useMemo(() => {
        if (type === "cube") {
            return new THREE.BoxBufferGeometry(4, 4, 4)
        }
        if (type === "circle") {
            return new THREE.CylinderBufferGeometry(4, 4, 1, 16)
        }
        if (type === "cone") {
            return new THREE.ConeBufferGeometry(4, 12, 16)
        }
        if (type === "rect") {
            return new THREE.BoxBufferGeometry(1, 1, 30)
        }
        if (type === "sphere") {
            return new THREE.SphereBufferGeometry(4, 16, 16)
        }
        return new THREE.BoxBufferGeometry(4, 4, 4)
    }, [type])

    const positions = useMemo(() => {
        return new Array(CUBE_NUM).fill().map(() => {
            const x = (Math.random() * 300) * (Math.round(Math.random()) ? -1 : 1)
            const y = (Math.random() * 300) * (Math.round(Math.random()) ? -1 : 1)
            const z = -100 + Math.random() * 10
            const factor = Math.random() * 0.01  * (Math.round(Math.random()) ? -1 : 1)
            const speed = Math.random() * 0.5
            return [x, y, z, factor, speed]
        })
    }, [])

    const colors = useMemo(() => {
        const color = new Float32Array(CUBE_NUM * 3);

        for (let i = 0; i < CUBE_NUM; i += 1) {
            _color.set(COLORS[i % COLORS.length]);
            _color.toArray(color, i * 3);
        }

        return color
    }, []);

    useEffect(() => {
        geo.setAttribute( 'color', new THREE.InstancedBufferAttribute( colors, 3 ) );
        material.vertexColors= THREE.VertexColors
    }, [colors])

  useFrame(state => {      
      if (ref.current && attrib.current) {

        const time = state.clock.getElapsedTime()

        for (let i = 0; i < CUBE_NUM; i++) {
            attrib.current.needsUpdate = true;
            
            const [x, y, z, factor, speed] = positions[i]
            _object.position.set(
                x + 300 * factor * Math.cos(factor + time * speed),
                y + 300 * factor * Math.sin(factor + time * speed),
                z + factor * Math.sin(factor + time * speed),
            );
            _object.rotation.set(
                Math.cos(time * speed),
                Math.sin(time * speed),
                Math.sin(time * speed),
            );
            
            _object.updateMatrix();
            
            ref.current.setMatrixAt(i, _object.matrix);
        }

        ref.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh
        ref={ref}
        args={[
            geo, 
            material,
            colors.length / 3
        ]}
    >
        <instancedBufferAttribute
            ref={attrib}
            attachObject={["attributes", "color"]}
            args={[colors, 3]}
        />
    </instancedMesh>
    // <instancedMesh ref={ref} args={[null, null, CUBE_NUM]}>
    //   <boxBufferGeometry attach="geometry" args={[1, 1, 4]}>
    //     <instancedBufferAttribute
    //       ref={attrib}
    //       attachObject={["attributes", "color"]}
    //       args={[colors, 3]}
    //     />
    //   </boxBufferGeometry>
    //   <meshPhongMaterial attach="material" vertexColors={THREE.VertexColors} />
    // </instancedMesh>
  );
}

function _Background() {
    return ["cube", "circle", "cone", "rect", "sphere"].map(type => <Background key={type} type={type}/>)
}

export default _Background
