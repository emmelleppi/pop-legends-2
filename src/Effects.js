import * as THREE from 'three'
import React, { useRef, useMemo, useEffect } from 'react'
import { extend, useThree, useFrame } from 'react-three-fiber'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { GlitchPass } from './post/Glitchpass'
import { WaterPass } from './post/Waterpass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass'

import useStore from "./store"

extend({ FilmPass, EffectComposer, ShaderPass, RenderPass, WaterPass,SSAOPass, UnrealBloomPass, FilmPass, GlitchPass, OutlinePass })

export default function Effects() {
  const objs = useStore(state => state.objs)

  const composer = useRef()
  const outline = useRef()

  const { scene, gl, size, camera } = useThree()
  const aspect = useMemo(() => new THREE.Vector2(size.width, size.height), [size])

  useEffect(() => void composer.current.setSize(size.width, size.height), [size])

  useEffect(() => { 
    if (outline.current) {
      outline.current.edgeStrength = 10
      outline.current.edgeGlow = 0
      outline.current.edgeThickness = 2
      outline.current.visibleEdgeColor = new THREE.Color(0xf8f0f9)
      outline.current.hiddenEdgeColor = new THREE.Color(0xf8f0f9)
      outline.current.selectedObjects = objs
    }
  }, [objs, outline.current])

  useFrame(() => composer.current.render(), 1)

  return (
      <effectComposer ref={composer} args={[gl]}>
          <renderPass attachArray="passes" scene={scene} camera={camera} />
          <waterPass attachArray="passes" factor={0.2} />
          {/* <unrealBloomPass attachArray="passes" args={[aspect, 1, 0.3, 0.9]} /> */}
          {/* <glitchPass attachArray="passes" factor={0.5} /> */}
          <outlinePass ref={outline} attachArray="passes" args={[aspect, scene, camera]} />
          <filmPass attachArray="passes" args={[0.05, 0.4, 1500, false]} />
          {/* <sSAOPass attachArray="passes" args={[scene, camera]} kernelRadius={0.6} maxDistance={0.03} />
          <shaderPass
            attachArray="passes"
            args={[FXAAShader]}
            material-uniforms-resolution-value={[1 / size.width, 1 / size.height]}
            renderToScreen
          /> */}
      </effectComposer>
  )
}
