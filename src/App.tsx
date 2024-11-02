import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import Loading from './components/Loading';
import Quiz from './components/Quiz';

export default function App() {
    return (
        <>
            <ErrorBoundary fallback={ <h3>Unable to retrieve quiz</h3> }>
                <Suspense fallback={ <Loading/> } >
                    <Quiz />
                </Suspense>
            </ErrorBoundary>
            <ReactQueryDevtools />
        </>
    );
}
