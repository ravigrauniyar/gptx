import { useContext, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Repository } from "../repositories/Repository";
import { RepositoryContext } from "../shared/contexts";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { setAuthToken } from "../redux/slice/accessSlice";

export const PrivateRoute = () => {
  const repository = useContext<Repository>(RepositoryContext);
  const accessSlice = useSelector(
    (state: RootState) => state.persistedReducer.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const getToken = async () => {
      const localStorage = await repository.getStorage();
      const accessToken = await localStorage.getAccessToken();
      dispatch(setAuthToken(accessToken));
    };
    getToken();
  }, [dispatch, repository]);

  return (
    <>{accessSlice.accessToken ? <Outlet /> : <Navigate to="/" replace />}</>
  );
};
