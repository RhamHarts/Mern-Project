// src/components/PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/authcontext";

const PrivateRoute = ({ element: Element, ...rest }) => {
  const { token } = useContext(AuthContext);

  return token ? <Element {...rest} /> : <Navigate to="/LoginPage" />;
};

export default PrivateRoute;
