// @flow
import React from 'react'
import { useForm, useField } from 'react-final-form'
import { fieldSubscriptionItems, ARRAY_ERROR } from 'final-form'
import type { Mutators } from 'final-form-arrays'
import type { FieldValidator, FieldSubscription } from 'final-form'

import { mutatorsUsingGetItemName } from './nameListMutators'
import { NAME_LIST_INITIALISED } from './nameListMutators/constants'
import type { FieldArrayRenderProps, UseFieldArrayConfig } from './types'
import defaultIsEqual from './defaultIsEqual'
import useConstant from './useConstant'

const all: FieldSubscription = fieldSubscriptionItems.reduce((result, key) => {
  result[key] = true
  return result
}, {})

const useFieldArray = (
  name: string,
  {
    subscription = all,
    getItemName,
    defaultValue,
    initialValue,
    isEqual = defaultIsEqual,
    validate: validateProp
  }: UseFieldArrayConfig = {}
): FieldArrayRenderProps => {
  const form = useForm('useFieldArray')

  const formMutators: Mutators = form.mutators
  const hasMutators = !!(
    formMutators &&
    formMutators.push &&
    formMutators.pop &&
    formMutators.setNameList &&
    formMutators.setNameListInitialised
  )
  if (!hasMutators) {
    throw new Error(
      'Array mutators not found. You need to provide the mutators from react-final-form-named-arrays to your form'
    )
  }

  const mutators = useConstant<Mutators>(() => {
    // curry the field name onto all mutator calls
    // and also getItemName if applicable
    return Object.keys(formMutators).reduce((result, key) => {
      if (getItemName && mutatorsUsingGetItemName.includes(key)) {
        result[key] = (...args) => {
          return formMutators[key](name, ...args, getItemName)
        }
      } else {
        result[key] = (...args) => formMutators[key](name, ...args)
      }
      return result
    }, {})
  })

  const validate: FieldValidator = useConstant(
    () => (value, allValues, meta) => {
      if (!validateProp) return undefined
      const error = validateProp(value, allValues, meta)
      if (!error || Array.isArray(error)) {
        return error
      } else {
        const arrayError = []
        // gross, but we have to set a string key on the array
        ;((arrayError: any): Object)[ARRAY_ERROR] = error
        return arrayError
      }
    }
  )

  const {
    meta: { length, ...meta },
    input,
    ...fieldState
  } = useField(name, {
    subscription: { ...subscription, length: true },
    defaultValue,
    initialValue,
    isEqual,
    validate,
    format: v => v
  })

  const reinitialiseNameList = initial_data => {
    mutators.setNameList(
      initial_data && getItemName
        ? initial_data.map(value => getItemName(value, initial_data))
        : []
    )
    mutators.setNameListInitialised(true)
  }

  // set initial name list during first render
  const firstRender = React.useRef(true)
  React.useEffect(() => {
    if (getItemName && meta.initial) {
      reinitialiseNameList(meta.initial)
      firstRender.current = false
    }
  }, [])

  // reset name list when form is reset:
  // Ideally we would use modified here rather than pristine, however
  // there are two erros with modified at the time of writing, that would
  // make this difficult:
  // 1) https://github.com/final-form/final-form/issues/317
  // 2) https://github.com/final-form/final-form-arrays/issues/53
  if (
    getItemName &&
    !firstRender &&
    meta.pristine &&
    meta.data &&
    !meta.data[NAME_LIST_INITIALISED]
  ) {
    // note that this will not
    reinitialiseNameList()
  }
  // if the field is no longer prisitne, set NAME_LIST_INITIALISED variable
  // to false so that if the field returns to pristine again, then the name
  // list will be initialised.
  if (
    getItemName &&
    meta.data &&
    meta.data[NAME_LIST_INITIALISED] &&
    !meta.pristine
  ) {
    mutators.setNameListInitialised(false)
  }

  const forEach = (iterator: (name: string, index: number) => void): void => {
    // required || for Flow, but results in uncovered line in Jest/Istanbul
    // istanbul ignore next
    const len = length || 0
    for (let i = 0; i < len; i++) {
      iterator(`${name}[${i}]`, i)
    }
  }

  const map = (iterator: (name: string, index: number) => any): any[] => {
    // required || for Flow, but results in uncovered line in Jest/Istanbul
    // istanbul ignore next
    const len = length || 0
    const results: any[] = []
    for (let i = 0; i < len; i++) {
      results.push(iterator(`${name}[${i}]`, i))
    }
    return results
  }

  return {
    fields: {
      name,
      forEach,
      length: length || 0,
      map,
      ...mutators,
      ...fieldState,
      value: input.value
    },
    meta
  }
}

export default useFieldArray
