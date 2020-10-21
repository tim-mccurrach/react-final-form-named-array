// it should add something to the data
// it should call the original mutator
import push from './push'
import arrayMutators from 'final-form-arrays'
import { setIn } from 'final-form'

const changeValue = jest.fn()
jest.mock('final-form-arrays')

describe('push', () => {
  afterEach(() => {
    arrayMutators.push.mockReset()
  })

  it('should add one value to NAME_LIST', () => {
    const state = {
      formState: {
        values: {
          foo: ['one']
        }
      },
      fields: {
        foo: {
          name: 'foo',
          touched: true,
          data: {
            NAME_LIST: ['one']
          }
        },
        'foo[0]': {
          name: 'foo[0]',
          touched: true,
          error: 'First Error'
        }
      }
    }
    push(['foo', 'two', v => v + '_bar'], state, { setIn, changeValue })
    expect(state.fields.foo.data).toEqual({
      NAME_LIST: ['one', 'two_bar']
    })
  })

  it('should do nothing if NAME_LIST is undefined', () => {
    const state = {
      formState: {
        values: {
          foo: []
        }
      },
      fields: {
        foo: {
          name: 'foo',
          touched: false,
          data: {
            NAME_LIST: undefined,
            foo: 'bar'
          }
        }
      }
    }
    push(['foo', 'two', v => v + '_bar'], state, { setIn, changeValue })
    expect(state.fields.foo.data).toEqual({
      NAME_LIST: undefined,
      foo: 'bar'
    })
  })

  it('should call the original push mutator once', () => {
    const state = {
      formState: {
        values: {
          foo: ['one']
        }
      },
      fields: {
        foo: {
          name: 'foo',
          touched: true,
          data: {
            NAME_LIST: ['one']
          }
        },
        'foo[0]': {
          name: 'foo[0]',
          touched: true,
          error: 'First Error'
        }
      }
    }
    const expected_state = {
      formState: {
        values: {
          foo: ['one']
        }
      },
      fields: {
        foo: {
          name: 'foo',
          touched: true,
          data: {
            NAME_LIST: ['one', 'two_bar']
          }
        },
        'foo[0]': {
          name: 'foo[0]',
          touched: true,
          error: 'First Error'
        }
      }
    }
    push(['foo', 'two', v => v + '_bar'], state, {
      setIn,
      changeValue
    })
    expect(state.fields.foo.data.NAME_LIST).toEqual(['one', 'two_bar'])
    expect(arrayMutators.push).toHaveBeenCalledTimes(1)
    expect(arrayMutators.push.mock.calls[0]).toEqual([
      ['foo', 'two'],
      expected_state,
      { setIn, changeValue }
    ])
  })
  it('should return the name added to the name list', () => {
    const state = {
      formState: {
        values: {
          foo: ['one']
        }
      },
      fields: {
        foo: {
          name: 'foo',
          touched: true,
          data: {
            NAME_LIST: ['one']
          }
        },
        'foo[0]': {
          name: 'foo[0]',
          touched: true,
          error: 'First Error'
        }
      }
    }
    const result = push(['foo', 'two', v => v + '_bar'], state, {
      setIn,
      changeValue
    })
    expect(result).toEqual('two_bar')
  })
  it('should add the specified name if getItemName is a string', () => {
    const state = {
      formState: {
        values: {
          foo: ['one']
        }
      },
      fields: {
        foo: {
          name: 'foo',
          touched: true,
          data: {
            NAME_LIST: ['one']
          }
        },
        'foo[0]': {
          name: 'foo[0]',
          touched: true,
          error: 'First Error'
        }
      }
    }
    const result = push(['foo', 'two', 'newItem'], state, {
      setIn,
      changeValue
    })
    expect(result).toEqual('newItem')
    expect(state.fields.foo.data.NAME_LIST).toEqual(['one', 'newItem'])
  })
})
