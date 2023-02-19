import { Suspense } from 'react'
import Quiz from './components/Quiz'
import Loading from './components/Loading'

const useFetch = (url) => {
    let status = 'pending'
    let result = {
        quiz: null,
        correctAnswers: 0,
        totalAnswers: 0
    }

    let promise = fetch(url)
        .then(result => result.json())
        .then(data => {
            status = 'success'
            result.quiz = data
            result.correctAnswers = 0
            result.totalAnswers = 0
        })
    .catch(error => {
        status = 'error'
        result = error
    })
    
    return {
        read(){
            switch(status){
                case 'pending':
                    throw promise

                case 'error':
                    throw result
                
                default:
                    return result
            }
        }
    }
}

const useLocalStorage = (key) => {
    let status = 'pending'
    let result = {
        quiz: null,
        correctAnswers: 0,
        totalAnswers: 0
    }

    let promise = new Promise((resolve, reject) => {
        result = JSON.parse(localStorage.getItem(key))
        status = 'success'
        resolve()
    })
    .catch(error => {
        status = 'error'
        result = error
    })
    
    return {
        read(){
            switch(status){
                case 'pending':
                    throw promise

                case 'error':
                    throw result
                
                default:
                    return result
            }
        }
    }
}

function App() {
    const quiz = localStorage.hasOwnProperty('quiz') ? useLocalStorage('quiz') : useFetch('http://192.168.0.103:8080/get-quiz');

    return(
        <Suspense fallback={<Loading/>}>
            <Quiz data={quiz}/>
        </Suspense>
    )
}

export default App
