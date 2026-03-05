'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
    LayoutDashboard, Users, LogOut, Menu, X, Image as ImageIcon, Settings, FileText, BarChart3
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const isLoginPage = pathname === '/admin/login';

    useEffect(() => {
        if (isLoginPage) return;
        const token = localStorage.getItem('admin_token');
        if (!token) {
            router.push('/admin/login');
        } else {
            setAuthenticated(true);
        }
    }, [router, isLoginPage]);

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        router.push('/admin/login');
    };

    if (isLoginPage) {
        return <>{children}</>;
    }

    if (!authenticated) {
        return (
            <div className="min-h-screen bg-dark-900 flex items-center justify-center">
                <div className="text-dark-300">Verificando autenticação...</div>
            </div>
        );
    }

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
        { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
        { icon: Users, label: 'Leads', href: '/admin/leads' },
        { icon: ImageIcon, label: 'Portfólio', href: '/admin/portfolio' },
        { icon: FileText, label: 'Conteúdo', href: '/admin/conteudo' },
        { icon: Settings, label: 'Configurações', href: '/admin/settings' },
    ];

    return (
        <div className="min-h-screen bg-dark-900 flex">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:flex flex-col w-64 bg-dark-800 border-r border-dark-600">
                <div className="p-6 border-b border-dark-600">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-wood-500 to-wood-700 rounded-xl flex items-center justify-center">
                            <span className="text-white font-heading font-bold">P</span>
                        </div>
                        <div>
                            <p className="font-heading font-semibold text-white text-sm">Admin Panel</p>
                            <p className="text-dark-400 text-xs">Planejados Por Você</p>
                        </div>
                    </div>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-dark-200 hover:bg-dark-700 hover:text-white transition-colors text-sm font-medium"
                        >
                            <item.icon size={18} />
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t border-dark-600">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-dark-300 hover:bg-red-500/10 hover:text-red-400 transition-colors text-sm font-medium w-full"
                    >
                        <LogOut size={18} />
                        Sair
                    </button>
                </div>
            </aside>

            {/* Mobile header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-dark-800 border-b border-dark-600 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-wood-500 to-wood-700 rounded-lg flex items-center justify-center">
                        <span className="text-white font-heading font-bold text-sm">P</span>
                    </div>
                    <span className="text-white font-heading font-semibold text-sm">Admin</span>
                </div>
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-dark-300">
                    {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setSidebarOpen(false)}>
                    <div className="w-64 bg-dark-800 h-full pt-16 p-4" onClick={(e) => e.stopPropagation()}>
                        <nav className="space-y-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-dark-200 hover:bg-dark-700 hover:text-white transition-colors text-sm font-medium"
                                >
                                    <item.icon size={18} />
                                    {item.label}
                                </Link>
                            ))}
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-dark-300 hover:bg-red-500/10 hover:text-red-400 transition-colors text-sm font-medium w-full mt-4"
                            >
                                <LogOut size={18} />
                                Sair
                            </button>
                        </nav>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 overflow-auto pt-14 lg:pt-0">
                {children}
            </main>
        </div>
    );
}
