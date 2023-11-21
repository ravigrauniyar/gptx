import { createSlice } from "@reduxjs/toolkit";
import { AccessStates } from "../../types/data";

const initialState: AccessStates = {
  accessToken: "",
};

export const accessSlice = createSlice({
  name: "accessSlices",
  initialState,
  reducers: {
    setAuthToken: (state, action) => {
      state.accessToken = action.payload;
    },
  },
});
export const { setAuthToken } = accessSlice.actions;
export default accessSlice.reducer;
