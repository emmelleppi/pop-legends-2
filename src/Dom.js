import React, { useEffect, useCallback, useRef } from "react"
import styled from "styled-components"

import { VH_MULT, scroll, mouse } from "./store"

function Dom() {
    const scrollArea = useRef()

    const onScroll = e => { scroll.current = e.target.scrollTop }
    useEffect(() => void onScroll({ target: scrollArea.current }), [])
  
    const onMouseMove = useCallback(({ clientX: x, clientY: y }) => (mouse.current = [x - window.innerWidth / 2, y - window.innerHeight / 2]), [])

    return (
        <ScrollArea ref={scrollArea} onScroll={onScroll} onMouseMove={onMouseMove}>
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

const Img = styled.img`
  width: 75vw;
  border-radius: 50%;

  @media screen and (min-width: 426px) {
    width: 50vw;
  }

  @media screen and (min-width: 769px) {
    width: 30rem;
  }
`

export default Dom