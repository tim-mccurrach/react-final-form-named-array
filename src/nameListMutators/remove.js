// @flow
import type { MutableState, Mutator, Tools } from 'final-form'
import arrayMutators from 'final-form-arrays'

import { NAME_LIST } from './constants'
import getIndex from './utils'

const remove: Mutator<any> = (
  [name: string, indicator: string | number],
  state: MutableState<any>,
  tools: Tools<any>
) => {
  const currentNameList: ?(string[]) = state.fields[name].data[NAME_LIST]
  if (typeof indicator === 'string' || indicator instanceof String) {
    indicator = getIndex(indicator, currentNameList)
  }
  const nameListCopy = [...(currentNameList || [])]
  if (indicator === undefined) {
    // remove nothing if indicator is undefinedch
    indicator = nameListCopy.length
  }
  nameListCopy.splice(indicator, 1)
  state.fields[name].data = tools.setIn(
    state.fields[name].data,
    NAME_LIST,
    nameListCopy
  )

  return arrayMutators.remove([name, indicator], state, tools)
}

export default remove
