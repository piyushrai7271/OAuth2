import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model.js";

const configureGoogleStrategy = () => {
  const {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    BACKEND_BASE_URL,
    CORS_ORIGIN,
  } = process.env;

  if (
    !GOOGLE_CLIENT_ID ||
    !GOOGLE_CLIENT_SECRET ||
    !BACKEND_BASE_URL ||
    !CORS_ORIGIN
  ) {
    console.error("❌ Missing required Google OAuth environment variables");
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: `${BACKEND_BASE_URL}/api/user/google/callback`,
        passReqToCallback: true,
      },
      // Verify callback
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value?.toLowerCase();
          if (!email) return done(new Error("Google email not provided"));

          // Try existing by googleId first
          let user = await User.findOne({ googleId: profile.id });

          if (!user) {
            // If not found, try by email (merge/link)
            user = await User.findOne({ email });

            if (user) {
              // link google to existing local account
              user.googleId = profile.id;
              user.authProvider = user.password ? "mixed" : "google";
              user.avatar = user.avatar || profile.photos?.[0]?.value;
              await user.save({ validateBeforeSave: false });
            } else {
              // brand new Google account
              user = await User.create({
                userName: profile.displayName,
                email,
                password: null, // no local password
                googleId: profile.id,
                authProvider: "google",
                avatar: profile.photos?.[0]?.value,
              });
            }
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};

// Export a function instead of running immediately
export default configureGoogleStrategy;
