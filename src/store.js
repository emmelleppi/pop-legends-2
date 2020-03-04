import create from 'zustand'
import niceColors from 'nice-color-palettes'
import * as THREE from "three";
import { createRef } from 'react';

export const [useOutline] = create(set => ({
  objs: [],
  addObj: newObj => set(state => ({ objs: [...state.objs, newObj] })),
  removeObj: obj => set(state => ({ objs: state.objs.filter(item => item.uuid !== obj.uuid) }))
}))

export const [useAspect] = create(set => ({
  aspect: new THREE.Vector2(),
  setAspect: vec => set({ aspect: vec }),
}))

export const [useScrollMax] = create(set => ({
  scrollMax: 0,
  setScrollMax: val => set({ scrollMax: val }),
}))

export const scroll = createRef()
export const mouse = createRef([0, 0])

export const COLORS = niceColors[1]
export const VH_MULT = 30

