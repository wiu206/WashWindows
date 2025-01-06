import { createHashRouter } from "react-router";
import { WashWindowsGame } from "../view/index";
import Login from "../view/Login";
import Register from "../view/Register";
import Manager from "../view/Manager";
import Profile from "../view/Profile";
import { Rank } from "../view/Rank";

export const router = createHashRouter([
    {
        path: "/",
        element: <WashWindowsGame />
    },
    {
        path: "/Login",
        element: <Login />
    },
    {
        path: "/Register",
        element: <Register />
    },
    {
        path: "/Manager",
        element: <Manager />
    },
    {
        path: "/Profile",
        element: <Profile />
    },
    {
        path: "/Rank",
        element: <Rank />
    },
])