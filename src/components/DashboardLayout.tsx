import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile menu button */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center px-4 z-30">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 rounded-md hover:bg-gray-100"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <span className="ml-4 text-xl font-semibold">MediDash</span>
            </div>

            {/* Mobile sidebar */}
            <div className={`lg:hidden fixed inset-0 z-40 transition-transform duration-300 ease-in-out ${
                isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <div
                    className="fixed inset-0 bg-black bg-opacity-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
                <div className="fixed inset-y-0 left-0 w-64 bg-white">
                    <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
                </div>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                <div className="flex-1 bg-white border-r border-gray-200">
                    <Sidebar />
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-64">
                <main className="min-h-screen py-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}