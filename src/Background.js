import React, { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "react-three-fiber";
import * as THREE from "three";
import niceColors from 'nice-color-palettes'

import useStore from "./store"

const CUBE_NUM = 30
const COLORS = niceColors[1]

function Background(props) {
    const { type, materials } = props

    const addObj = useStore(state => state.addObj)
    const removeObj = useStore(state => state.removeObj)
    
    const ref = useRef();

    const { size } = useThree()
    const aspect = useMemo(() => new THREE.Vector2(size.width, size.height), [size])  

    useEffect(() => {
        if (ref.current) {
            const { children } = ref.current
            children.forEach(child => addObj(child))
            
            return () => {
                children.forEach(child => removeObj(child))
            }
        }
    },[addObj, ref.current])


    const geometry = useMemo(() => {
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

    const attributes = useMemo(() => {
        return new Array(CUBE_NUM).fill().map((_, index) => {
            const x = (aspect.x / 8) * Math.random() * (Math.round(Math.random()) ? -1 : 1)
            const y = (aspect.y / 8) * Math.random() * (Math.round(Math.random()) ? -1 : 1)
            const z = -100 - 100 * Math.random()

            const factor = 0.01 * Math.random() * (Math.round(Math.random()) ? -1 : 1)
            const speed = 0.5 * Math.random()
            const material = materials[index % materials.length]
            
            return { x, y, z, factor, speed, material }
        })
    }, [])

  useFrame(state => {      
      if (ref.current) {
        const { children } = ref.current
        const time = state.clock.getElapsedTime()

        for (let i = 0; i < children.length; i++) {

            const { x, y, z, factor, speed } = attributes[i]
            
            children[i].position.set(
                x + (aspect.x / 8) * factor * Math.cos(factor + time * speed),
                y + (aspect.y / 8) * factor * Math.sin(factor + time * speed),
                z + factor * Math.sin(factor + time * speed),
            );
            children[i].rotation.set(
                Math.cos(time * speed),
                Math.sin(time * speed),
                Math.sin(time * speed),
            );
            
            children[i].updateMatrix();
            
        }
    }
  });

    return (
        <group ref={ref} >
            {attributes.map(({ material }) => <mesh geometry={geometry} material={material} />)}
        </group>
    )
}

function _Background() {
    const materials = useMemo(() => COLORS.map(color => new THREE.MeshToonMaterial({ color: new THREE.Color(color) })))

    return ["cube", "circle", "cone", "rect", "sphere"].map(type => <Background key={type} type={type} materials={materials} />)
}

export default _Background
