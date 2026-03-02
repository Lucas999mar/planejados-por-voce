'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Erro ao fazer login');
                return;
            }

            // Store token
            localStorage.setItem('admin_token', data.token);
            router.push('/admin');
        } catch {
            setError('Erro de conexão. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-wood-500 to-wood-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-heading font-bold text-2xl">P</span>
                    </div>
                    <h1 className="font-heading text-2xl font-bold text-white">Painel Administrativo</h1>
                    <p className="text-dark-300 text-sm mt-2">Planejados Por Você</p>
                </div>

                <form onSubmit={handleLogin} className="bg-dark-800 rounded-2xl p-8 border border-dark-600 shadow-2xl">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm mb-6">
                            {error}
                        </div>
                    )}

                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-dark-200 mb-2">E-mail</label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@email.com"
                                    required
                                    className="w-full bg-dark-700 border border-dark-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-dark-400 focus:outline-none focus:ring-2 focus:ring-wood-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark-200 mb-2">Senha</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full bg-dark-700 border border-dark-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-dark-400 focus:outline-none focus:ring-2 focus:ring-wood-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-wood-600 to-wood-700 text-white py-3 rounded-xl font-semibold hover:from-wood-700 hover:to-wood-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Entrando...
                                </>
                            ) : (
                                'Entrar'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
