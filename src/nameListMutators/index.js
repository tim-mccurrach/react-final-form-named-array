import type { Mutator } from 'final-form'
import arrayMutators from 'final-form-arrays'

import pop from './pop'
import push from './push'
import remove from './remove'
import setNameList from './setNameList'
import setNameListModified from './setNameListModified'

export const mutatorsUsingGetItemName: string[] = ['push']

const mutators: { [string]: Mutator<any> } = {
  ...arrayMutators,
  pop,
  push,
  remove,
  setNameList,
  setNameListModified
}

export default mutators
