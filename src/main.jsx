import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import Usser from './usser';
import AboutUs from './aboutUs';
import Catalog from './catalog';
import { AppStateProvider } from './context/AppStateContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AppStateProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/login" element={<Usser />} />
        <Route path="/aboutUs" element={<AboutUs />} />
      </Routes>
    </BrowserRouter>
  </AppStateProvider>
);
