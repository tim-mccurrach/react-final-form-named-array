# 🏁 React Final Form Named Arrays

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

---

Provides a component very similar to FieldArray, but that allows you to refer to items within the array by a unique key as well as by an index. This repo is for all intents and purposes a fork of `react-final-form-arrays`. The only reason it is not an actual fork is so that I can keep a separate fork with which to continue contributing to `react-final-form-arrays`.

### Motivation and Philosophy

This component was born out of a need to asynchronously update values within a Field Array, whilst the order of the array is subject to change. A callback that uses an index is obviously going to cause problems, and so some kind of unique identifier is required.

(The actual use case, was uploading multiple files at the same time. We want to update the progress of individual files, but calling `fields.update(index, value)` would produce undesirable results if one upload was deleted whilst another was in progress - as the array indicies would all shift). We therefore need to be able to update by referring to some sort of unique key, rather than an index.

The basic idea is that each element in the array has a name (key), that can be used to refer to it's corresponding element. The `FieldArray` component keeps track of the names in a `NAME_LIST` stored in the fields meta data. Any changes made to the array are kept track of and applied to the `NAME_LIST`.

### Installation

```
npm install react-final-form-named-arrays
```

### API

`react-final-form-named-arrays` exports a component (`FieldArray`), a hook (`useFieldArray`), and an objects containing Mutators (see final-form docs). These three exports behave are very similar to the corresponding entities from `react-final-form-arrays` however there are a few key differences:

- `FieldArray` and `useFieldArray` accept an additional prop `getItemName` (see below).
- If the `getItemName` prop is absent, the behaviour will remain the same as a normal `FieldArray`
- If `getItemName` is present:
  - The `remove` and `update` mutators can optionally be called with a string, instead of an index.
  - `fields.map` returns an iterator with an additional argument (value) - further detail below

### `getItemName?: (value: any, values: ?any[]) => string`

Under the hood, FieldArray keeps track of an array of keys (or names) for all of the items in your array. Every time the array is rearranged in some way, the array of names is also updated. The allows you to call functions like `update` or `remove` with a key rather than an index. `getItemName` is the function used to assign a name to each item in your list. It is run only once for each item - either when the form is (re)initialised or when the item is added to the array. It is called with the following arguments:

`value`: is the item that is being added to the array
`values`: is the value of the whole array. When items are being added to an array, the name is generated before it is added, so values will refer to the array before that item is added. When the array of names is seeded from `initialValues` values will be equal to `initialValues`

`getItemName` must return a string. It is important that the item 'name' be unique, and should be determined in such a way that

### Mutators

// NEED TO ADD SOMETHING ABOUT USING MUTATORS WHEN NOT CURRIED VIA FIELDS E.G. USING THEM FROM 'FORM'

### Example

### General Warning about initial values

// Need to add some warnings about using changeValue

# Roadmap

I am going to test-drive 'named-fields' as it is for a little while and see how well things work before taking it any further. There are a few changes I'm considering, but think it best just to try it out for a bit first.

1. Add all of the mutators (concat, insert, removeBatch, shift, unshift, swap)
2. Consider if move, should accept names as well as indexes.
3. Improve testing of async situation
