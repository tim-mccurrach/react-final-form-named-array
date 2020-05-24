// @flow
import type { MutableState, Mutator, Tools } from 'final-form'
import { NAME_LIST } from './constants'
import arrayMutators from 'final-form-arrays'

const move: Mutator<any> = (
  [name, from, to]: any[],
  state: MutableState<any>,
  tools: Tools<any>
) => {
  if (from === to) {
    return
  }
  const currentNameList: ?(string[]) = state.fields[name].data[NAME_LIST]
  if (currentNameList) {
    const value = currentNameList[from]
    currentNameList.splice(from, 1)
    currentNameList.splice(to, 0, value)
    state.fields[name].data = tools.setIn(
      state.fields[name].data,
      NAME_LIST,
      currentNameList
    )
  }

  return arrayMutators.move([name, from, to], state, tools)
}

export default move
