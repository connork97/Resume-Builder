import React from 'react';

import { useLocation } from 'react-router-dom';

import SignUp from './components/SignUp';
import Login from './components/Login';

const AuthPage = () => {
   const location = useLocation();

   const isSignUp = location.pathname === '/signup';
   const isLogin = location.pathname === '/login';

   if (isSignUp) {
      return <SignUp />
   } else if (isLogin) {
      return <Login />
   }
}

export default AuthPage;