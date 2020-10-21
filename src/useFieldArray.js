// @flow
import React from 'react'
import { useForm, useField } from 'react-final-form'
import { fieldSubscriptionItems, ARRAY_ERROR, getIn } from 'final-form'
import type { Mutators } from 'final-form-arrays'
import type { FieldValidator, FieldSubscription } from 'final-form'

import { mutatorsUsingGetItemName } from './nameListMutators'
import { NAME_LIST } from './nameListMutators/constants'
import type { FieldArrayRenderProps, UseFieldArrayConfig, Meta } from './types'
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
    formMutators.setNameList
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
        result[key] = (...args) => formMutators[key](name, ...args, getItemName)
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
  }: { meta: Meta, input: Object, ... } = useField(name, {
    subscription: { pristine: true, ...subscription, length: true },
    defaultValue,
    initialValue,
    isEqual,
    validate,
    format: v => v
  })

  const initialNameListValues = React.useRef([])

  const reinitialiseNameList = initial_data => {
    // required for Flow, but results in uncovered line in Jest/Istanbul
    // istanbul ignore next
    if (!getItemName) {
      return
    }
    const newNameList = initial_data
      ? initial_data.map(value => getItemName(value, initial_data))
      : []
    mutators.setNameList(newNameList)
    initialNameListValues.current = [...newNameList]
  }

  // when the initial values have changed the form will have been reset,
  // so we must update NAME_LIST to keep things in sync.
  React.useEffect(
    () => {
      if (getItemName) {
        form.subscribe(
          values => {
            const initialValue = getIn(values.initialValues, name)
            reinitialiseNameList(initialValue)
          },
          { initialValues: true }
        )
      }
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  // to detect when api.initalize has been called.
  const previouslyPrestine = React.useRef(meta.pristine)
  React.useEffect(() => {
    if (getItemName && meta.pristine !== previouslyPrestine.current) {
      if (
        meta.pristine &&
        (meta.data === undefined ||
          !defaultIsEqual(initialNameListValues.current, meta.data[NAME_LIST]))
      ) {
        const initialValue = getIn(form.getState().initialValues, name)
        reinitialiseNameList(initialValue)
      }
      previouslyPrestine.current = meta.pristine
    }
  })

  const forEach = (iterator: (name: string, index: number) => void): void => {
    // required || for Flow, but results in uncovered line in Jest/Istanbul
    // istanbul ignore next
    const len = length || 0
    for (let i = 0; i < len; i++) {
      iterator(`${name}[${i}]`, i)
    }
  }

  const map = (
    iterator: (name: string, index: number, value: any) => any
  ): any[] => {
    // required || for Flow, but results in uncovered line in Jest/Istanbul
    // istanbul ignore next
    const len = length || 0
    const results: any[] = []
    if (getItemName) {
      for (let i = 0; i < len; i++) {
        results.push(
          iterator(
            `${name}[${i}]`,
            i,
            input.value !== undefined && input.value[i]
          )
        )
      }
    } else {
      for (let i = 0; i < len; i++) {
        results.push(iterator(`${name}[${i}]`, i))
      }
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
