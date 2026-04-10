"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function LoginRedirect() {
    const router = useRouter();

    useEffect(() => {
        // Since this is a monorepo, the admin app usually runs on port 3001 in dev
        // In production, you would use a environment variable for the admin URL
        const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3001";
        window.location.href = adminUrl;
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-primary)]">
            <div className="text-center">
                <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Redirecting to Portal</h1>
                <p className="text-[var(--text-tertiary)]">Please wait while we connect you to the TakeWeb Admin Dashboard...</p>
                <div className="mt-8">
                    <a 
                        href="http://localhost:3001" 
                        className="text-amber-500 hover:text-amber-400 font-medium underline underline-offset-4"
                    >
                        Not redirecting? Click here to access the portal manually.
                    </a>
                </div>
            </div>
        </div>
    );
}
