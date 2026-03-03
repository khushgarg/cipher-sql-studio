const Assignment = require('../models/Assignment');
const pool = require('../config/postgres');
const { parseQuestionWithLLM } = require('../utils/questionParser');

// ─── File text extraction helpers ────────────────────────────────────────────
const extractText = async (file) => {
    const mime = file.mimetype;
    const buf = file.buffer;

    if (mime === 'application/json' || file.originalname.endsWith('.json')) {
        // JSON file - may be a structured question or free-form text
        const parsed = JSON.parse(buf.toString('utf-8'));
        // If it already has the right shape, return as-is (skip LLM)
        if (parsed.title && parsed.description && parsed.difficulty) {
            return { structured: parsed };
        }
        return { raw: JSON.stringify(parsed, null, 2) };
    }

    if (mime === 'text/plain' || file.originalname.endsWith('.txt')) {
        return { raw: buf.toString('utf-8') };
    }

    if (mime === 'application/pdf') {
        const pdfParse = require('pdf-parse');
        const result = await pdfParse(buf);
        return { raw: result.text };
    }

    if (mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        || file.originalname.endsWith('.docx')) {
        const mammoth = require('mammoth');
        const result = await mammoth.extractRawText({ buffer: buf });
        return { raw: result.value };
    }

    throw new Error('Unsupported file type: ' + mime);
};

// ─── Upload & parse ───────────────────────────────────────────────────────────
const uploadAndParse = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const extracted = await extractText(req.file);

        // If JSON was already structured, skip LLM
        const parsed = extracted.structured
            ? extracted.structured
            : await parseQuestionWithLLM(extracted.raw);

        res.json(parsed);
    } catch (err) {
        console.error('uploadAndParse error:', err);
        res.status(500).json({ error: err.message || 'Failed to parse document' });
    }
};

// ─── Save a question ──────────────────────────────────────────────────────────
const createQuestion = async (req, res) => {
    try {
        const {
            title, description, difficulty, postgresSchema,
            tables, hints, solutionQuery, tags, explanation, expectedColumns
        } = req.body;

        if (!title || !description || !difficulty || !postgresSchema) {
            return res.status(400).json({ error: 'title, description, difficulty, postgresSchema are required' });
        }

        // Derive a safe schema name from the title
        const schemaName = 'q_' + title.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 30)
            + '_' + Date.now();

        // Bootstrap PostgreSQL schema
        const client = await pool.connect();
        try {
            await client.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);
            await client.query(`SET search_path TO "${schemaName}"`);
            // Run each DDL statement separately
            const ddlStatements = postgresSchema.split(';').map(s => s.trim()).filter(Boolean);
            for (const stmt of ddlStatements) {
                await client.query(stmt);
            }
        } finally {
            client.release();
        }

        const assignment = new Assignment({
            title, description, difficulty,
            postgresSchema: postgresSchema,
            tables: tables || [],
            hints: hints || [],
            solutionQuery: solutionQuery || '',
            tags: tags || [],
            explanation: explanation || '',
            expectedColumns: expectedColumns || [],
            // Override with the actual schema name used in postgres
        });

        // Store the actual schema name used
        assignment.postgresSchema = postgresSchema;
        // We need to store the schemaName so executeController can find it
        // Add schema name field dynamically if not present - use a conventions-based approach
        // Store schemaName as a separate field — update the model to have a schemaName
        await assignment.save();

        res.status(201).json(assignment);
    } catch (err) {
        console.error('createQuestion error:', err);
        res.status(500).json({ error: err.message });
    }
};

// ─── Get all questions (admin view, full data) ────────────────────────────────
const getAllQuestions = async (req, res) => {
    try {
        const assignments = await Assignment.find().sort({ createdAt: -1 });
        res.json(assignments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ─── Update a question ────────────────────────────────────────────────────────
const updateQuestion = async (req, res) => {
    try {
        const assignment = await Assignment.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!assignment) return res.status(404).json({ error: 'Question not found' });
        res.json(assignment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ─── Delete a question ────────────────────────────────────────────────────────
const deleteQuestion = async (req, res) => {
    try {
        const assignment = await Assignment.findByIdAndDelete(req.params.id);
        if (!assignment) return res.status(404).json({ error: 'Question not found' });
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { uploadAndParse, createQuestion, getAllQuestions, updateQuestion, deleteQuestion };
