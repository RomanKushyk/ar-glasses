import React from "react";

import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NotFound } from "./components/NotFound/NotFound";
import { AdminPage } from "./components/AdminPage/AdminPage";
import store, { StoreContext } from "./store/Store.ts";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <StoreContext.Provider value={store}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<App/>} />
          <Route path='admin' element={<AdminPage/>} />
          <Route path='*' element={<NotFound/>} />
        </Routes>
      </BrowserRouter>
    </StoreContext.Provider>
  </React.StrictMode>
);

reportWebVitals();
