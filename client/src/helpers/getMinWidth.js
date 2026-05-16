export const getMinWidth = ({
   text,
   fontSize = '16px',
   fontWeight = '400',
   fontFamily = 'Arial',
}) => {
   const canvas = document.createElement('canvas');
   const context = canvas.getContext('2d');

   context.font = `${fontWeight} ${fontSize} ${fontFamily}`;

   return context.measureText(text).width;
}