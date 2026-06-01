import { Router } from 'express'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import jwt from 'jsonwebtoken'
import { User } from '../models/User'

const router = Router()

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID??"",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
  callbackURL: '/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  const email = profile.emails?.[0].value
  let user = await User.findOne({ googleId: profile.id })
  if (!user) {
    user = await User.create({
      googleId: profile.id,
      username: profile.displayName,
    })
  }
  done(null, user)
}))

router.get('/google', passport.authenticate('google', { scope: ['profile'] }))

router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const user = req.user as any
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET ?? 'secret', { expiresIn: '7d' })
    // redirect to frontend with token
    res.redirect(`http://localhost:5173/auth/callback?token=${token}`)
  }
)

export default router