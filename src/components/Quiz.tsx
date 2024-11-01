import { useRef, useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';

import './Quiz.css';

const fetchCorrectAnswer = async (id: number) => {
    const result = await fetch(`http://localhost:8080/get-correct-answer/${id}`);
    
    return await result.json();
}

type Answer = {
    id:   number;
    text: string;
};

type Question = {
    id:      number;
    prompt:  string;
    answers: Answer[];
};

type Quiz = Question[];

export default function Quiz() {
    const backendUrl = process.env.REACT_APP_BACKEND_URL as string;

    const { data }: { data: Quiz } = useSuspenseQuery<Quiz>({
        queryKey: ['quiz'],
        queryFn: () =>
            fetch(`${backendUrl}/get-quiz`)
            .then(res => res.json()),
        staleTime: Infinity,
    });

    const answerId = useRef<number | null>(null);
    const hasAnswered = useRef(false);
    const correctAnswers = useRef(0);
    const totalAnswers = useRef(0);
    const questionIndex = useRef(Math.floor(Math.random() * data.length));

    const [quiz, setQuiz] = useState(data);
    const [correctAnswerId, setCorrectAnswerId] = useState<number | null>(null);

    if (quiz.length === 0) {
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

            quiz.splice(questionIndex.current, 1);

            questionIndex.current = Math.floor(Math.random() * quiz.length)

            setQuiz([...quiz]);
        }, 3000);
    }

    const question = quiz[questionIndex.current];

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
                            ({ id, text }: { id: number, text: string }) => {
                                const answerClassName = id === correctAnswerId
                                    ? 'correct'
                                : answerId.current === id
                                    ? 'wrong'
                                :'';
                                
                                return (
                                    <button
                                      className={ `answer ${answerClassName}` }
                                      key={ id }
                                      onClick={ onAnswer(id) }
                                    >
                                        { text }
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
