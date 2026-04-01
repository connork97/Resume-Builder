import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   id: null,
   firstName: null,
   lastName: null,
   userName: null,
   email: null,
   createdAt: null,
   updatedAt: null,
   resumes: []
};

const userSlice = createSlice({
   name: "user",
   initialState,
   reducers: {
      setUser: (state, action) => {
         state.id = action.payload.id;
         state.firstName = action.payload.firstName;
         state.lastName = action.payload.lastName;
         // state.userName = action.payload.username;
         state.email = action.payload.email;
         state.createdAt = action.payload.createdAt;
         state.updatedAt = action.payload.updatedAt;
         state.resumes = action.payload.resumes;
      },
   },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;