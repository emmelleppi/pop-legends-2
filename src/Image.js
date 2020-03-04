import React, { useMemo, useRef } from "react"
import * as THREE from 'three/src/Three'
import { useFrame } from "react-three-fiber"

function Image(props) {

    const { url, scale, scroll, position, speed = 1 } = props
  
    const ref = useRef()

    const texture = useMemo(() => new THREE.TextureLoader().load(url), [url])

    useFrame(() => {
        if (ref.current) {
            ref.current.position.y =  position[1] + speed * scroll.current / 100
        }
    })
    
    return (
      <mesh ref={ref} scale={scale} position={position} >
        <planeBufferGeometry attach="geometry" args={[5, 5]} />
        <meshLambertMaterial attach="material" transparent >
          <primitive attach="map" object={texture} />
        </meshLambertMaterial>
      </mesh>
    )
}

export default Image
