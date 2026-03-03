const Attempt = require('../models/Attempt');
const Assignment = require('../models/Assignment');

/**
 * GET /api/progress/me
 * Returns personal statistics for the authenticated user.
 */
const getMyProgress = async (req, res) => {
    try {
        const userId = req.user.id;

        const attempts = await Attempt.find({ userId })
            .populate('assignmentId', 'title difficulty tags')
            .sort({ executedAt: -1 });

        const solvedSet = new Set();
        const solvedByDifficulty = { easy: 0, medium: 0, hard: 0 };
        let totalAttempts = attempts.length;

        for (const a of attempts) {
            if (a.isCorrect && a.assignmentId) {
                const id = a.assignmentId._id.toString();
                if (!solvedSet.has(id)) {
                    solvedSet.add(id);
                    const diff = a.assignmentId.difficulty;
                    if (diff in solvedByDifficulty) solvedByDifficulty[diff]++;
                }
            }
        }

        // Recent activity (last 10, successful only)
        const recent = attempts
            .filter(a => a.isCorrect)
            .slice(0, 10)
            .map(a => ({
                title: a.assignmentId?.title || 'Unknown',
                difficulty: a.assignmentId?.difficulty,
                solvedAt: a.executedAt,
            }));

        res.json({
            totalSolved: solvedSet.size,
            totalAttempts,
            byDifficulty: solvedByDifficulty,
            recentSolved: recent,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * GET /api/progress/leaderboard
 * Returns top 10 users by number of unique questions solved.
 */
const getLeaderboard = async (req, res) => {
    try {
        const results = await Attempt.aggregate([
            { $match: { isCorrect: true, userId: { $ne: null } } },
            { $group: { _id: { userId: '$userId', assignmentId: '$assignmentId' } } },
            { $group: { _id: '$_id.userId', solved: { $sum: 1 } } },
            { $sort: { solved: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            { $unwind: { path: '$user', preserveNullAndEmpty: true } },
            {
                $project: {
                    _id: 0,
                    username: '$user.username',
                    solved: 1,
                },
            },
        ]);

        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getMyProgress, getLeaderboard };
