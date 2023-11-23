import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { Conversations } from "../pages/Conversations";
import { PrivateRoute } from "./PrivateRoute";
import { Access } from "../pages/Access";

export const Router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/auth/login" element={<Access />} />
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Conversations />} />
      </Route>
    </Route>
  )
);
