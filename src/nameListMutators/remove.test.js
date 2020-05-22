import remove from './remove'
import arrayMutators from 'final-form-arrays'
import { setIn } from 'final-form'

const changeValue = jest.fn()
const renameField = jest.fn()
jest.mock('final-form-arrays')

describe('pop', () => {
  afterEach(() => {
    arrayMutators.remove.mockReset()
  })

  it('should remove the appropriate item from NAME_LIST', () => {
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
            NAME_LIST: ['one', 'two', 'three'],
            NAME_LIST_INITIALISED: true
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
    remove(['foo', 1], state, { setIn, changeValue, renameField })
    expect(state.fields.foo.data).toEqual({
      NAME_LIST: ['one', 'three'],
      NAME_LIST_INITIALISED: true
    })
    expect(arrayMutators.remove.mock.calls[0][0]).toEqual(['foo', 1])
  })

  it('should do nothing when NAME_LIST is empty', () => {
    const state = {
      formState: {
        values: {
          foo: []
        }
      },
      fields: {
        foo: {
          name: 'foo',
          touched: true,
          data: {
            NAME_LIST: [],
            NAME_LIST_INITIALISED: true
          }
        }
      }
    }
    const result = remove(['foo', 1], state, {
      setIn,
      changeValue,
      renameField
    })
    expect(state.fields.foo.data).toEqual({
      NAME_LIST: [],
      NAME_LIST_INITIALISED: true
    })
    expect(result).toBeUndefined()
    expect(arrayMutators.remove.mock.calls[0][0]).toEqual(['foo', 1])
  })

  it('should treat NAME_LIST undefined same as an empty list - using index', () => {
    const state = {
      formState: {
        values: {
          foo: []
        }
      },
      fields: {
        foo: {
          name: 'foo',
          touched: true,
          data: {
            NAME_LIST: undefined,
            NAME_LIST_INITIALISED: true
          }
        }
      }
    }
    const result = remove(['foo', 1], state, {
      setIn,
      changeValue,
      renameField
    })
    expect(state.fields.foo.data).toEqual({
      NAME_LIST: [],
      NAME_LIST_INITIALISED: true
    })
    expect(result).toBeUndefined()
    expect(arrayMutators.remove.mock.calls[0][0]).toEqual(['foo', 1])
  })

  it('should treat NAME_LIST undefined same as an empty list - using name', () => {
    const state = {
      formState: {
        values: {
          foo: []
        }
      },
      fields: {
        foo: {
          name: 'foo',
          touched: true,
          data: {
            NAME_LIST: undefined,
            NAME_LIST_INITIALISED: true
          }
        }
      }
    }
    const result = remove(['foo', 'two'], state, {
      setIn,
      changeValue,
      renameField
    })
    expect(state.fields.foo.data).toEqual({
      NAME_LIST: [],
      NAME_LIST_INITIALISED: true
    })
    expect(result).toBeUndefined()
    expect(arrayMutators.remove.mock.calls[0][0]).toEqual(['foo', 0])
  })

  it('should remove the appropriate element when a name is given', () => {
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
            NAME_LIST: ['one', 'two', 'three'],
            NAME_LIST_INITIALISED: true
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
    remove(['foo', 'two'], state, {
      setIn,
      changeValue,
      renameField
    })
    expect(state.fields.foo.data).toEqual({
      NAME_LIST: ['one', 'three'],
      NAME_LIST_INITIALISED: true
    })
    expect(arrayMutators.remove.mock.calls[0][0]).toEqual(['foo', 1])
  })

  it('should leave NAME_LIST unchanged if the name provided is not in present', () => {
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
            NAME_LIST: ['one', 'two', 'three'],
            NAME_LIST_INITIALISED: true
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
    const result = remove(['foo', 'four'], state, {
      setIn,
      changeValue,
      renameField
    })
    expect(state.fields.foo.data).toEqual({
      NAME_LIST: ['one', 'two', 'three'],
      NAME_LIST_INITIALISED: true
    })
    expect(result).toBeUndefined()
    expect(arrayMutators.remove).toHaveBeenCalledTimes(1)
    expect(arrayMutators.remove.mock.calls[0][0]).toEqual(['foo', 3])
  })

  it('should call arrayMutators.remove and return the return value', () => {
    arrayMutators.remove.mockReturnValue('bar')
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
            NAME_LIST: ['one', 'two', 'three'],
            NAME_LIST_INITIALISED: true
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
            NAME_LIST: ['one', 'three'],
            NAME_LIST_INITIALISED: true
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

    const result = remove(['foo', 'two'], state, {
      setIn,
      changeValue,
      renameField
    })
    expect(result).toEqual('bar')
    expect(arrayMutators.remove).toHaveBeenCalledTimes(1)
    expect(arrayMutators.remove.mock.calls[0]).toEqual([
      ['foo', 1],
      expected_state,
      { setIn, changeValue, renameField }
    ])
  })
})
