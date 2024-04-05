// MainLayout.js
import React from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";

function MainLayout({ children }) {
    return (
        <main className="min-h-screen flex flex-col">
            <Header />
            <div className="h-full flex-1 bg-[#e0e8ef] flex flex-col justify-center">{children}</div>
            <Footer />
        </main>
    );
}

export default MainLayout;
