import { useFrame } from "react-three-fiber";
import * as THREE from "three";
import interpolate from 'color-interpolate'

import { COLORS, useScrollMax, scroll } from "./store";

function BgColorHandler() {
    const scrollMax = useScrollMax(state => state.scrollMax)

    const colorMap = interpolate(['#ea7bbe', ...COLORS, '#333'])
    
    useFrame(({ gl }) => {
      gl.setClearColor(new THREE.Color(colorMap(scroll.current / scrollMax)))
    })
  
    return null
}

  export default BgColorHandler