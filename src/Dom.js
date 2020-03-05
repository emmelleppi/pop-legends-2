import React, { useEffect, useCallback, useRef, useState } from "react"
import styled from "styled-components"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookSquare, faInstagram } from '@fortawesome/free-brands-svg-icons'

import { VH_MULT, scroll, mouse, rotation } from "./store"

function Dom(props) {
    const { isMobile } = props
    const [clicked, setClicked] = useState(false)
    const [scrolled, setScrolled] = useState(false)
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

    useEffect(() => {
      const f = () => setScrolled(true)
      scrollArea.current.addEventListener("scroll", f)

      return () => scrollArea.current.removeEventListener("scroll", f)
    }, [setScrolled])

    return (
        <ScrollArea ref={scrollArea} onScroll={onScroll} onMouseMove={onMouseMove}>
            {isMobile && !clicked && (
              <ButtonWrapper>
                <Button onClick={grantDeviceMotion} >CLICCAMI<br/>👆🏼</Button>
              </ButtonWrapper>
            )}
            {!scrolled && (
              <Scrolla>
                <div>Scrolla</div>
              </Scrolla>
            )}
            <IconsWrapper>
            {[
              { id: 0, link: "https://www.facebook.com/events/s/2103-pop-legends-2-al-bloom-me/204630327319993/", icon: faFacebookSquare },
              { id: 1, link: "https://www.instagram.com/poplegends2/", icon: faInstagram },
            ].map(({ id, link, icon }) => (
              <Icon key={id} href={link} target="_blank">
                <FontAwesomeIcon size="2x" icon={icon} />
              </Icon>
            ))}
            </IconsWrapper>
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
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9;
  background: rgba(255, 255, 255, 0.7);
`
const Button = styled.button`
  padding: 0;
  margin: 0;
  padding-top: 1rem;
  background: cornsilk;
  width: 10rem;
  height: 10rem;
  border-radius: 50%;
  border: 0.5rem solid #ea7bbe;
  color: #ea7bbe;
  font-size: 1.5rem;
  font-weight: bolder;
  text-align: center;
  font-family: 'Fredoka One', cursive;
`
const Scrolla = styled.div`
  position: fixed;
  width: 100vw;
  bottom: 2rem;
  display: flex;
  justify-content: center;
  z-index: 9;

  font-size: 2rem;
  font-weight: bolder;
  text-transform: uppercase;
  color: white;

  animation:  bounceIn 2s ease-in-out 0s infinite;
  @-webkit-keyframes bounceIn {
    0% {
      bottom: 2rem;
    }
    100% {
      bottom: 4rem;
    }
  }
  @keyframes bounceIn {
    0% {
      bottom: 2rem;
    }
    50% {
      bottom: 4rem;
    }
    100% {
      bottom: 2rem;
    }
  }
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

const IconsWrapper = styled.div`
  position: fixed;
  top: 1rem;
  right: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Icon = styled.a`
  color: white;
  margin: 0 0.5rem;
  cursor: pointer;

  :hover {
    transform: scale(1.2);
  }
`

export default Dom