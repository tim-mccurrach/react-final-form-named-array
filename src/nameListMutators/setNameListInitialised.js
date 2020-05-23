import type { MutableState, Mutator, Tools } from 'final-form'
import { NAME_LIST_INITIALISED } from './constants'

const setNameListInitialised: Mutator<any> = (
  [name, value]: any[],
  state: MutableState,
  { setIn }: Tools<any>
) => {
  state.fields[name].data = setIn(
    state.fields[name].data,
    NAME_LIST_INITIALISED,
    value
  )
}

export default setNameListInitialised
