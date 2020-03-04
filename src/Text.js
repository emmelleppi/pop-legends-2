import * as THREE from 'three'
import React, { useEffect } from 'react'
import { useUpdate } from 'react-three-fiber'
import { a } from 'react-spring/three'

import { useOutline } from "./store"


function Text(props) {

  const { position, config, children, size = 1, diffuseColor, specularColor, specularShininess } = props

  const addObj = useOutline(state => state.addObj)
  const removeObj = useOutline(state => state.removeObj)
  
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

  useEffect(() => {
      if (mesh.current) {
          const temp = mesh.current
          addObj(temp)
          
          return () => removeObj(temp)
      }
  }, [addObj, removeObj, mesh])
  
  return (
    <group position={position} scale={[0.1 * size, 0.1 * size, 0.1]}>
      <mesh ref={mesh} dispose={null} >
        <textGeometry attach="geometry" args={[children, config]} />
        <a.meshToonMaterial
            attach="material"
            color={diffuseColor}
            specular={specularColor}
            shininess={specularShininess}
        />
      </mesh>
    </group>
  )
}

export default React.memo(Text)