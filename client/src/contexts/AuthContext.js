import React, { createContext, useReducer, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import axiosInstance from '../config/axiosConfig';
import API_URL from '../config/api';

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('token')
};

// Create context
const AuthContext = createContext(initialState);

// Reducer
const authReducer = (state, action) => {  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
    case 'AUTH_LOADING':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null,
        isAuthenticated: true
      };
    case 'LOGIN_ERROR':
    case 'REGISTER_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        error: null,
        isAuthenticated: false
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
        loading: false
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  // Create a flag in a ref to prevent multiple calls
  const isMounted = React.useRef(true);

  // Set up axios defaults
  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }

    return () => {}; // Empty cleanup function
  }, [state.token]);
  // Load user data if token exists - separate effect to avoid circular dependencies
  useEffect(() => {
    // Function to fetch user data
    const loadUser = async () => {
      const token = localStorage.getItem('token');

      // Only proceed if we have a token but no user data yet      if (token && !state.user && isMounted.current) {
        try {
          // Set loading to true before the request
          dispatch({ type: 'AUTH_LOADING' });          const res = await axiosInstance.get(`/auth/user`);

          // Check if component is still mounted before updating state
          if (isMounted.current) {
            dispatch({
              type: 'UPDATE_USER',
              payload: res.data
            });
          }
        } catch (err) {
          // Only dispatch if still mounted
          if (isMounted.current) {
            console.error('Error loading user:', err);
            dispatch({ type: 'LOGOUT' });
          }
        }
      }
    };

    // Call loadUser once when the effect runs
    loadUser();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted.current = false;
    };  // We intentionally don't include state.user as a dependency to avoid causing
  // infinite re-renders, as this effect is only supposed to run on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);  // Register user
  const register = async (userData) => {
    dispatch({ type: 'REGISTER_START' });
    try {
      console.log('Registering user:', {
        username: userData.username,
        email: userData.email,
        passwordLength: userData.password ? userData.password.length : 0
      });      const res = await axiosInstance.post(`/auth/register`, userData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Registration successful:', res.data);
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: res.data
      });
      return res.data;
    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.message ||
                          (err.message === 'Network Error' ?
                            'Unable to connect to server. Please check your connection.' :
                            'Registration failed');

      dispatch({
        type: 'REGISTER_ERROR',
        payload: errorMessage
      });
      throw err;
    }
  };
  // Login user
  const login = async (userData) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const res = await axiosInstance.post(`/auth/login`, userData);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data
      });
      return res.data;
    } catch (err) {
      dispatch({
        type: 'LOGIN_ERROR',
        payload: err.response?.data?.message || 'Login failed'
      });
      throw err;
    }
  };

  // Logout user
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  // Update user stats
  const updateStats = async (stats) => {
    try {
      const res = await axiosInstance.put(`/auth/update-stats`, stats);
      dispatch({
        type: 'UPDATE_USER',
        payload: res.data
      });
      return res.data;
    } catch (err) {
      console.error('Error updating stats:', err);
      throw err;
    }
  };
  // Clear errors - wrapped in useCallback to prevent unnecessary re-renders
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, [dispatch]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        token: state.token,
        loading: state.loading,
        error: state.error,
        isAuthenticated: state.isAuthenticated,
        register,
        login,
        logout,
        updateStats,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
