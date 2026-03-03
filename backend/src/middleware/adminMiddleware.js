/**
 * Admin middleware — must be used AFTER authMiddleware.
 * Blocks access unless the authenticated user has role === 'admin'.
 */
const adminMiddleware = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied: Admins only' });
    }
    next();
};

module.exports = adminMiddleware;
