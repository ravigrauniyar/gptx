import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export const PrivateRoute = () => {
  const accessSlice = useSelector(
    (state: RootState) => state.persistedReducer.auth
  );

  return (
    <>{accessSlice.accessToken ? <Outlet /> : <Navigate to="/" replace />}</>
  );
};
