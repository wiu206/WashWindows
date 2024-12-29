import { createHashRouter } from "react-router";
import  WashWindowsGame from "../view/index";

export const router = createHashRouter([
    {
        path: "/",
        element: <WashWindowsGame />,
    },
])