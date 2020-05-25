# 🏁 React Final Form Named Arrays

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

---

Provides a component very similar to FieldArray, that allows you to refer to items within the array by a unique key as well as by an index. This repo is for all intents and purposes a fork of `react-final-form-arrays`. The only reason it is not an actual fork is so that I can keep a separate fork with which to continue contributing to `react-final-form-arrays`.

### Motivation

This component was born out of a need to asynchronously update values within a Field Array, whilst the order of the array is subject to change. (The actual use case, was uploading multiple files at the same time. We want to update the progress of individual files, but calling `fields.update(index, value)` would produce undesirable results if one upload was deleted whilst another was in progress - as the array indicies would all shift). We therefore need to be able to update by referring to some sort of unique key, rather than an index. There are ways this could be done outside of `FieldArray` but they are potentially very inefficient, and far less convenient.

### FieldArray

The FieldArray object acts in nearly exactly the same way to `FieldArray` provided by `react-final-form-arrays` however it accepts an additional prop, `getItemName`. If `getItemName` is not provided, then `FieldArray` will behave in exactly the same way. With `getItemName` provided, then the mutators `update` and `remove` can accept a string instead of an integer for the 'index' argument.

`getItemName`
Under the hood, FieldArray keeps track of an array of keys (or names) for all of the items in your array. Every time the array is rearranged in some way, the array of names is also updated. The allows you to call functions like `update` or `remove` with a key rather than an index. `getItemName` is the function used to assign a name to each item in your list. It is run only once for each item - either when the form is (re)initialised or when the item is added to the array.

value: is the item that is being added to the array
values: is the value of the whole array. When items are being added to an array, the name is generated before it is added, so values will refer to the array before that item is added. When the array of names is seeded from `initialValues` values will be equal to `initialValues`.
return value: The return value must be a string.

In order for `update` and `remove` to be used with names, and for their behaviour to be consistent, it is important that each name is unique.

# Roadmap

I am going to test-drive 'named-fields' as it is for a little while and see how well things work before taking it any further. There are a few changes I'm considering, but think it best just to try it out for a bit first.

1. Add all of the mutators (concat, insert, removeBatch, shift, unshift, swap)
2. Consider if move, should accept names as well as indexes.
3. Once issues in the main repos regarding `modified` are resolved, update the way initial names are processed
4. See if there is want for this to be added to the main `react-final-form-arrays` repo - it may well be to niche, and be considered unnecessary bloat.
