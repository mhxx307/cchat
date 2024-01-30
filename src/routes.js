import { useRoutes } from "react-router-dom";
import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import MainLayout from "./layouts/MainLayout";

const routes = [
    {
        path: "/",
        index: true,
        element: (
            <MainLayout>
                <HomePage />
            </MainLayout>
        ),
    },
    {
        path: "/login",
        index: true,
        element: (
            <MainLayout>
                <LoginPage />
            </MainLayout>
        ),
    },
    {
        path: "/register",
        index: true,
        element: (
            <MainLayout>
                <RegisterPage />
            </MainLayout>
        ),
    },
];

export function useRouteElements() {
    const routesElements = useRoutes(routes);

    return routesElements;
}
