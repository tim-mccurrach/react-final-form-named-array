import update from './update'
import arrayMutators from 'final-form-arrays'
import { getIn, setIn } from 'final-form'

const changeValue = jest.fn()
jest.mock('final-form-arrays')

describe('update', () => {
  afterEach(() => {
    arrayMutators.update.mockReset()
  })
  it('should leave NAME_LIST unchanged', () => {
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
    update(['foo', 2], state, { changeValue, setIn })
    expect(state.fields.foo.data.NAME_LIST).toEqual(['one', 'two', 'three'])
  })
  it('should call arrayMutators.update with the appropriate args', () => {
    arrayMutators.update.mockReturnValue('fooBar')
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
        }
      }
    }
    const result = update(['foo', 1, 'bar'], state, { changeValue, setIn })
    expect(result).toEqual('fooBar')
    expect(arrayMutators.update).toHaveBeenCalledTimes(1)
    expect(arrayMutators.update.mock.calls[0]).toEqual([
      ['foo', 1, 'bar'],
      state,
      { changeValue, setIn }
    ])
  })
  it('should call arrayMutators.update with the appropriate args - using name', () => {
    arrayMutators.update.mockReturnValue('fooBar')
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
        }
      }
    }
    const result = update(['foo', 'two', 'bar'], state, { changeValue, setIn })
    expect(result).toEqual('fooBar')
    expect(arrayMutators.update).toHaveBeenCalledTimes(1)
    expect(arrayMutators.update.mock.calls[0]).toEqual([
      ['foo', 1, 'bar'],
      state,
      { changeValue, setIn }
    ])
  })
  it('should do nothing when given a key with not included in NAME_LIST', () => {
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
        }
      }
    }
    const result = update(['foo', 'four', 'bar'], state, { changeValue, setIn })
    expect(result).toBeUndefined()
    expect(arrayMutators.update).toHaveBeenCalledTimes(0)
    expect(state.fields.foo.data.NAME_LIST).toEqual(['one', 'two', 'three'])
  })
  it('should leave keys unchanged if NAME_LIST is undefined', () => {
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
          data: {}
        }
      }
    }
    update(['foo', 'two', 'bar'], state, { changeValue, setIn })
    expect(arrayMutators.update).toHaveBeenCalledTimes(1)
    expect(arrayMutators.update.mock.calls[0]).toEqual([
      ['foo', 'two', 'bar'],
      state,
      { changeValue, setIn }
    ])
  })
  it("should call value with the current value, and array values if 'value' is a function", () => {
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
        }
      }
    }
    const value = jest.fn()
    value.mockReturnValueOnce('bar')
    update(['foo', 'two', value], state, { changeValue, setIn, getIn })
    expect(value).toHaveBeenCalledTimes(1)
    expect(value.mock.calls[0]).toEqual(['two', ['one', 'two', 'three']])
    expect(arrayMutators.update).toHaveBeenCalledTimes(1)
    expect(arrayMutators.update.mock.calls[0]).toEqual([
      ['foo', 1, 'bar'],
      state,
      { changeValue, setIn, getIn }
    ])
  })
})
