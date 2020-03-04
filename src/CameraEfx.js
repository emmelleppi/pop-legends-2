import { useFrame } from "react-three-fiber";
import lerp from "lerp";

import { scroll } from "./store";

function CameraEfx() {
    
    useFrame(({ camera }) => {
      camera.rotation.z = lerp(camera.rotation.z, scroll.current / 50000, 0.2)
      camera.position.z = lerp(camera.position.z, scroll.current / 1000, 0.2)
    })
  
    return null
}

  export default CameraEfx