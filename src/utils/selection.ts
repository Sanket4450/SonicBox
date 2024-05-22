import { FieldNode, InlineFragmentNode } from 'graphql'

export const extractFields = (selectionSet: any, fields: string[] = []) => {
  selectionSet.selections.forEach((selection: any) => {
    if (selection.kind === 'Field') {
      const fieldNode = selection as FieldNode
      // Extract field name
      fields.push(fieldNode.name.value)

      // Recursively extract nested fields
      if (fieldNode.selectionSet) {
        extractFields(fieldNode.selectionSet, fields)
      }
    } else if (selection.kind === 'InlineFragment') {
      const inlineFragmentNode = selection as InlineFragmentNode
      // Recursive call for inline fragments
      extractFields(inlineFragmentNode.selectionSet, fields)
    } else if (selection.kind === 'FragmentSpread') {
      // Handle fragment spreads if needed
    }
  })
  return fields
}
