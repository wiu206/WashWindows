import { createHashRouter } from "react-router";
import  WashWindowsGame from "../view/index";
import Login from "../view/Login";
import Register from "../view/Register";

export const router = createHashRouter([
    {
        path: "/",
        element: <WashWindowsGame />,
    },
    {
        path: "/Login",
        element: <Login />
    },
    {
        path: "/Register",
        element: <Register />
    },
])