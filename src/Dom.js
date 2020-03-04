import React, { useEffect, useCallback, useRef, useState } from "react"
import styled from "styled-components"

import { VH_MULT, scroll, mouse, rotation } from "./store"

function Dom(props) {
    const { isMobile } = props
    const [clicked, setClicked] = useState(false)
    const scrollArea = useRef()

    const onScroll = e => { scroll.current = e.target.scrollTop }
    useEffect(() => void onScroll({ target: scrollArea.current }), [])
  
    const onMouseMove = useCallback(({ clientX: x, clientY: y }) => (mouse.current = [x - window.innerWidth / 2, y - window.innerHeight / 2]), [])

    const onRotation = useCallback(
      function onRotation(event) {
        rotation.current = [event.rotationRate.alpha, event.rotationRate.beta,event.rotationRate.gamma]
      },
      []
    )

    const grantDeviceMotion = useCallback(() => {
      setClicked(true)
      if(isMobile){

        if (typeof DeviceMotionEvent.requestPermission === 'function') {

          DeviceMotionEvent.requestPermission()
            .then(permissionState => {
              if (permissionState === 'granted') {
                window.addEventListener('devicemotion', onRotation);
              } else {
                console.log("DeviceMotionEvent is not supported");
              }
            })
            .catch(console.error);
        }

      }
    }, [isMobile, onRotation, setClicked])

    return (
        <ScrollArea ref={scrollArea} onScroll={onScroll} onMouseMove={onMouseMove}>
            {isMobile && !clicked && (
              <ButtonWrapper>
                <Button onClick={grantDeviceMotion} >CLICCAMI<br/>PLS :(</Button>
              </ButtonWrapper>
            )}
            <Void mult={VH_MULT - 1} />
            <ImageWrapper>
              <Img src="/Rei.jpg" alt="REI CULO"/>
            </ImageWrapper>
        </ScrollArea>
    )
}


const ScrollArea = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: auto;
  scroll-behavior: smooth;
`

const Void = styled.div`
  height: ${props => props.mult * 100}vh;
`

const ImageWrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

const ButtonWrapper = styled(ImageWrapper)`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9;
  background: rgba(255, 255, 255, 0.7);
`
const Button = styled.button`
  background: cornsilk;
  width: 10rem;
  height: 10rem;
  border-radius: 50%;
  border: 0.5rem solid pink;
  color: pink;
  font-size: 1.5rem;
  font-weight: 900;
`

const Img = styled.img`
  width: 75vw;
  border-radius: 50%;
  border: .5rem solid white;
  @media screen and (min-width: 426px) {
    width: 50vw;
  }

  @media screen and (min-width: 769px) {
    width: 30rem;
  }
`

export default Dom