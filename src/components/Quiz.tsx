import { useRef, useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';

import './Quiz.css';

const fetchCorrectAnswer = async (id: number) => {
    const result = await fetch(`http://localhost:8080/get-correct-answer/${id}`);
    
    return await result.json();
}

export default function Quiz() {
    // const {
    //     data: {
    //         quiz,
    //         correctAnswers: initialCorrectAnswers,
    //         totalAnswers: initialTotalAnswers
    //     } 
    // } = useSuspenseQuery({
    //     queryKey: ['quiz'],
    //     queryFn: () =>
    //         fetch('http://localhost:8080/get-quiz')
    //         .then(res => res.json()),
    //     staleTime: Infinity,
    // });
    const {
        data: quiz
    } = useSuspenseQuery({
        queryKey: ['quiz'],
        queryFn: () =>
            fetch('http://localhost:8080/get-quiz')
            .then(res => res.json()),
        staleTime: Infinity,
    });

    const answerId = useRef<number>();
    const hasAnswered = useRef(false);
    // const correctAnswers = useRef(initialCorrectAnswers);
    // const totalAnswers = useRef(initialTotalAnswers);
    const correctAnswers = useRef(0);
    const totalAnswers = useRef(0);
    const [correctAnswerId, setCorrectAnswerId] = useState();
    const [questionIndex, setQuestionIndex] = useState(Math.floor(Math.random() * quiz.length));

    if (totalAnswers.current === quiz.length) {
        return (
            <>
                <div className='score'>
                    { `${correctAnswers.current}/${totalAnswers.current}` }
                </div>
                <div className='score'>
                    { `${Math.round(correctAnswers.current / totalAnswers.current * 100)}%` }
                </div>
            </>
        );
    }

    if (hasAnswered.current) {
        setTimeout(() => {
            totalAnswers.current++;

            if (answerId.current === correctAnswerId) {
                correctAnswers.current++;
            }

            hasAnswered.current = false;

            setQuestionIndex(Math.floor(Math.random() * quiz.length));
        }, 3000);
    }

    const question = quiz[questionIndex];

    const onAnswer = (id: number) => {
        return () => {
            if (hasAnswered.current) {
                return;
            }

            hasAnswered.current = true;
            answerId.current = id;
            fetchCorrectAnswer(question.id).then(id => { setCorrectAnswerId(id) });
        }
    }

    return (
        <>
            <div className='score'>
                { `${correctAnswers.current}/${totalAnswers.current}` }
            </div>
            <div className='quiz'>
                <div className='question'> { question.prompt } </div>
                <div className='answers'>
                    {
                        question.answers.map(
                            ({ id, answer }: { id: any, answer: any }) => {
                                const className = id === correctAnswerId
                                    ? 'correct'
                                : answerId.current === id
                                    ? 'wrong'
                                :'';
                                
                                return (
                                    <button
                                      className={ `answer ${className}` }
                                      key={ id }
                                      onClick={ onAnswer(id) }
                                    >
                                        { answer }
                                    </button>
                                );
                            }
                        )
                    }
                </div>
            </div>
        </>
    );
}
