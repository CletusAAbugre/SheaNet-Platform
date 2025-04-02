const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

exports.register = async (req, res) => {
    try {
        const { name, email, password, role = 'user' } = req.body;

        if (await User.findOne({ email })) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const user = await User.create({
            name,
            email,
            password: await bcrypt.hash(password, 12),
            role
        });

        res.status(201).json({
            token: generateToken(user),
            user: { id: user._id, name, email, role }
        });
    } catch (err) {
        res.status(500).json({
            error: 'Registration failed',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json({
            token: generateToken(user),
            user: {
                id: user._id,
                name: user.name,
                email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({
            error: 'Login failed',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

exports.logout = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(t => t.token !== req.token);
        await req.user.save();
        res.json({ message: 'Logged out successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Logout failed' });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'Email not found' });
        }

        const resetToken = generateToken(user);
        user.resetToken = resetToken;
        await user.save();

        // In production: Send email with resetToken
        res.json({ message: 'Reset email sent' });
    } catch (err) {
        res.status(500).json({ error: 'Password reset failed' });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user || user.resetToken !== token) {
            return res.status(400).json({ error: 'Invalid token' });
        }

        user.password = await bcrypt.hash(newPassword, 12);
        user.resetToken = undefined;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(400).json({ error: 'Invalid or expired token' });
    }
};