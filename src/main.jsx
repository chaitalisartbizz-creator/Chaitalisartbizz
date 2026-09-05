import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// Configure NProgress
NProgress.configure({ showSpinner: false, speed: 400, minimum: 0.1 });

// Axios interceptors for global loading bar
let activeRequests = 0;

const startProgress = () => {
  activeRequests++;
  if (activeRequests === 1) NProgress.start();
};

const stopProgress = () => {
  activeRequests = Math.max(0, activeRequests - 1);
  if (activeRequests === 0) NProgress.done();
};

axios.interceptors.request.use((config) => {
  startProgress();
  return config;
}, (error) => {
  stopProgress();
  return Promise.reject(error);
});

axios.interceptors.response.use((response) => {
  stopProgress();
  return response;
}, (error) => {
  stopProgress();
  return Promise.reject(error);
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
console.log('MAIN.JSX LOADED');
