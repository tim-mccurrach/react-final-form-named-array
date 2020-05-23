//@flow
/*
 * Similar to the built in indexOf except that if name
 * is not in the list, undefined is returned instead of -1
 */
const getIndex = (name: string, names: string[]): number | void => {
  const index: number = names.indexOf(name)
  if (index === -1) {
    return undefined
  }
  return index
}

export default getIndex
