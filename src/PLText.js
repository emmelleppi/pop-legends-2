import React, { useRef, useState, useEffect, useMemo, useCallback, Suspense } from "react"
import { useFrame, useLoader } from "react-three-fiber"
import lerp from 'lerp'
import { a, config, useSpring } from 'react-spring/three'
import * as THREE from 'three'
import niceColors from 'nice-color-palettes/1000'

import Text from "./Text"

const marcello = [
  {
    id:0,
    alphaColor: 0.55,
    shapes:[
      {
        id: 0,
        children: "POP",
        size: 2,
        position: [-4, 4.2, 0]
      },
      {
        id: 1,
        children: "LEGENDS",
        size: 1,
        position: [-4, -4, 0]
      },
      {
        id: 2,
        children: "2",
        size: 3,
        position: [16, 0, 0]
      },
    ]
  },
  {
    id: 1,
    alphaColor: 0.45,
    shapes:[
      {
        id: 3,
        children: "BLOOM",
        size: 2,
        position: [-8, 4.2, 0]
      },
      {
        id: 4,
        children: "MEZZAGO",
        size: 1,
        position: [-8, -4, 0]
      },
    ]
  },
  {
    id: 2,
    alphaColor: 0.5,
    shapes:[
      {
        id: 5,
        children: "21",
        size: 3,
        position: [0, 6, 0]
      },
      {
        id: 6,
        children: "MARZO",
        size: 1,
        position: [0, -4, 0]
      },
    ]
  },
]

function PLText(props) {
    const { mouse } = props
    
    const [page, setPage] = useState(0)

    const ref = useRef()
    
    const font = useLoader(THREE.FontLoader, '/Fredoka.json')
    const fontConfig = useMemo(
      () => ({ font, size: 40, height: 30, curveSegments: 32, bevelEnabled: true, bevelThickness: 2, bevelSize: 2, bevelOffset: 0, bevelSegments: 8 }),
      [font]
    )
    
    const eachFrame = useCallback(
      function eachMemo({ clock }) {
        if (ref.current) {
          ref.current.position.x = lerp(ref.current.position.x, mouse.current[0] / 100, 0.1)
          ref.current.rotation.x = lerp(ref.current.rotation.x, mouse.current[1] / 1000, 0.1)
          ref.current.rotation.y = lerp(ref.current.rotation.y, mouse.current[0] / 1000, 0.1)
          ref.current.rotation.z = Math.sin(clock.getElapsedTime()) * 0.3
        }
      },
      [ref, mouse]
    )
    useFrame(eachFrame)

    useEffect(() => void setInterval(() => setPage(i => (i + 1) % marcello.length), 3500), [])

    return (
      <group ref={ref} position={[0, 0, -40]} >
        {marcello.map(({ id, ...allTheRest }) => <Shape key={id} visible={id === page} fontConfig={fontConfig} {...allTheRest} />)}
      </group>
    )
  }

  function Shape(props) {
    const { shapes, visible, fontConfig, alphaColor } = props

    const beta = 1
    const gamma = 1
    const diffuseColor = new THREE.Color().setHSL( alphaColor, 0.5, gamma * 0.5 + 0.1 ).multiplyScalar( 1 - beta * 0.2 );
  
    const { rotation, color } = useSpring({
      to: {
        rotation: visible ? [0, 0, 0] : [0, 2 * Math.PI * 2, 0],
        color: visible ? `#${diffuseColor.getHexString()}` : "#FFFFFF"
      },
      config: config.stiff
    })

    return (
      <a.group visible={visible} rotation={rotation} >
          {shapes.map(({ id, ...allTheRest }) => <Text key={id} config={fontConfig} alphaColor={alphaColor} color={color} {...allTheRest} />)}
      </a.group>
    )
  }

  export default PLText