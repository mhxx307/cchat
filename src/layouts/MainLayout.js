// MainLayout.js
import React from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";

function MainLayout({ children }) {
    return (
        <main className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-1">{children}</div>
            <Footer />
        </main>
    );
}

export default MainLayout;
