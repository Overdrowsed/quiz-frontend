import { useEffect, useRef, useState } from 'react'
import './Quiz.css'

const fetchCorrectAnswer = async (id) => {
    const result = await fetch(`http://192.168.0.103:8080/get-correct-answer/${id}`)
    
    return await result.json()
}

export default function Quiz(props){
    let { quiz, correctAnswers, totalAnswers} = props.data.read()

    const answerId = useRef()
    const hasAnswered = useRef(false)
    correctAnswers = useRef(correctAnswers)
    totalAnswers = useRef(totalAnswers)
    const [correctAnswerId, setCorrectAnswerId] = useState()
    const [questionIndex, setQuestionIndex] = useState(0)

    useEffect(() => {
        const cleanup = () => {
            localStorage.setItem('quiz', JSON.stringify({
                quiz: quiz,
                correctAnswers: correctAnswers.current,
                totalAnswers: totalAnswers.current
            }))
        }

        window.addEventListener('beforeunload', cleanup)
        
        return () => {
            window.removeEventListener('beforeunload', cleanup)
        }
    }, [])
    
    if(totalAnswers.current === quiz.length){
        return (
            <>
                <div className='score'>{`${correctAnswers.current}/${totalAnswers.current}`}</div>
                <div className='score'>{`${Math.round(correctAnswers.current / totalAnswers.current * 100)}%`}</div>
            </>
        )    
    }

    const question = quiz[questionIndex]
    
    const onAnswer = (id) => {
        return () => {
            hasAnswered.current = true
            answerId.current = id
            fetchCorrectAnswer(question.id).then(id => {setCorrectAnswerId(id)})
        }
    }

    if(hasAnswered.current){
        setTimeout(() => {
            totalAnswers.current++

            if(answerId.current === correctAnswerId){
                correctAnswers.current++
            }

            hasAnswered.current = false

            setQuestionIndex(questionIndex + 1)
        }, 3000);
        
        return (
            <>
                <div className='score'>{`${correctAnswers.current}/${totalAnswers.current}`}</div>
                <div className='quiz'>
                    <div className='question'>{question.prompt}</div>
                    <div className='answers'>
                        {
                            question.answers.map(
                                ({id, answer}) => {
                                    const className = id === correctAnswerId
                                        ? 'correct answer'
                                    : answerId.current === id
                                        ? 'wrong answer'
                                    :'answer'
                                    
                                    return <button className={className} key={id}>{answer}</button>
                                }
                            )
                        }
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <div className='score'>{`${correctAnswers.current}/${totalAnswers.current}`}</div>
            <div className='quiz'>
                <div className='question'>{question.prompt}</div>
                <div className='answers'>
                    {
                        question.answers.map(
                            ({id, answer}) => <button className='answer' key={id} onClick={onAnswer(id)}>{answer}</button>
                        )
                    }
                </div>
            </div>
        </>
    )
}