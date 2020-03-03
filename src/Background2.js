import React, { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "react-three-fiber";
import * as THREE from "three";
import niceColors from 'nice-color-palettes'

import useStore from "./store"

const ITEMS_NUM = 200
const COLORS = niceColors[1]

function Background() {
    const ref = useRef();

    const addObj = useStore(state => state.addObj)
    const removeObj = useStore(state => state.removeObj)
    
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
    
    const materials = useMemo(() => COLORS.map(color => new THREE.MeshToonMaterial({ color: new THREE.Color(color) })))

    const geometries = useMemo(() => {
        return [
            new THREE.BoxBufferGeometry(4, 4, 4),
            new THREE.CylinderBufferGeometry(4, 4, 1, 16),
            new THREE.ConeBufferGeometry(4, 12, 16),
            new THREE.BoxBufferGeometry(1, 1, 30),
            new THREE.SphereBufferGeometry(4, 16, 16),
        ]
    }, [])

    const attributes = useMemo(() => {
        const colNum = 20
        const rowNum = colNum * aspect.y / aspect.x

        return new Array(ITEMS_NUM).fill().map((_, index) => {
            const x = ((aspect.x / colNum) * (index % colNum) - (aspect.x / 2)) / 4
            const y = ((aspect.y / rowNum) *  Math.ceil(index / colNum) - (aspect.y / 2) ) / 4
            const z = -100 - 50 * Math.random()

            const factor = 0.01 * Math.random() * (Math.round(Math.random()) ? -1 : 1)
            const speed = 0.5 * Math.random()
            const material = materials[Math.round(Math.random() * materials.length)]
            const geometry = geometries[Math.round(Math.random() * geometries.length)]
            
            return { x, y, z, factor, speed, material, geometry }
        })
    }, [])

  useFrame(state => {      
      if (ref.current) {
        const { children } = ref.current
        const time = state.clock.getElapsedTime()

        for (let i = 0; i < children.length; i++) {

            const { x, y, z, factor, speed } = attributes[i]
            
            children[i].position.set(
                x + factor * Math.cos(factor + time * speed),
                y + factor * Math.sin(factor + time * speed),
                z //+ factor * Math.sin(factor + time * speed),
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
            {attributes.map(({ material, geometry }) => <mesh geometry={geometry} material={material} />)}
        </group>
    )
}

export default Background
