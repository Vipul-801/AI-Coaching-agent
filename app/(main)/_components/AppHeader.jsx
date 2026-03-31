"use client";

import React from "react";
import { UserButton } from "@stackframe/stack";
import Image from "next/image";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        
        console.error("AppHeader caught an error:", error, info);
    }

    render() {
        if (this.state.hasError) {
            
            return (
                <div className="w-32 text-right">
                    <button className="px-3 py-1 rounded bg-slate-200 text-sm">Sign in</button>
                </div>
            );
        }
        return this.props.children;
    }
}

function AppHeader() {
    return (
        <div className="p-3 shadow-sm flex justify-between items-center">
            <Image src={'/logo.svg'} alt="logo" width={70} height={100} />
            <ErrorBoundary>
                <UserButton />
            </ErrorBoundary>
        </div>
    );
}

export default AppHeader;