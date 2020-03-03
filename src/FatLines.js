import * as THREE from 'three'
import React, { useRef, useMemo } from 'react'
import { extend, useFrame } from 'react-three-fiber'
import * as meshline from 'threejs-meshline'

extend(meshline)

const COLORS =  ["#f8f0f9"]
const r = () => Math.max(0.2, Math.random())

function Fatline({ curve, width, color, speed }) {
    const material = useRef()

    useFrame(() => (material.current.uniforms.dashOffset.value -= speed))
  
    return (
        <mesh>
            <meshLine attach="geometry" vertices={curve} />
            <meshLineMaterial attach="material" ref={material} transparent lineWidth={width} color={color} dashArray={0.1} dashRatio={0.95} />
        </mesh>
    )
}

function Fatlines({ count, radius = 100 }) {
  const lines = useMemo(
    () =>
      new Array(count).fill().map((_, index) => {
        
        const pos = new THREE.Vector3(radius * r(), radius * r(), 0)
        
        const points = new Array(30).fill().map(() => {
          const angle = Math.random() * 2 * Math.PI
          return pos.add(new THREE.Vector3(Math.sin(angle) * radius * r(), Math.cos(angle) * radius * r(), 0)).clone()
        })

        const curve = new THREE.CatmullRomCurve3(points).getPoints(1000)
        
        return {
          color: COLORS[parseInt(COLORS.length * Math.random())],
          width: Math.max(0.1, 0.1 * index),
          speed: Math.max(0.00001, 0.00004 * Math.random()),
          curve
        }
      }),
    [count]
  )


  return (
    <group position={[0, 0, -100]} >
      {lines.map((props, index) => (
        <Fatline key={index} {...props} />
      ))}
    </group>
  )
}

export default Fatlines