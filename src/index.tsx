import React from 'react';

import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import { AdminPage } from './components/AdminPage';
import { NotFound } from './components/NotFound';
import {SignIn} from './components/SignIn';
import {EditGlasses} from './components/EditGlasses/EditGlasses';
import {Protected} from './routes/Protected';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App/>} />

        <Route path="sign-in" element={<SignIn/>}/>

        <Route path="admin" element={
          <Protected>
            <AdminPage />
          </Protected>
        }>
        </Route>

        <Route path="new" element={<EditGlasses/>} />
        <Route path=":glassesId" element={<EditGlasses/>} />

        <Route path="*" element={<NotFound/>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
