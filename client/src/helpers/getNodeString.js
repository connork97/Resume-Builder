import { Node } from 'slate';

export const getNodeString = (field) => {
   const plainText = Node.string(field.value[0]);
   return plainText;
}