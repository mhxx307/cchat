import { useRoutes } from "react-router-dom";
import HomePage from "./pages/home";
import LoginPage from "./pages/login";

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
];

export function useRouteElements() {
    const routesElements = useRoutes(routes);

    return routesElements;
}
