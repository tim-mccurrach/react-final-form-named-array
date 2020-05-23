import type { Mutator } from 'final-form'
import arrayMutators from 'final-form-arrays'

import pop from './pop'
import push from './push'
import remove from './remove'
import setNameList from './setNameList'
import setNameListInitialised from './setNameListInitialised'

export const mutatorsUsingGetItemName: string[] = ['push']

const mutators: { [string]: Mutator<any> } = {
  ...arrayMutators,
  pop,
  push,
  remove,
  setNameList,
  setNameListInitialised
}

export default mutators
