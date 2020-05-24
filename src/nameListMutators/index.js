import type { Mutator } from 'final-form'
import arrayMutators from 'final-form-arrays'

import move from './move'
import pop from './pop'
import push from './push'
import remove from './remove'
import update from './update'
import setNameList from './setNameList'
import setNameListModified from './setNameListModified'

export const mutatorsUsingGetItemName: string[] = ['push']

const mutators: { [string]: Mutator<any> } = {
  ...arrayMutators,
  move,
  pop,
  push,
  remove,
  update,
  setNameList,
  setNameListModified
}

export default mutators
