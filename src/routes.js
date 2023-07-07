import React from 'react';
import {  Navigate } from 'react-router-dom';

const PrivateRoute = ({ path, isAuthenticated, ...props }) => {
//   const navigate = useNavigate();
console.log(isAuthenticated);
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" />;
  }

  // Render the protected route if authenticated
  return props.element ;
};

export default PrivateRoute;
