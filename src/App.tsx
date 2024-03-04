import { Suspense, useEffect } from 'react';
import Quiz from './components/Quiz';
import Loading from './components/Loading';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { persistQueryClientSave } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            gcTime: Infinity,
        }
    }
});

const localStoragePersister = createSyncStoragePersister({
    storage: window.localStorage,
});

export default function App() {
    useEffect(() => {
        const persist = () => persistQueryClientSave({
            queryClient,
            persister: localStoragePersister,
        });

        window.addEventListener('beforeunload', persist);

        return () => {
            window.removeEventListener('beforeunload', persist);
        }
    }, []);

    return (
        <QueryClientProvider client={ queryClient } >
            <Suspense fallback={ <Loading/> } >
                <Quiz />
            </Suspense>
            <ReactQueryDevtools />
        </QueryClientProvider>
    );
}
