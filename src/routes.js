import { Navigate, Outlet, useRoutes } from "react-router-dom";
// import HomePage from "./pages/home";
// import LoginPage from "./pages/login";
// import RegisterPage from "./pages/register";
// import MainLayout from "./layouts/MainLayout";
// import ChatPage from "./pages/chat";
// import ChatLayout from "./layouts/ChatLayout";
// import ForgotPasswordPage from "./pages/forgotPassword";
// import VerifyPasswordPage from "./pages/verify-password";
// import VerifyOtp from "./pages/verify-otp";
import { Suspense, lazy } from "react";
import { useAuth } from "./hooks/useAuth";

// mport lazy
const HomePage = lazy(() => import("./pages/home"));
const LoginPage = lazy(() => import("./pages/login"));
const RegisterPage = lazy(() => import("./pages/register"));
const MainLayout = lazy(() => import("./layouts/MainLayout"));
const ChatPage = lazy(() => import("./pages/chat"));
const ChatLayout = lazy(() => import("./layouts/ChatLayout"));
const ForgotPasswordPage = lazy(() => import("./pages/forgotPassword"));
const VerifyPasswordPage = lazy(() => import("./pages/verify-password"));
const VerifyOtp = lazy(() => import("./pages/verify-otp"));

function ProtectedRoute() {
    const { userVerified } = useAuth();
    return userVerified ? <Outlet /> : <Navigate to={"/login"} />;
}

function RejectedRoute() {
    const { userVerified } = useAuth();
    return !userVerified ? <Outlet /> : <Navigate to={"/chat"} />;
}

const routes = [
    {
        path: "/",
        index: true,
        element: (
            <MainLayout>
                <Suspense>
                    <HomePage />
                </Suspense>
            </MainLayout>
        ),
    },
    {
        path: "/login",
        index: true,
        element: (
            <RejectedRoute>
                <MainLayout>
                    <Suspense>
                        <LoginPage />
                    </Suspense>
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
                    <Suspense>
                        <RegisterPage />
                    </Suspense>
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
                    <Suspense>
                        <ChatPage />
                    </Suspense>
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
                    <Suspense>
                        <ForgotPasswordPage />
                    </Suspense>
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
                    <Suspense>
                        <VerifyPasswordPage />
                    </Suspense>
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
                    <Suspense>
                        <VerifyOtp />
                    </Suspense>
                </MainLayout>
            </RejectedRoute>
        ),
    },
];

export function useRouteElements() {
    const routesElements = useRoutes(routes);

    return routesElements;
}
