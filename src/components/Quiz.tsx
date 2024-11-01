import { useRef, useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';

import Score from './Score';
import FinalScore from './FinalScore';

import './Quiz.css';

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

const backendUrl = process.env.REACT_APP_BACKEND_URL as string;

const fetchCorrectAnswer = async (id: number) => {
    const result = await fetch(`${backendUrl}/get-correct-answer/${id}`);
    
    return await result.json();
}

export default function Quiz() {
    const { data } = useSuspenseQuery<Quiz>({
        queryKey: ['quiz'],
        queryFn: () =>
            fetch(`${backendUrl}/get-quiz`)
            .then(res => res.json()),
        staleTime: Infinity,
    });

    const selectedAnswerId = useRef<number | null>(null);
    const hasAnswered = useRef(false);
    const correctAnswers = useRef(0);
    const totalAnswers = useRef(0);
    const questionIndex = useRef(Math.floor(Math.random() * data.length));

    const [quiz, setQuiz] = useState(data);
    const [correctAnswerId, setCorrectAnswerId] = useState<number | null>(null);

    if (quiz.length === 0) {
        return (
            <FinalScore
              correctAnswers={ correctAnswers.current }
              totalAnswers={ totalAnswers.current }
            />
        );
    }

    if (hasAnswered.current) {
        setTimeout(() => {
            totalAnswers.current++;

            if (selectedAnswerId.current === correctAnswerId) {
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
            selectedAnswerId.current = id;
            fetchCorrectAnswer(question.id).then(id => { setCorrectAnswerId(id) });
        }
    }

    return (
        <>
            <Score
              correctAnswers={ correctAnswers.current }
              totalAnswers={ totalAnswers.current }
            />
            <div className='quiz'>
                <div className='question'> { question.prompt } </div>
                <div className='answers'>
                    {
                        question.answers.map(
                            ({ id, text }) => {
                                const answerClassName = id === correctAnswerId
                                    ? 'correct'
                                : selectedAnswerId.current === id
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
