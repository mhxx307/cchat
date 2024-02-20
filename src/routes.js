import { Navigate, useRoutes } from "react-router-dom";
import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import MainLayout from "./layouts/MainLayout";
import ChatPage from "./pages/chat";
import ChatLayout from "./layouts/ChatLayout";
import ForgotPasswordPage from "./pages/forgotPassword";
import VerifyPasswordPage from "./pages/verify-password";
import VerifyOtp from "./pages/verify-otp";
// import { Suspense, lazy } from "react";
import { useAuth } from "./hooks/useAuth";

// mport lazy
// const HomePage = lazy(() => import("./pages/home"));
// const LoginPage = lazy(() => import("./pages/login"));
// const RegisterPage = lazy(() => import("./pages/register"));
// const MainLayout = lazy(() => import("./layouts/MainLayout"));
// const ChatPage = lazy(() => import("./pages/chat"));
// const ChatLayout = lazy(() => import("./layouts/ChatLayout"));
// const ForgotPasswordPage = lazy(() => import("./pages/forgotPassword"));
// const VerifyPasswordPage = lazy(() => import("./pages/verify-password"));
// const VerifyOtp = lazy(() => import("./pages/verify-otp"));

function ProtectedRoute({ children }) {
    const { userVerified } = useAuth();
    return userVerified ? children : <Navigate to={"/login"} />;
}

function RejectedRoute({ children }) {
    const { userVerified } = useAuth();
    return !userVerified ? children : <Navigate to={"/chat"} />;
}

const routes = [
    {
        path: "/",
        index: true,
        element: (
            <RejectedRoute>
                <MainLayout>
                    <HomePage />
                </MainLayout>
            </RejectedRoute>
        ),
    },
    {
        path: "/login",
        index: true,
        element: (
            <RejectedRoute>
                <MainLayout>
                    <LoginPage />
                </MainLayout>
            </RejectedRoute>
        ),
    },
    {
        path: "/register",
        index: true,
        element: (
            <RejectedRoute>
                <MainLayout>
                    <RegisterPage />
                </MainLayout>
            </RejectedRoute>
        ),
    },
    {
        path: "/chat",
        index: true,
        element: (
            <ProtectedRoute>
                <ChatLayout>
                    <ChatPage />
                </ChatLayout>
            </ProtectedRoute>
        ),
    },
    {
        path: "/forgot-password",
        index: true,
        element: (
            <RejectedRoute>
                <MainLayout>
                    <ForgotPasswordPage />
                </MainLayout>
            </RejectedRoute>
        ),
    },
    {
        path: "/verify-password",
        index: true,
        element: (
            <RejectedRoute>
                <MainLayout>
                    <VerifyPasswordPage />
                </MainLayout>
            </RejectedRoute>
        ),
    },
    {
        path: "/verify-otp",
        index: true,
        element: (
            <RejectedRoute>
                <MainLayout>
                    <VerifyOtp />
                </MainLayout>
            </RejectedRoute>
        ),
    },
];

export function useRouteElements() {
    const routesElements = useRoutes(routes);

    return routesElements;
}
