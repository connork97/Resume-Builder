import React from "react";

import styles from "./Page.module.css";

const Page = (props) => {
   // console.log(Object.keys(props.resumeStyling), Object.values(props.resumeStyling))
   return (
      <div className={styles.pageContainerDiv} style={props.resumeStyling}>
         {props.children}
      </div>
   );
}

export default Page;