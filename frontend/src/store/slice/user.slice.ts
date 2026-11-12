import api from "@/api/axiosInstance";
import type { CreateUserInput, User,EditUserInput } from "@/types/userTypes";
import { createAsyncThunk, createSlice, type PayloadAction} from "@reduxjs/toolkit";


interface UserState {
    users: User[];
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    users: [],
    loading: false,
    error: null,
};

export const fetchUsers = createAsyncThunk(
    "users/fetchUsers",

    async(__, {rejectWithValue}) => {
        try{
            const res = await api.get("/users");
            return res.data.users ?? res.data;
        }catch (error: any){
            return rejectWithValue(error.response?.data?.message || "Failed to fecth");
        } 
    }
);

export const addUser = createAsyncThunk(
    "users/createUser",
    async(data: CreateUserInput, { rejectWithValue}) => {
        try {
            const res = await api.post("/users", data);
            return res.data.users ?? res.data; 
        } catch (error: any){
            return rejectWithValue(error.response?.data?.message || "Failed to signup");

        }
    }
);

export const updateUser = createAsyncThunk(
    "users/updateUser",
    async({id, data} : {id: number, data: EditUserInput}, {rejectWithValue}) => {
        try {
            const res = await api.put(`/users/${id}`, data);
            return res.data.users ?? res.data;
        } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to update");
    }
    }
);

export const deleteUser = createAsyncThunk(
    "users/deleteUser",
    async(id: number, {rejectWithValue}) => {
        try {
            await api.delete(`/users/${id}`);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "failed to delete");
        }
    }
);

export const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        clearUserError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchUsers.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
            state.loading = false;
            state.users = action.payload;
            state.error = null;
        }).addCase(fetchUsers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })
        .addCase(addUser.fulfilled, (state, action: PayloadAction<User>) => {
            state.users.unshift(action.payload);
        })
        .addCase(updateUser.fulfilled, (state, action : PayloadAction<User>) => {
            const index = state.users.findIndex((p) => p.id === action.payload.id);
            if(index !== -1) {
                state.users[index] = action.payload;
            }
        })
        .addCase(deleteUser.fulfilled, (state, action: PayloadAction<number>) => {
            state.users = state.users.filter((p) => p.id !== action.payload);
        });

    }
});

export const { clearUserError} = userSlice.actions;
export default userSlice.reducer;

