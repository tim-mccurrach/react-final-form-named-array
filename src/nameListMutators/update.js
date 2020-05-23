// @flow
import type { MutableState, Mutator, Tools } from 'final-form'
import arrayMutators from 'final-form-arrays'

import { NAME_LIST } from './constants'
import getIndex from './utils'

const update: Mutator<any> = (
  [name: string, indicator: string | number, value: any],
  state: MutableState<any>,
  tools: Tools<any>
) => {
  const currentNameList: ?(string[]) = state.fields[name].data[NAME_LIST]
  if (currentNameList) {
    if (typeof indicator === 'string' || indicator instanceof String) {
      indicator = getIndex(indicator, currentNameList)
    }
    if (indicator === undefined) {
      // update nothing if indicator is undefined
      indicator = currentNameList.length
    }
    currentNameList.splice(indicator, 1, value)
    state.fields[name].data = tools.setIn(
      state.fields[name].data,
      NAME_LIST,
      currentNameList
    )
  }

  return arrayMutators.update([name, indicator], state, tools)
}

export default update
