import { Router } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { UserStat } from "../models/UserStat";

const router = Router();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const profilePic =
        // Got some help from claude with this since it was too weird  
        profile.photos?.[0]?.value?.replace("=s96-c", "=s400-c") ?? "";
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            username: profile.displayName,
            profilePic,
          });
          const userStat = await UserStat.findOne({
            username: profile.displayName,
          });
          if (!userStat) {
            const stats = await UserStat.create({
              username: profile.displayName,
            });
          }
        } else {
          if (
            !user.profilePic ||
            user.profilePic.includes("googleusercontent.com")
          ) {
            user.profilePic = profilePic;
            await user.save();
          }
        }
        done(null, user);
      } catch (err) {
        done(err as Error);
      }
    },
  ),
);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const user = req.user as any;
    const token = jwt.sign(
      {
        username: user.username,
        profilePic: user.profilePic,
      },
      process.env.JWT_SECRET ?? "secret",
      { expiresIn: "14d" },
    );
    res.redirect(`${process.env.FRONTEND_URL ??"http://localhost:5173"}/auth/callback?token=${token}`);
  },
);

export default router;
