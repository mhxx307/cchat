import { useRoutes } from "react-router-dom";
import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import MainLayout from "./layouts/MainLayout";
import ChatPage from "./pages/chat";
import ChatLayout from "./layouts/ChatLayout";
import ForgotPasswordPage from "./pages/forgotPassword";
import VerifyPasswordPage from "./pages/verify-password";
import VerifyOtp from "./pages/verify-otp";
import PhoneLogin from "./pages/phone-login";

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
        path: "/verify-password",
        index: true,
        element: (
            <MainLayout>
                <VerifyPasswordPage />
            </MainLayout>
        ),
    },
    {
        path: "/verify-otp",
        index: true,
        element: (
            <MainLayout>
                <VerifyOtp />
            </MainLayout>
        ),
    },
    {
        path: "/phone-login",
        index: true,
        element: (
            <MainLayout>
                <PhoneLogin />
            </MainLayout>
        ),
    },
];

export function useRouteElements() {
    const routesElements = useRoutes(routes);

    return routesElements;
}
