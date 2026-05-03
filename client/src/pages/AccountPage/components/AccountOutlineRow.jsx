import React from 'react';

import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import styles from './Account.module.css';

const AccountOutlineRow = ({ styling, clickCommand, text, linkTo }) => {

   const user = useSelector(state => state.user);

   return (
      <div className={styles.accountOutlineRow} style={styling}>
         <Link
            className={styles.accountOutlineRowSpan}
            to={linkTo}
            onClick={clickCommand}
         >
            {text}
         </Link>
      </div>
   );
};

export default AccountOutlineRow;