import type { ReactElement } from "react";
import React from "react";
import "./MainLayout.scss";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";

interface LayoutProps {
    children: ReactElement;
}

export default function MainLayout(props: LayoutProps) {
    return (
        <div className="main-layout">
            <Sidebar />
            <div className="main-layout__content">
                <Header />
                {props.children}
            </div>
        </div>
    );
}
