// // Find nearest ancestor <span> with a font-size style
// export function findAncestorSpanWithFontSize(node) {
//   while (node && node !== document.body) {
//     if (
//       node.nodeType === Node.ELEMENT_NODE &&
//       node.tagName === "SPAN" &&
//       node.style.fontSize
//     ) {
//       return node;
//     }
//     node = node.parentNode;
//   }
//   return null;
// }

// // Split a text node at a given offset
// export function splitTextNode(node, offset) {
//   if (node.nodeType !== Node.TEXT_NODE) return null;
//   return node.splitText(offset);
// }

// // Ensure range boundaries align with node boundaries
// export function splitRangeBoundaries(range) {
//   const { startContainer, startOffset, endContainer, endOffset } = range;

//   if (startContainer.nodeType === Node.TEXT_NODE) {
//     splitTextNode(startContainer, startOffset);
//   }

//   if (endContainer.nodeType === Node.TEXT_NODE) {
//     splitTextNode(endContainer, endOffset);
//   }
// }

// // Normalize a span: flatten nested spans with same font-size, merge siblings
// export function normalizeSpan(span) {
//   if (!span || span.tagName !== "SPAN") return;

//   // Flatten nested spans with same font-size
//   const children = Array.from(span.childNodes);
//   for (const child of children) {
//     if (
//       child.nodeType === Node.ELEMENT_NODE &&
//       child.tagName === "SPAN" &&
//       child.style.fontSize === span.style.fontSize
//     ) {
//       child.replaceWith(...Array.from(child.childNodes));
//     }
//   }

//   // Merge with previous sibling
//   let prev = span.previousSibling;
//   if (
//     prev &&
//     prev.nodeType === Node.ELEMENT_NODE &&
//     prev.tagName === "SPAN" &&
//     prev.style.fontSize === span.style.fontSize
//   ) {
//     prev.append(...Array.from(span.childNodes));
//     span.remove();
//     span = prev;
//   }

//   // Merge with next sibling
//   let next = span.nextSibling;
//   if (
//     next &&
//     next.nodeType === Node.ELEMENT_NODE &&
//     next.tagName === "SPAN" &&
//     next.style.fontSize === span.style.fontSize
//   ) {
//     span.append(...Array.from(next.childNodes));
//     next.remove();
//   }
// }