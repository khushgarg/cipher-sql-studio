const express = require('express');
const router = express.Router();
const multer = require('multer');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/adminMiddleware');
const {
    uploadAndParse,
    createQuestion,
    getAllQuestions,
    updateQuestion,
    deleteQuestion,
} = require('../controllers/adminController');

// File upload: in-memory, max 10 MB
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
});

// All routes require auth + admin role
router.use(authMiddleware, adminMiddleware);

router.post('/upload', upload.single('file'), uploadAndParse);
router.post('/questions', createQuestion);
router.get('/questions', getAllQuestions);
router.put('/questions/:id', updateQuestion);
router.delete('/questions/:id', deleteQuestion);

module.exports = router;
