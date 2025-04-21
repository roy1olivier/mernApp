import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Welcome from './welcome';
import reportWebVitals from './reportWebVitals';
import Root from "./routes/root";
import Expenses from './routes/expenses'
import Test from './routes/test'
import ConsultData from './routes/ConsultData';
import Login from './routes/Login';

import PrivateRoute from './components/PrivateRoutes';
import { AuthProvider } from './context/AuthContext';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  {
    path: "/expenses",
    element: <PrivateRoute><Expenses /></PrivateRoute>,
  },
  {
    path: "/test",
    element: <Test />,
  },
  {
    path: "/consultData",
    element: <PrivateRoute><ConsultData /></PrivateRoute>,
  },
  {
    path: "/Login",
    element: <Login />,
  },
]);
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <AuthProvider>
    <RouterProvider router={router} />
    </AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
