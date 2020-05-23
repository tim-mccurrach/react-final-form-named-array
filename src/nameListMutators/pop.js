// @flow
import type { MutableState, Mutator, Tools } from 'final-form'
import { NAME_LIST } from './constants'
import arrayMutators from 'final-form-arrays'

const pop: Mutator<any> = (
  [name]: any[],
  state: MutableState<any>,
  tools: Tools<any>
) => {
  const nameList: ?(string[]) = state.fields[name].data[NAME_LIST]
  if (nameList) {
    nameList.pop()
    state.fields[name].data = tools.setIn(
      state.fields[name].data,
      NAME_LIST,
      nameList
    )
  }
  return arrayMutators.pop([name], state, tools)
}

export default pop
