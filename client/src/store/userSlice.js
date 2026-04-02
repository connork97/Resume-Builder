import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   id: null,
   firstName: null,
   lastName: null,
   // userName: null,
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
         state.email = action.payload.email;
         state.createdAt = action.payload.createdAt;
         state.updatedAt = action.payload.updatedAt;
         state.resumes = action.payload.resumes;
      },
      clearUser: (state) => {
         state.id = null;
         state.firstName = null;
         state.lastName = null;
         state.email = null;
         state.createdAt = null;
         state.updatedAt = null;
         state.resumes = [];
      },
      updateUser: (state, action) => {
         console.log('RUNNING');
         console.log('Updating user with data:', action.payload);
         state.firstName = action.payload.firstName || state.firstName;
         state.lastName = action.payload.lastName || state.lastName;
         state.email = action.payload.email || state.email;
         state.createdAt = action.payload.createdAt || state.createdAt;
         state.updatedAt = action.payload.updatedAt || state.updatedAt;
      }
   },
});

export const { setUser, clearUser, updateUser } = userSlice.actions;

export default userSlice.reducer;