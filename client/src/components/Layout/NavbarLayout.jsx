import React from 'react';
import { Outlet } from 'react-router-dom';

import Navbar from '../Navbar/Navbar.jsx';

const NavbarLayout = () => {
   return (
      <>
         <Navbar />
         <Outlet />
      </>
   );
};

export default NavbarLayout;