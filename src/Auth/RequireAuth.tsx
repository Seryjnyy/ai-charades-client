import { ReactNode } from "react";
import { useAuth } from "./UserAuthContext";
import { Navigate, useLocation } from "react-router-dom";

function RequireAuth({
  children,
  redirectTo,
}: {
  children: ReactNode;
  redirectTo: string;
}) {
  const { user } = useAuth();
  const location = useLocation();

  // HACK because of the strange behavior, where on refresh it thinks user is not authenticated
  // and sends them back to landing page and we send the user back to where they were/
  // we don't want the user to be sent back to the gameroom since the socket disconnects on refresh, so no point going back to that room

  let path =
    location.pathname == "/gameroom" ? "/dashboard" : location.pathname;

  return user ? (
    children
  ) : (
    <Navigate
      to={redirectTo}
      state={{ path: path }}
      // replace={true}
    />
  );
}

export default RequireAuth;
