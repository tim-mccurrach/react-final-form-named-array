// @flow
import type { MutableState, Mutator, Tools } from 'final-form'
import { NAME_LIST } from './constants'
import arrayMutators from 'final-form-arrays'

const push: Mutator<any> = (
  [name, value, getItemName]: any[],
  state: MutableState<any>,
  tools: Tools<any>
) => {
  const currentNameList: string[] = state.fields[name].data[NAME_LIST]
  if (currentNameList) {
    currentNameList.push(getItemName(value))
    state.fields[name].data = tools.setIn(
      state.fields[name].data,
      NAME_LIST,
      currentNameList
    )
  } else {
    state.fields[name].data = tools.setIn(state.fields[name].data, NAME_LIST, [
      getItemName(value)
    ])
  }
  return arrayMutators.push([name, value], state, tools)
}

export default push
