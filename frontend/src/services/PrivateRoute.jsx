import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {

  const token = localStorage.getItem("auth_token");

  if (!token) {
    return <Navigate to="/connexion" replace />;
  }

  return children;
};

export default PrivateRoute;