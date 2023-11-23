const isAdmin = (req, res, next) => {
    const user = req.user;
    // Log the user object to check its structure

    if (user && user.is_Admin === 1) {
        next();
    } else {
        res.status(403).json({ error: 'Unauthorized - Admin access required' });
    }
};

module.exports = { isAdmin };

