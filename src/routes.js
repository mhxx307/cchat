import { useRoutes } from "react-router-dom";
import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";

const routes = [
    {
        path: "/",
        index: true,
        element: <HomePage />,
    },
    {
        path: "/login",
        index: true,
        element: <LoginPage />,
    },
    {
        path: "/register",
        index: true,
        element: <RegisterPage />,
    },
];

export function useRouteElements() {
    const routesElements = useRoutes(routes);

    return routesElements;
}
