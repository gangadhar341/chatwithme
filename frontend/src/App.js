import React, { Suspense } from "react";
import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/login/login.js";
import PageNotFound from "./pagenotfound.js";
import ErrorBoundary from "./components/Error/errorBoundary.js";

const Register = React.lazy(() => import("./components/login/register.js"));
const Home = React.lazy(() => import("./components/Home/home.js"));

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<Login />} />
          <Route
            path='/register'
            element={
              <Suspense fallback={<div>loading...</div>}>
                <Register />
              </Suspense>
            }
          />
          <Route
            path='/home'
            element={
              <ErrorBoundary
                fallback={
                  <p style={{ textAlign: "center" }}>
                    Something went wrong.please refresh once.
                  </p>
                }
              >
                <Suspense fallback={<div>loading...</div>}>
                  <Home />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route path='/*' element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
