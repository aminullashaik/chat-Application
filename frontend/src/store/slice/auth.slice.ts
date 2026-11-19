import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({

    name : 'auth',

    initialState: {
        user: JSON.parse(sessionStorage.getItem('user') || 'null'),
        token: sessionStorage.getItem('token')
    },

    reducers : {

        login : (state, action) => {

            state.user = action.payload.user,
            state.token = action.payload.token

            sessionStorage.setItem('user', JSON.stringify(action.payload.user)),
            sessionStorage.setItem('token', action.payload.token)
        },

        logout: (state) => {

            state.user = null,
            state.token = null

            sessionStorage.removeItem('user'),
            sessionStorage.removeItem('token')
        }
    }
})

export const {login, logout}  = authSlice.actions
export default authSlice.reducer