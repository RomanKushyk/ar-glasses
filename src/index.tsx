import React from "react";

import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminPage } from "./pages/AdminPage";
import { NotFound } from "./components/NotFound";
import { EditGlasses } from "./components/EditGlasses/EditGlasses";
import { AddNewGlasses } from "./components/AddNewGlasses/AddNewGlasses";
import { SignIn } from "./components/SignIn";
import { UserAuthContextProvider } from "./services/context/UserAuthContext";
import { ProtectedRoute } from "./routes/ProtectedRoute";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <UserAuthContextProvider>
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminPage />}>
              <Route path="new" element={<AddNewGlasses />} />

              <Route path="edit/:glassesId" element={<EditGlasses />} />
            </Route>
          </Route>

          <Route path="/login" element={<SignIn />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  </UserAuthContextProvider>
);

reportWebVitals();
