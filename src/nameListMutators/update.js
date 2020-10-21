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
      // do nothing if indicator is undefined
      return
    }
    if (typeof value === 'function') {
      const currentValue = tools.getIn(state.formState.values, name)
      value = value(currentValue[indicator], currentValue)
    }
  }
  return arrayMutators.update([name, indicator, value], state, tools)
}

export default update
