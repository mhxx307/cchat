import { useRoutes } from "react-router-dom";
import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import MainLayout from "./layouts/MainLayout";
import ChatPage from "./pages/chat";
import ChatLayout from "./layouts/ChatLayout";
import ForgotPasswordPage from "./pages/forgotPassword";
import Commit from "./pages/commit";

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
    {
        path: "/chat",
        index: true,
        element: (
            <ChatLayout>
                <ChatPage />
            </ChatLayout>
        ),
    },
    {
        path: "/forgot-password",
        index: true,
        element: (
            <MainLayout>
                <ForgotPasswordPage />
            </MainLayout>
        ),
    },
    {
        path: "/commit",
        index: true,
        element: (
            <MainLayout>
                <Commit />
            </MainLayout>
        ),
    },
];

export function useRouteElements() {
    const routesElements = useRoutes(routes);

    return routesElements;
}
