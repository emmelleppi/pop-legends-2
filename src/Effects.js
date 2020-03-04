import * as THREE from 'three'
import React, { useRef, useEffect } from 'react'
import { extend, useThree, useFrame } from 'react-three-fiber'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { GlitchPass } from './post/Glitchpass'
import { WaterPass } from './post/Waterpass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass'

import { useOutline, useAspect, useScrollMax, scroll } from "./store"

const GLITCH_SCROLL_THRESHOLD = 0.95
const OUTLINE_COLOR = 0xf8f0f9

extend({ FilmPass, EffectComposer, ShaderPass, RenderPass, WaterPass,SSAOPass, UnrealBloomPass, GlitchPass, OutlinePass })

function Effects() {
  const objs = useOutline(state => state.objs)

  const composer = useRef()
  const outline = useRef()
  const glitch = useRef()
  
  const { scene, gl, camera } = useThree()

  const aspect = useAspect(state => state.aspect)
  const scrollMax = useScrollMax(state => state.scrollMax)

  useEffect(() => void composer.current.setSize(aspect.width, aspect.height), [aspect])

  useEffect(() => { 
    if (outline.current) {
      outline.current.edgeStrength = 10
      outline.current.edgeGlow = 0
      outline.current.edgeThickness = 2
      outline.current.visibleEdgeColor = new THREE.Color(OUTLINE_COLOR)
      outline.current.hiddenEdgeColor = new THREE.Color(OUTLINE_COLOR)
      outline.current.selectedObjects = objs
    }
  }, [objs, outline])

  useFrame(() => {
    composer.current.render()
    glitch.current.factor = scroll.current / scrollMax > GLITCH_SCROLL_THRESHOLD ? 0.9 : 0
  }, 1)


  return (
      <effectComposer ref={composer} args={[gl]}>
          <renderPass attachArray="passes" scene={scene} camera={camera} />
          <waterPass attachArray="passes" factor={0.15} />
          <glitchPass ref={glitch} attachArray="passes" factor={0} />
          <unrealBloomPass attachArray="passes" args={[aspect, 0.3, 1, 0.9]} />
          <outlinePass ref={outline} attachArray="passes" args={[aspect, scene, camera]} />
          <filmPass attachArray="passes" args={[0.025, 0.4, 1500, false]} />
      </effectComposer>
  )
}

export default Effects