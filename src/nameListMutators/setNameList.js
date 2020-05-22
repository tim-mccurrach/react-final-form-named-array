import type { MutableState, Mutator, Tools } from 'final-form'
import { NAME_LIST } from './constants'

const setNameList: Mutator<any> = (
  [name, value]: any[],
  state: MutableState,
  { setIn }: Tools<any>
) => {
  if (state.fields[name]) {
    state.fields[name].data = setIn(state.fields[name].data, NAME_LIST, value)
  }
}

export default setNameList
