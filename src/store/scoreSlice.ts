import { createSlice } from "@reduxjs/toolkit";

const scoreSlice = createSlice({
    name: 'score',
    initialState: {
        correctAnswers: 0,
        totalAnswers: 0,
    },
    reducers: {
        correctAnswer: (state) => {
            state.correctAnswers++;
            state.totalAnswers++;
        },
        wrongAnswer: (state) => {
            state.totalAnswers++;
        },
    },
});

export const { correctAnswer, wrongAnswer } = scoreSlice.actions;

export default scoreSlice.reducer;
