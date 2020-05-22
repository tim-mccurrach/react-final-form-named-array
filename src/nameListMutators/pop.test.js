// it should add something to the data
// it should call the original mutator
import pop from './pop'
import { cleanup } from '@testing-library/react'
import arrayMutators from 'final-form-arrays'
import { setIn } from 'final-form'

const changeValue = jest.fn()
jest.mock('final-form-arrays')

describe('pop', () => {
  afterEach(() => {
    arrayMutators.pop.mockReset()
  })
  it('should return the return value of arrayMutators.pop', () => {
    arrayMutators.pop.mockReturnValue('bar')
    const result = pop(
      ['foo'],
      { fields: { foo: { data: { NAME_LIST: [] } } } },
      { setIn }
    )
    expect(result).toEqual('bar')
  })
  it('should remove one value to NAME_LIST', () => {
    const state = {
      formState: {
        values: {
          foo: ['one', 'two']
        }
      },
      fields: {
        foo: {
          name: 'foo',
          touched: true,
          data: {
            NAME_LIST: ['one', 'two']
          }
        },
        'foo[0]': {
          name: 'foo[0]',
          touched: true,
          error: 'First Error'
        },
        'foo[1]': {
          name: 'foo[1]',
          touched: false,
          error: 'Second Error'
        }
      }
    }
    pop(['foo'], state, { setIn, changeValue })
    expect((state.fields.foo.data.NAME_LIST = ['one']))
  })
  it('should return an empty array if array is empty', () => {
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
            NAME_LIST: []
          }
        }
      }
    }
    pop(['foo'], state, { setIn, changeValue })
    expect(state.fields.foo.data.NAME_LIST).toEqual([])
  })
  it('should leave data unchanged if NAME_ARRAY is undefined', () => {
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
            NAME_LIST: undefined
          }
        }
      }
    }
    pop(['foo'], state, { setIn, changeValue })
    expect(state.fields.foo.data.NAME_LIST).toBe(undefined)
  })
  it('should call the original pop mutator once', () => {
    const state = {
      formState: {
        values: {
          foo: ['one', 'two']
        }
      },
      fields: {
        foo: {
          name: 'foo',
          touched: true,
          data: {
            NAME_LIST: ['one', 'two']
          }
        },
        'foo[0]': {
          name: 'foo[0]',
          touched: true,
          error: 'First Error'
        },
        'foo[1]': {
          name: 'foo[1]',
          touched: false,
          error: 'Second Error'
        }
      }
    }
    const expected_state = {
      formState: {
        values: {
          foo: ['one', 'two']
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
        },
        'foo[1]': {
          name: 'foo[1]',
          touched: false,
          error: 'Second Error'
        }
      }
    }
    pop(['foo'], state, { setIn, changeValue })
    expect((state.fields.foo.data.NAME_LIST = ['one']))
    expect(arrayMutators.pop).toHaveBeenCalled()
    expect(arrayMutators.pop).toHaveBeenCalledTimes(1)
    expect(arrayMutators.pop.mock.calls[0]).toEqual([
      ['foo'],
      expected_state,
      { setIn, changeValue }
    ])
  })
})
