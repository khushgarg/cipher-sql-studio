import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './_auth.scss';

const RegisterPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (form.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        setLoading(true);
        try {
            const { data } = await registerUser(form.username, form.email, form.password);
            login(data.token, data.user);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
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
                    <h1 className="auth-card__title">Create your account</h1>
                    <p className="auth-card__subtitle">Start mastering SQL today — it's free</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-form__field">
                        <label htmlFor="reg-username" className="auth-form__label">Username</label>
                        <input
                            id="reg-username"
                            name="username"
                            type="text"
                            className="auth-form__input"
                            placeholder="sqlmaster"
                            value={form.username}
                            onChange={handleChange}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="auth-form__field">
                        <label htmlFor="reg-email" className="auth-form__label">Email</label>
                        <input
                            id="reg-email"
                            name="email"
                            type="email"
                            className="auth-form__input"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="auth-form__field">
                        <label htmlFor="reg-password" className="auth-form__label">Password</label>
                        <input
                            id="reg-password"
                            name="password"
                            type="password"
                            className="auth-form__input"
                            placeholder="At least 6 characters"
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
                        id="register-submit"
                        type="submit"
                        className="auth-form__submit"
                        disabled={loading}
                    >
                        {loading ? <span className="auth-form__spinner" /> : 'Create Account'}
                    </button>
                </form>

                <p className="auth-card__footer">
                    Already have an account?{' '}
                    <Link to="/login" className="auth-card__link">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
