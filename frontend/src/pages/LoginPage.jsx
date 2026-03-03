import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './_auth.scss';

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { data } = await loginUser(form.email, form.password);
            login(data.token, data.user);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-card__header">
                    <div className="auth-card__logo">
                        <span className="auth-card__logo-cipher">Cipher</span>
                        <span className="auth-card__logo-sql">SQL</span>
                        <span className="auth-card__logo-studio"> Studio</span>
                    </div>
                    <h1 className="auth-card__title">Welcome back</h1>
                    <p className="auth-card__subtitle">Sign in to continue learning SQL</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-form__field">
                        <label htmlFor="login-email" className="auth-form__label">Email</label>
                        <input
                            id="login-email"
                            name="email"
                            type="email"
                            className="auth-form__input"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="auth-form__field">
                        <label htmlFor="login-password" className="auth-form__label">Password</label>
                        <input
                            id="login-password"
                            name="password"
                            type="password"
                            className="auth-form__input"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {error && (
                        <div className="auth-form__error" role="alert">
                            <span>⚠</span> {error}
                        </div>
                    )}

                    <button
                        id="login-submit"
                        type="submit"
                        className="auth-form__submit"
                        disabled={loading}
                    >
                        {loading ? <span className="auth-form__spinner" /> : 'Sign In'}
                    </button>
                </form>

                <p className="auth-card__footer">
                    Don't have an account?{' '}
                    <Link to="/register" className="auth-card__link">Create one</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
