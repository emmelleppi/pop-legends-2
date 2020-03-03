import create from 'zustand'

const [useStore] = create(set => ({
  objs: [],
  addObj: newObj => set(state => ({ objs: [...state.objs, newObj] })),
  removeObj: obj => set(state => ({ objs: state.objs.filter(item => item.uuid !== obj.uuid) }))
}))

export default useStore