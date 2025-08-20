import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import passport from '../config/passport';

const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET!, { expiresIn: '24h' });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({ email, password, name });
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email']
});

export const googleCallback = (req: Request, res: Response, next: any) => {
  passport.authenticate('google', { session: false }, (err: any, user: any) => {
    if (err) {
      console.error('Google OAuth error:', err);
      return res.redirect(`${process.env.CLIENT_URL}#/auth/error?message=oauth_error`);
    }

    if (!user) {
      console.error('No user returned from Google OAuth');
      return res.redirect(`${process.env.CLIENT_URL}#/auth/error?message=no_user`);
    }

    try {
      const token = generateToken(user._id);
      const userData = {
        id: user._id,
        email: user.email,
        name: user.name
      };

      const redirectUrl = `${process.env.CLIENT_URL}#/auth/success?token=${encodeURIComponent(token)}&user=${encodeURIComponent(JSON.stringify(userData))}`;
      
      return res.redirect(redirectUrl);
    } catch (tokenError) {
      console.error('Token generation error:', tokenError);
      return res.redirect(`${process.env.CLIENT_URL}#/auth/error?message=token_error`);
    }
  })(req, res, next);
};