import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app';
import './index.css';
import { ApiProvider } from 'library/api';
import { AlertProvider } from 'ui/alertContext';

const root = createRoot(document.getElementById('root')!);

root.render(
  <ApiProvider config={{ baseURL: 'http://localhost:3000/ms-proxy-inspection/' }}>
    <BrowserRouter>
      <AlertProvider>
        <App />
      </AlertProvider>
    </BrowserRouter>
  </ApiProvider>
);
