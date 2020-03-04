import React, { useRef, useMemo, useEffect } from "react";
import { useFrame } from "react-three-fiber";
import * as THREE from "three";
import lerp from "lerp";

import { useOutline, COLORS, scroll } from "./store"

const ITEMS_PER_ROW = 20
const ITEMS_NUM = ITEMS_PER_ROW * ITEMS_PER_ROW
const SPACING = 30

function FancyShapes(props) {
    const { position } = props

    const ref = useRef();

    const addObj = useOutline(state => state.addObj)
    const removeObj = useOutline(state => state.removeObj)
    
    useEffect(() => {
        if (ref.current) {
            const { children } = ref.current
            children.forEach(child => addObj(child))
            
            return () => {
                children.forEach(child => removeObj(child))
            }
        }
    },[addObj, ref, removeObj])
    
    const materials = useMemo(() => COLORS.map(color => new THREE.MeshToonMaterial({ color: new THREE.Color(color) })), [])

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
        return new Array(ITEMS_NUM).fill().map((_, index) => {
            const x = ((index % ITEMS_PER_ROW) - ITEMS_PER_ROW / 2) * (SPACING * (1 + 0.2 * Math.random() * (Math.round(Math.random()) ? -1 : 1)))
            const y = (Math.ceil(index / ITEMS_PER_ROW) - ITEMS_PER_ROW / 2 ) * (SPACING * (1 + 0.2 * Math.random() * (Math.round(Math.random()) ? -1 : 1)))
            const z = - 150 + 50 * Math.random()

            const factor = 0.01 * Math.random() * (Math.round(Math.random()) ? -1 : 1)
            const speed = 0.5 * Math.random()
            const material = materials[Math.round(Math.random() * materials.length)]
            const geometry = geometries[Math.round(Math.random() * geometries.length)]
            
            return { index, x, y, z, factor, speed, material, geometry }
        })
    }, [materials, geometries])

    useFrame(state => {      
        if (ref.current) {
            const time = state.clock.getElapsedTime()
            
            const { children } = ref.current

            ref.current.position.z = lerp(ref.current.position.z, - scroll.current / 100, 0.2)

            for (let i = 0; i < children.length; i++) {

                const { x, y, z, factor, speed } = attributes[i]
                
                children[i].position.set(
                    x + factor * Math.cos(factor + time * speed),
                    y + factor * Math.sin(factor + time * speed),
                    z + factor * scroll.current * 2,
                );
                children[i].rotation.x = Math.cos(time * speed)
                children[i].rotation.y = Math.sin(time * speed)
                children[i].rotation.z = Math.sin(time * speed)
                
                children[i].updateMatrix();
            }
        }
    });

    return (
        <group ref={ref} position={position} >
            {attributes.map(({ index, material, geometry }) => <mesh key={index} geometry={geometry} material={material} />)}
        </group>
    )
}

export default FancyShapes
