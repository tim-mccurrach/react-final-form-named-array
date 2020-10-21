// based off examples given at final-form.org
import React from 'react'
import Styles from './styles'
import { Form, Field } from 'react-final-form'
import { arrayMutators } from '../src'
import { FieldArray } from '../src'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const onSubmit = async values => {
  await sleep(300)
  window.alert(JSON.stringify(values, 0, 2))
}

const ProgressBar = ({ value, updateCallback, id }) => {
  const callback = React.useCallback(
    progress => {
      updateCallback(id, current => {
        return { ...current, progress }
      })
    },
    [updateCallback, id]
  )
  const startedProgress = React.useRef(true)
  React.useEffect(() => {
    if (startedProgress.current && id) {
      startedProgress.current = false
      const loadingTime = Math.ceil(Math.random() * 40) / 4
      const showProgress = async () => {
        var i
        for (i = 0; i < 100; i++) {
          await sleep(loadingTime * 10)
          callback(i + 1)
        }
      }
      showProgress()
    }
  }, [callback, id])
  return value && value !== 100 ? <progress max={100} value={value} /> : <div />
}

export default () => (
  <Styles>
    <h1>
      <span role="img" aria-label="flag">
        🏁
      </span>{' '}
      React Final Form - Array Fields
    </h1>
    <a href="https://github.com/erikras/react-final-form#-react-final-form">
      Read Docs
    </a>
    <Form
      onSubmit={onSubmit}
      mutators={{
        ...arrayMutators
      }}
      render={({
        handleSubmit,
        form: {
          mutators: { push, pop }
        }, // injected from final-form-arrays above
        pristine,
        form,
        submitting,
        values
      }) => {
        const counter = React.useRef({ count: 0 })
        return (
          <form onSubmit={handleSubmit}>
            <div>
              <label>Company</label>
              <Field name="company" component="input" />
            </div>
            <div className="buttons">
              <button
                type="button"
                onClick={() => {
                  counter.current.count += 1
                  push(
                    'customers',
                    {
                      id: `${counter.current.count}`,
                      progress: 0
                    },
                    `${counter.current.count}`
                  )
                }}
              >
                Add Customer
              </button>
              <button type="button" onClick={() => pop('customers')}>
                Remove Customer
              </button>
            </div>
            <FieldArray name="customers" getItemName={value => value.id}>
              {({ fields }) =>
                fields.map((name, index, value) => (
                  <div key={name}>
                    <label>Cust. #{index + 1}</label>
                    <Field
                      name={`${name}.firstName`}
                      component="input"
                      placeholder="First Name"
                    />
                    <Field
                      name={`${name}.lastName`}
                      component="input"
                      placeholder="Last Name"
                    />
                    <Field
                      name={`${name}.progress`}
                      render={({ input }) => {
                        return (
                          <ProgressBar
                            value={input.value}
                            updateCallback={fields.update}
                            id={value.id}
                          />
                        )
                      }}
                    />
                    <span
                      onClick={() => fields.remove(value.id)}
                      style={{ cursor: 'pointer' }}
                      role="img"
                      aria-label="close"
                    >
                      ❌
                    </span>
                  </div>
                ))
              }
            </FieldArray>

            <div className="buttons">
              <button type="submit" disabled={submitting || pristine}>
                Submit
              </button>
              <button
                type="button"
                onClick={form.reset}
                disabled={submitting || pristine}
              >
                Reset
              </button>
            </div>
            <pre>{JSON.stringify(values, 0, 2)}</pre>
          </form>
        )
      }}
    />
  </Styles>
)
