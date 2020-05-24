import move from './move'
import arrayMutators from 'final-form-arrays'
import { setIn } from 'final-form'

const changeValue = jest.fn()
jest.mock('final-form-arrays')

// check the names are moved
// check the move function is called
describe('move', () => {
  afterEach(() => {
    arrayMutators.move.mockReset()
  })
  it('should do nothing if to === from', () => {
    const state = {
      formState: {
        values: {
          foo: ['one', 'two']
        }
      },
      fields: {
        foo: {
          name: 'foo',
          data: {
            NAME_LIST: ['one', 'two', 'three']
          }
        }
      }
    }
    move(['foo', 1, 1], state, { setIn, changeValue })
    expect(arrayMutators.move).toHaveBeenCalledTimes(0)
    expect(state).toEqual({
      formState: {
        values: {
          foo: ['one', 'two']
        }
      },
      fields: {
        foo: {
          name: 'foo',
          data: {
            NAME_LIST: ['one', 'two', 'three']
          }
        }
      }
    })
  })
  it('should leave data unchanged if NAME_LIST is undefined', () => {
    const state = {
      formState: {
        values: {
          foo: ['one', 'two', 'three']
        }
      },
      fields: {
        foo: {
          name: 'foo',
          data: {
            NAME_LIST: undefined
          }
        }
      }
    }
    move(['foo', 1, 2], state, { setIn, changeValue })
    expect(state.fields.foo.data.NAME_LIST).toBeUndefined()
    expect(arrayMutators.move).toHaveBeenCalledTimes(1)
    expect(arrayMutators.move.mock.calls[0]).toEqual([
      ['foo', 1, 2],
      state,
      { setIn, changeValue }
    ])
  })
  it('should move the appropriate names in NAME_LIST', () => {
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
    move(['foo', 1, 0], state, { setIn, changeValue })
    expect(state.fields.foo.data.NAME_LIST).toEqual(['two', 'one'])
    expect(arrayMutators.move).toHaveBeenCalledTimes(1)
    expect(arrayMutators.move.mock.calls[0][0]).toEqual(['foo', 1, 0])
  })
  it('should call arrayMutators.move with the appropriate args', () => {
    arrayMutators.move.mockReturnValue('bar')
    const state = {
      formState: {
        values: {
          foo: ['one', 'two', 'three']
        }
      },
      fields: {
        foo: {
          name: 'foo',
          touched: true,
          data: {
            NAME_LIST: ['one', 'two', 'three']
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
          foo: ['one', 'two', 'three']
        }
      },
      fields: {
        foo: {
          name: 'foo',
          touched: true,
          data: {
            NAME_LIST: ['one', 'three', 'two']
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
    const result = move(['foo', 2, 1], state, { setIn, changeValue })
    expect(result).toEqual('bar')
    expect(arrayMutators.move).toHaveBeenCalledTimes(1)
    expect(arrayMutators.move.mock.calls[0]).toEqual([
      ['foo', 2, 1],
      expected_state,
      { setIn, changeValue }
    ])
  })
})
