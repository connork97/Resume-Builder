const DefaultElement = ({ attributes, children }) => {
   console.log(attributes, children)
   return (
      <p {...attributes}>
         {children}
      </p>
   );
}

export default DefaultElement;