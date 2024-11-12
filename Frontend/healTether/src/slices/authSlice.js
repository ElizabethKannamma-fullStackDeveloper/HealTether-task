import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Initial state
const initialState = {
  token: localStorage.getItem('token') || null,  // Persist token in localStorage
  user: null,
  loading: false,
  error: null,
};

// Async Thunks for interacting with the backend (login, register, and fetch user data)
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      // Save token to localStorage on successful login
      localStorage.setItem('token', response.data.token);
      return response.data;  // Return the response, which contains the token and user data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data); // Handle error if login fails
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ username, email, password }, thunkAPI) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', { username, email, password });
      // Return response, which contains the token
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data); // Handle error if registration fails
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('token');
  return null;  // Simply return null to reset the state
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.loading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload.msg;
        state.loading = false;
      })
      // Handle registration
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload.msg;
        state.loading = false;
      })
      // Handle logout
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.user = null;
      });
  },
});

export const { setUser, clearError } = authSlice.actions;

export default authSlice.reducer;
