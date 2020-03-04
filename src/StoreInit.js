import { useEffect, useMemo } from "react";
import { useThree } from "react-three-fiber";
import * as THREE from "three";

import { VH_MULT, useAspect, useScrollMax } from "./store"

function StoreInit() {
    const { size } = useThree()
    
    const setAspect = useAspect(state => state.setAspect)
    const setScrollMax = useScrollMax(state => state.setScrollMax)
    
    const scrollMax = (VH_MULT - 1) * size.height
    const aspect = useMemo(() => new THREE.Vector2(size.width, size.height), [size])
  
    useEffect(() => {
      setAspect(aspect)
      setScrollMax(scrollMax)
    }, [setAspect, setScrollMax, aspect, scrollMax])
  
    return null
}

export default StoreInit