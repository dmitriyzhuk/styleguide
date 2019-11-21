import { Item, comparatorCurry } from './'

/**
 * Return new state with items toggled
 * @param state
 * @param item
 */
export function getToggledState(
  state: Array<Item>,
  item: Item,
  nodesKey: string = 'children',
  comparator: comparatorCurry
): Array<Item> {
  const stateIncludesItem = state.some(comparator(item))

  const bulkFilter = (row: Item) =>
    !getFlat(item, [], nodesKey).some(comparator(row))

  const filter = (row: Item) => !comparator(row)(item)

  const bulkCheck = (state: Array<Item>, item: Item): Array<Item> => {
    return [...state, ...getFlat(item, [], nodesKey)].reduce(
      (acc: Array<Item>, item: Item) =>
        acc.some(comparator(item)) ? acc : [...acc, item],
      []
    ) as Array<Item>
  }

  if (stateIncludesItem) {
    return item[nodesKey] ? state.filter(bulkFilter) : state.filter(filter)
  }
  return item[nodesKey] ? bulkCheck(state, item) : [...state, item]
}

/**
 * Represents a tree section on a single array.
 */
export function getFlat(
  tree: Item,
  arr: Array<Item> = [],
  nodesKey: string = 'children'
) {
  arr.push(tree)
  if (tree[nodesKey])
    (tree[nodesKey] as Array<Item>).forEach(child =>
      getFlat(child, arr, nodesKey)
    )
  return arr
}