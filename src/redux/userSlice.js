import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: { user: null },
  reducers: {
    login: (state, action) => {
      state.user = { name: action.payload };
    },
    logout: (state) => {
      state.user = null;
    },
    updateName: (state, action) => {
      if (state.user) state.user.name = action.payload;
    },
  },
});

export const { login, logout, updateName } = userSlice.actions;
export default userSlice.reducer;
