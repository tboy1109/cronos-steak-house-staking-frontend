import * as React from  'react';
import { ToastContainer } from 'react-toastify';
import RouterControl from  './Router/RouterControl';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
export default function App(){
  return(
    <>
      <RouterControl/>
      <ToastContainer />
    </>
  );
}
