import React, { useRef, useState, useEffect, useMemo, useCallback } from "react"
import { useFrame } from "react-three-fiber"
import lerp from 'lerp'
import { a, config, useSpring } from 'react-spring/three'
import * as THREE from 'three'

import Text from "./Text"
import { mouse, useAspect, useFontLoader, rotation as deviceRotation } from "./store"

function TEXT_DATA(width){ 
  const responsiveCorrection = getResponsiveCorrection(width)

  return [
    {
      id:0,
      alphaColor: 0.55,
      shapes:[
        {
          id: 0,
          children: "POP",
          size: 2 * responsiveCorrection,
          position: [-4 * responsiveCorrection, 4.2 * responsiveCorrection, 0]
        },
        {
          id: 1,
          children: "LEGENDS",
          size: 1 * responsiveCorrection,
          position: [-4 * responsiveCorrection, -4 * responsiveCorrection, 0]
        },
        {
          id: 2,
          children: "2",
          size: 3 * responsiveCorrection,
          position: [16 * responsiveCorrection, 0 * responsiveCorrection, 0]
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
          size: 2 * responsiveCorrection,
          position: [0 * responsiveCorrection , 4.2 * responsiveCorrection, 0]
        },
        {
          id: 4,
          children: "DI MEZZAGO",
          size: 1 * responsiveCorrection,
          position: [0 * responsiveCorrection , -4 * responsiveCorrection, 0]
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
          size: 3 * responsiveCorrection,
          position: [0 * responsiveCorrection , 6 * responsiveCorrection, 0]
        },
        {
          id: 6,
          children: "MARZO",
          size: 1 * responsiveCorrection,
          position: [0 * responsiveCorrection , -4 * responsiveCorrection, 0]
        },
      ]
    },
  ]
}

function getResponsiveCorrection(width) {
  if (width <= 425) {
    return 0.7
  }
  if (width <= 768) {
    return 0.8
  }
  return 1
}

function Shape(props) {
  const { shapes, visible, fontConfig, alphaColor } = props

  const colors = useMemo(() => {
    const beta = 1
    const gamma = 1
    const diffuseColor = new THREE.Color().setHSL( alphaColor, 0.5, gamma * 0.5 + 0.1 ).multiplyScalar( 1 - beta * 0.2 );
    const specularColor = new THREE.Color( 0.2, 0.2, 0.2 );
    const specularShininess = Math.pow( 2, alphaColor * 10 );
    
    return { diffuseColor, specularColor, specularShininess}
  }, [alphaColor])

  const { rotation, color } = useSpring({
    to: {
      rotation: visible ? [0, 0, 0] : [0, 2 * Math.PI * 2, 0],
      color: visible ? `#${colors.diffuseColor.getHexString()}` : "#FFFFFF"
    },
    config: config.wobbly
  })

  return (
    <a.group visible={visible} rotation={rotation} >
        {shapes.map(({ id, ...allTheRest }) => <Text key={id} config={fontConfig} color={color} {...allTheRest} {...colors} />)}
    </a.group>
  )
}

function ShapeText(props) {
  const { position, font } = props
  
  const ref = useRef()
  
  const [index, setIndex] = useState(0)

  const aspect = useAspect(state => state.aspect)
  
  const textData = useMemo(() => TEXT_DATA(aspect.width), [aspect.width]) 

  const fontConfig = useMemo(
    () => ({ font, size: 40, height: 10, curveSegments: 4, bevelEnabled: true, bevelThickness: 2, bevelSize: 2, bevelOffset: 0, bevelSegments: 8 }),
    [font]
  )
  
  const eachFrame = useCallback(
    function eachFrame({ clock }) {
      if (ref.current && mouse.current) {
        if (deviceRotation.current) {
          ref.current.position.x = lerp(ref.current.position.x, deviceRotation.current[0] / 10, 0.1)
          ref.current.rotation.x = lerp(ref.current.rotation.x, deviceRotation.current[1] / 10, 0.1)
          ref.current.rotation.y = lerp(ref.current.rotation.y, deviceRotation.current[0] / 10, 0.1)
          ref.current.rotation.z = Math.sin(clock.getElapsedTime()) * 0.3
        } else {
          ref.current.position.x = lerp(ref.current.position.x, mouse.current[0] / 100, 0.1)
          ref.current.rotation.x = lerp(ref.current.rotation.x, mouse.current[1] / 1000, 0.1)
          ref.current.rotation.y = lerp(ref.current.rotation.y, mouse.current[0] / 1000, 0.1)
          ref.current.rotation.z = Math.sin(clock.getElapsedTime()) * 0.3
        }
      }
    },
    [ref]
  )
  useFrame(eachFrame)

  useEffect(() => void setInterval(() => setIndex(i => (i + 1) % textData.length), 4000), [textData.length])

  return (
    <group ref={ref} position={position} >
      {textData.map(({ id, ...allTheRest }) => <Shape key={id} visible={id === index} fontConfig={fontConfig} {...allTheRest} />)}
    </group>
  )
}

function _ShapeText(props) {
  const font = useFontLoader(state => state.fontLoader)

  return font ? <ShapeText {...props} font={font} /> : null
}

export default _ShapeText