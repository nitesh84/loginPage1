import React from 'react';
import {  Navigate, useParams } from 'react-router-dom';
import {isEqual,get} from 'lodash'

const PrivateRoute = ({ path, ...props }) => {
//   const navigate = useNavigate();
const userdetails=useParams();
  if (!isEqual(localStorage.getItem("user"),get(userdetails,"username",""))) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" />;
  }

  // Render the protected route if authenticated
  return props.element ;
};

export default PrivateRoute;
