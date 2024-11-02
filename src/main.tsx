import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './store/store';

import App from './App';

import './index.css';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            gcTime: Infinity,
        }
    }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Provider store={ store }>
        <QueryClientProvider client={ queryClient } >
            <App />
        </QueryClientProvider>
    </Provider>
);
