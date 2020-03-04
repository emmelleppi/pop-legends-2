import * as THREE from 'three'
import React, { useRef, useMemo } from 'react'
import { extend, useFrame } from 'react-three-fiber'
import * as meshline from 'threejs-meshline'
import lerp from 'lerp'

import { COLORS, scroll } from './store'

extend(meshline)

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

function Fatlines(props) {

  const { count, radius = 100, position } = props
  
  const ref = useRef()

  const lines = useMemo(() => new Array(count)
    .fill()
    .map((_, index) => {
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
    [count, radius]
  )

  useFrame(() => {      
    if (ref.current) {
      ref.current.rotation.z =  lerp(ref.current.rotation.z, -scroll.current/100000, 0.5)
      ref.current.scale.x = 1 + 0.2 * Math.sin(scroll.current/1000)
      ref.current.scale.y = 1 + 0.2 * Math.cos(scroll.current/1000)
    }
  })

  return (
    <group ref={ref} position={position} >
      {lines.map((props, index) => (
        <Fatline key={index} {...props} />
      ))}
    </group>
  )
}

export default Fatlines