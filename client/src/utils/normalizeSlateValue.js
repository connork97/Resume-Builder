const isElement = node => node && Array.isArray(node.children);
const isBlock = node => isElement(node) && node.type !== 'icon';
const isList = type => type === 'ordered-list' || type === 'unordered-list';

// Repair only unambiguous legacy shapes at the API boundary.
export const normalizeSlateValue = value => {
  if (!Array.isArray(value)) return value;

  const normalizeNode = (node, parentType) => {
    if (!isElement(node)) return [{ ...node }];

    const untyped = node.type == null || node.type === '';
    const blockOnly = node.children.length > 0 && node.children.every(isBlock);
    const hasMetadata = Object.keys(node).some(key => key !== 'children' && key !== 'type');

    // Only bare wrappers are redundant. Keep metadata-bearing containers intact
    // until their properties have an explicit migration rule.
    if (untyped && blockOnly && !hasMetadata) {
      return node.children.flatMap(child => normalizeNode(child, parentType));
    }

    const type = untyped && !node.children.some(isBlock)
      ? isList(parentType) ? 'list-item' : 'paragraph'
      : node.type;
    const result = {
      ...node,
      children: node.children.flatMap(child => normalizeNode(child, type)),
    };
    if (type !== undefined) result.type = type;
    return [result];
  };

  return value.flatMap(node => normalizeNode(node, undefined));
};
