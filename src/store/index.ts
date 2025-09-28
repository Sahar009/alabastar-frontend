import { configureStore } from '@reduxjs/toolkit';
import { providersApi } from './api/providersApi';
import providersReducer from './slices/providersSlice';

export const store = configureStore({
  reducer: {
    providers: providersReducer,
    [providersApi.reducerPath]: providersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(providersApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;





