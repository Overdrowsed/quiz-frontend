import { configureStore } from "@reduxjs/toolkit";
import scoreSlice from "./scoreSlice";

export const store = configureStore({
    reducer: {
        score: scoreSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
