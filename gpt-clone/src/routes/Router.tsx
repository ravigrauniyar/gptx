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
      <Route path="/" element={<Access />} />
      <Route element={<PrivateRoute />}>
        <Route path="conversations" element={<Conversations />} />
      </Route>
    </Route>
  )
);
