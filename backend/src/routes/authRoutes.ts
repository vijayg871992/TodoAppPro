import { Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { authenticate, AuthRequest } from '../middleware/auth';
import passport from '../config/passport';

const router = Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }
    
    // Create new user
    const user = new User({ email, password, name });
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET || 'todoapppro-secret-2025',
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(400).json({ error: 'Registration failed' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Find user and include password for comparison
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'todoapppro-secret-2025',
      { expiresIn: '7d' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(400).json({ error: 'Login failed' });
  }
});

// Get current user (protected route)
router.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name
      }
    });
  } catch (error) {
    res.status(400).json({ error: 'Failed to get user info' });
  }
});

// Google OAuth routes
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', { session: false }, (err: any, user: any) => {
    if (err) {
      console.error('Google OAuth error:', err);
      return res.redirect(`${process.env.CLIENT_URL || 'https://vijayg.dev/todoapppro'}/#/auth/error?message=oauth_error`);
    }

    if (!user) {
      console.error('No user returned from Google OAuth');
      return res.redirect(`${process.env.CLIENT_URL || 'https://vijayg.dev/todoapppro'}/#/auth/error?message=no_user`);
    }

    try {
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || 'todoapppro-secret-2025',
        { expiresIn: '7d' }
      );

      const userData = {
        id: user._id,
        email: user.email,
        name: user.name
      };

      const redirectUrl = `${process.env.CLIENT_URL || 'https://vijayg.dev/todoapppro'}/#/auth/success?token=${encodeURIComponent(token)}&user=${encodeURIComponent(JSON.stringify(userData))}`;
      
      return res.redirect(redirectUrl);
    } catch (tokenError) {
      console.error('Token generation error:', tokenError);
      return res.redirect(`${process.env.CLIENT_URL || 'https://vijayg.dev/todoapppro'}/#/auth/error?message=token_error`);
    }
  })(req, res, next);
});

export default router;