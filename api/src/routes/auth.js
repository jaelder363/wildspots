const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const { supabase } = require('../db/supabase');

// Send magic link
router.post('/magiclink', async (req, res, next) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.CLIENT_URL}/auth/callback`,
      },
    });

    if (error) {
      console.error('Magic link error:', error);
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Check your email for the login link!' });
  } catch (error) {
    console.error('Magic link error:', error);
    next(error);
  }
});

// Verify session
router.get('/session', async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ user: null });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error) {
      return res.status(401).json({ user: null });
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
});

// Logout
router.post('/logout', async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      await supabase.auth.signOut(token);
    }
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
