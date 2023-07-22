import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Login from "./pages/client/login";
import Home from "./pages/client/home";
import QuestionScreen from "./pages/client/questions";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/client/:id/",
    element: <QuestionScreen />,
  },
]);

function App() {
  return (
    <>
      <div className="background"></div>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
