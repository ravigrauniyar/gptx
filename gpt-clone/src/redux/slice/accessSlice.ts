import { createSlice } from "@reduxjs/toolkit";
import { AccessStates } from "../../types/data";

const initialState: AccessStates = {
  accessToken: "",
  userProfile: null,
};

export const accessSlice = createSlice({
  name: "accessSlices",
  initialState,
  reducers: {
    setAuthToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
  },
});
export const { setAuthToken, setUserProfile } = accessSlice.actions;
export default accessSlice.reducer;
