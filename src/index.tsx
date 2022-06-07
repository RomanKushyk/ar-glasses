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
import { AdminPage } from './pages/AdminPage';
import { NotFound } from './components/NotFound';
import {EditGlasses} from './components/EditGlasses/EditGlasses';
import {Protected} from './routes/Protected';
import {AddNewGlasses} from './components/AddNewGlasses/AddNewGlasses';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App/>} />

        <Route element={<Protected/>}>
          <Route path="admin" element={<AdminPage/>}>
            <Route path="new" element={<AddNewGlasses/>}/>

            <Route path="edit" element={<EditGlasses/>}>
              <Route path=":glassesId" element={<EditGlasses/>}/>

              <Route path="new" element={<EditGlasses/>}/>
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFound/>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
