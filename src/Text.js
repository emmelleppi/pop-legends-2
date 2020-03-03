import * as THREE from 'three'
import React, { useEffect } from 'react'
import { useUpdate } from 'react-three-fiber'
import { a } from 'react-spring/three'

import useStore from "./store"

function Text({ config, children, size = 1, alphaColor = 0.5, opacity, position, color }) {
  const mesh = useUpdate(
    self => {
      const size = new THREE.Vector3()
      self.geometry.computeBoundingBox()
      self.geometry.boundingBox.getSize(size)
      self.position.x = -size.x / 2
      self.position.y = -size.y / 2
    },
    [children]
  )

  const addObj = useStore(state => state.addObj)
  const removeObj = useStore(state => state.removeObj)
  
  useEffect(() => {
      if (mesh.current) {
          addObj(mesh.current)
          
          return () => removeObj(mesh.current)
      }
  },[addObj, mesh.current])
  
  const specularColor = new THREE.Color( 0.2, 0.2, 0.2 );
  const specularShininess = Math.pow( 2, alphaColor * 10 );

  return (
      <group position={position} scale={[0.1 * size, 0.1 * size, 0.1]}>
        <mesh ref={mesh} dispose={null} >
          <textGeometry attach="geometry" args={[children, config]} />
          <a.meshToonMaterial
              attach="material"
              map={null}
              bumpMap={null}
              bumpScale={1}
              color={color}
              specular={specularColor}
              shininess={specularShininess}
              opacity={opacity}
              transparent
          />
        </mesh>
      </group>
  )
}

export default React.memo(Text)