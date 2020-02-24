import * as THREE from 'three'
import React, { useRef, useMemo, useEffect } from 'react'
import { extend, useThree, useFrame } from 'react-three-fiber'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass'
import { GlitchPass } from './post/Glitchpass'
import { WaterPass } from './post/Waterpass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass'

extend({ EffectComposer, ShaderPass, RenderPass, WaterPass,SSAOPass, UnrealBloomPass, FilmPass, GlitchPass })

export default function Effects(x) {
  const composer = useRef()
  const { scene, gl, size, camera } = useThree()
  const aspect = useMemo(() => new THREE.Vector2(size.width, size.height), [size])
  useEffect(() => void composer.current.setSize(size.width, size.height), [size])
  useFrame(() => composer.current.render(), 1)
  return (
    <effectComposer ref={composer} args={[gl]}>
        <renderPass attachArray="passes" scene={scene} camera={camera} />
        {/* <waterPass attachArray="passes" factor={1.5} /> */}
        <unrealBloomPass attachArray="passes" args={[aspect, 2, 1, 1]} />
        {/* <glitchPass attachArray="passes" factor={0.5} /> */}
        {/* <shaderPass
            attachArray="passes"
            args={[FXAAShader]}
            material-uniforms-resolution-value={[1 / size.width, 1 / size.height]}
            renderToScreen
        /> */}
        {/* <sSAOPass attachArray="passes" args={[scene, camera]} kernelRadius={0.6} maxDistance={0.03} /> */}
    </effectComposer>
  )
}
