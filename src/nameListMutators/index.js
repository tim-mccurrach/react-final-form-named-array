import type { Mutator } from 'final-form'
import arrayMutators from 'final-form-arrays'

import setNameList from './setNameList'
import setNameListInitialised from './setNameListInitialised'

export const mutatorsUsingGetItemName: string[] = []

const mutators: { [string]: Mutator<any> } = {
  ...arrayMutators,
  setNameList,
  setNameListInitialised
}

export default mutators
