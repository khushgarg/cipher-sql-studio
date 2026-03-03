import React, { useState, useEffect, useRef } from 'react';
import { adminGetQuestions, adminDeleteQuestion, adminParseDocument, adminSaveQuestion } from '../services/api';
import './_admin.scss';

const DIFFICULTY_LABELS = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };

const AdminPage = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);
    const [activeTab, setActiveTab] = useState('questions'); // 'questions' | 'upload'
    const [dragOver, setDragOver] = useState(false);
    const fileRef = useRef(null);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const loadQuestions = async () => {
        try {
            const { data } = await adminGetQuestions();
            setQuestions(data);
        } catch {
            showToast('Failed to load questions', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadQuestions(); }, []);

    const handleDelete = async (id, title) => {
        if (!window.confirm(`Delete "${title}"?`)) return;
        try {
            await adminDeleteQuestion(id);
            setQuestions(q => q.filter(x => x._id !== id));
            showToast('Question deleted');
        } catch {
            showToast('Failed to delete question', 'error');
        }
    };

    const handleFile = async (file) => {
        if (!file) return;
        const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/json', 'text/plain'];
        if (!allowed.includes(file.type) && !file.name.endsWith('.json') && !file.name.endsWith('.txt')) {
            showToast('Only PDF, DOCX, JSON, or TXT files are supported', 'error');
            return;
        }
        setUploading(true);
        setPreview(null);
        try {
            const fd = new FormData();
            fd.append('file', file);
            const { data } = await adminParseDocument(fd);
            setPreview(data);
            setActiveTab('upload');
        } catch (err) {
            showToast(err.response?.data?.error || 'Parsing failed', 'error');
        } finally {
            setUploading(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    const handleSaveQuestion = async () => {
        if (!preview) return;
        setSaving(true);
        try {
            await adminSaveQuestion(preview);
            showToast('Question saved successfully! ✓');
            setPreview(null);
            loadQuestions();
            setActiveTab('questions');
        } catch (err) {
            showToast(err.response?.data?.error || 'Save failed', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handlePreviewChange = (field, val) => {
        setPreview(p => ({ ...p, [field]: val }));
    };

    return (
        <div className="admin-page">
            {/* Toast */}
            {toast && (
                <div className={`admin-toast admin-toast--${toast.type}`}>{toast.msg}</div>
            )}

            <div className="admin-page__header">
                <h1 className="admin-page__title">⚙ Admin Dashboard</h1>
                <p className="admin-page__subtitle">Manage SQL practice questions</p>
            </div>

            {/* Tabs */}
            <div className="admin-tabs">
                <button
                    id="admin-tab-questions"
                    className={`admin-tabs__tab ${activeTab === 'questions' ? 'active' : ''}`}
                    onClick={() => setActiveTab('questions')}
                >
                    Questions ({questions.length})
                </button>
                <button
                    id="admin-tab-upload"
                    className={`admin-tabs__tab ${activeTab === 'upload' ? 'active' : ''}`}
                    onClick={() => setActiveTab('upload')}
                >
                    + Upload New
                </button>
            </div>

            {/* Questions list */}
            {activeTab === 'questions' && (
                <div className="admin-questions">
                    {loading ? (
                        <div className="admin-questions__loading">
                            <div className="admin-spinner" />
                            <p>Loading questions...</p>
                        </div>
                    ) : questions.length === 0 ? (
                        <div className="admin-questions__empty">
                            <span>📭</span>
                            <p>No questions yet. Upload your first one!</p>
                        </div>
                    ) : (
                        <div className="admin-questions__list">
                            {questions.map(q => (
                                <div key={q._id} className="admin-qcard">
                                    <div className="admin-qcard__info">
                                        <span className={`admin-qcard__badge admin-qcard__badge--${q.difficulty}`}>
                                            {DIFFICULTY_LABELS[q.difficulty]}
                                        </span>
                                        <span className="admin-qcard__title">{q.title}</span>
                                        {q.tags?.length > 0 && (
                                            <div className="admin-qcard__tags">
                                                {q.tags.map(t => <span key={t} className="admin-qcard__tag">{t}</span>)}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        id={`delete-${q._id}`}
                                        className="admin-qcard__delete"
                                        onClick={() => handleDelete(q._id, q.title)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Upload + Preview */}
            {activeTab === 'upload' && (
                <div className="admin-upload">
                    {/* Drop zone */}
                    <div
                        className={`admin-dropzone ${dragOver ? 'admin-dropzone--over' : ''}`}
                        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        onClick={() => fileRef.current?.click()}
                    >
                        <input
                            ref={fileRef}
                            id="admin-file-input"
                            type="file"
                            accept=".pdf,.docx,.json,.txt"
                            style={{ display: 'none' }}
                            onChange={e => handleFile(e.target.files[0])}
                        />
                        {uploading ? (
                            <div className="admin-dropzone__loading">
                                <div className="admin-spinner" />
                                <p>Parsing document with AI...</p>
                            </div>
                        ) : (
                            <>
                                <span className="admin-dropzone__icon">📄</span>
                                <p className="admin-dropzone__label">Drop a file here or click to browse</p>
                                <p className="admin-dropzone__hint">Supports PDF, DOCX, JSON, TXT</p>
                            </>
                        )}
                    </div>

                    {/* Preview / edit panel */}
                    {preview && (
                        <div className="admin-preview">
                            <h2 className="admin-preview__heading">Review & Edit Before Saving</h2>

                            <div className="admin-preview__field">
                                <label>Title</label>
                                <input
                                    id="preview-title"
                                    className="admin-preview__input"
                                    value={preview.title || ''}
                                    onChange={e => handlePreviewChange('title', e.target.value)}
                                />
                            </div>

                            <div className="admin-preview__field">
                                <label>Description</label>
                                <textarea
                                    id="preview-description"
                                    className="admin-preview__textarea"
                                    value={preview.description || ''}
                                    onChange={e => handlePreviewChange('description', e.target.value)}
                                    rows={4}
                                />
                            </div>

                            <div className="admin-preview__row">
                                <div className="admin-preview__field">
                                    <label>Difficulty</label>
                                    <select
                                        id="preview-difficulty"
                                        className="admin-preview__select"
                                        value={preview.difficulty || 'easy'}
                                        onChange={e => handlePreviewChange('difficulty', e.target.value)}
                                    >
                                        <option value="easy">Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="hard">Hard</option>
                                    </select>
                                </div>
                                <div className="admin-preview__field">
                                    <label>Tags (comma separated)</label>
                                    <input
                                        id="preview-tags"
                                        className="admin-preview__input"
                                        value={(preview.tags || []).join(', ')}
                                        onChange={e => handlePreviewChange('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                                    />
                                </div>
                            </div>

                            <div className="admin-preview__field">
                                <label>Solution Query</label>
                                <textarea
                                    id="preview-solution"
                                    className="admin-preview__textarea admin-preview__textarea--code"
                                    value={preview.solutionQuery || ''}
                                    onChange={e => handlePreviewChange('solutionQuery', e.target.value)}
                                    rows={3}
                                    placeholder="SELECT ..."
                                />
                            </div>

                            <div className="admin-preview__field">
                                <label>Postgres Schema (DDL)</label>
                                <textarea
                                    id="preview-schema"
                                    className="admin-preview__textarea admin-preview__textarea--code"
                                    value={preview.postgresSchema || ''}
                                    onChange={e => handlePreviewChange('postgresSchema', e.target.value)}
                                    rows={5}
                                    placeholder="CREATE TABLE ..."
                                />
                            </div>

                            <div className="admin-preview__field">
                                <label>Hints (one per line)</label>
                                <textarea
                                    id="preview-hints"
                                    className="admin-preview__textarea"
                                    value={(preview.hints || []).join('\n')}
                                    onChange={e => handlePreviewChange('hints', e.target.value.split('\n').filter(Boolean))}
                                    rows={3}
                                />
                            </div>

                            <div className="admin-preview__actions">
                                <button
                                    className="admin-preview__discard"
                                    onClick={() => setPreview(null)}
                                >
                                    Discard
                                </button>
                                <button
                                    id="admin-save-question"
                                    className="admin-preview__save"
                                    onClick={handleSaveQuestion}
                                    disabled={saving}
                                >
                                    {saving ? <span className="admin-spinner admin-spinner--sm" /> : '✓ Save Question'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminPage;
