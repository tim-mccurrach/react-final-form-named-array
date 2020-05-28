// @flow
import type { MutableState, Mutator, Tools } from 'final-form'
import { NAME_LIST } from './constants'
import arrayMutators from 'final-form-arrays'

const push: Mutator<any> = (
  [name, value, getItemName]: any[],
  state: MutableState<any>,
  tools: Tools<any>
) => {
  const currentNameList: ?(string[]) = state.fields[name].data[NAME_LIST]
  var itemName
  if (currentNameList) {
    if (typeof getItemName === 'string') {
      itemName = getItemName
    } else {
      itemName = getItemName(value)
    }
    currentNameList.push(itemName)
    state.fields[name].data = tools.setIn(
      state.fields[name].data,
      NAME_LIST,
      currentNameList
    )
  }
  arrayMutators.push([name, value], state, tools)
  return itemName
}

export default push
