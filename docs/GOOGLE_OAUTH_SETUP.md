# Google sign-in setup

DevCareerOS uses Google Identity Services in the browser to obtain a Google ID token. The backend verifies that token with Google's OAuth client library, checks that Google verified the email, finds or creates the matching MongoDB user, and returns the same seven-day DevCareerOS JWT used by password sign-in. The Google credential itself is not stored.

## 1. Create a Google OAuth client

1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Select or create a project and configure the OAuth consent screen / Google Auth Platform.
3. Create an OAuth client ID with application type **Web application**.
4. Add these Authorized JavaScript origins:
   - `http://localhost:5173` for local development
   - `https://devcareeros.netlify.app` for the deployed frontend
5. If using a different local or production domain, add that exact origin too.
6. Copy the client ID. The frontend and backend must use the same client ID. The browser client ID is public configuration; do not put a client secret in the frontend.

## 2. Local environment variables

In `backend/.env`, set:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_jwt_secret
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_oauth_web_client_id.apps.googleusercontent.com
```

In `frontend/.env`, set:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_oauth_web_client_id.apps.googleusercontent.com
```

Use the exact same Google client ID in both files. Restart both development servers after editing environment variables. Never commit real environment files or secrets.

## 3. Production deployment

Add these environment variables in the hosting dashboards:

- **Render backend:** `GOOGLE_CLIENT_ID` (along with the existing `MONGODB_URI`, `JWT_SECRET`, and `CLIENT_URL`).
- **Netlify frontend:** `VITE_GOOGLE_CLIENT_ID` and `VITE_API_BASE_URL=https://devcareeros-backend.onrender.com/api`.

For `CLIENT_URL`, use the deployed frontend origin, for example `https://devcareeros.netlify.app`. Redeploy the backend and trigger a new frontend build after setting the variables. Add any custom production domain to Google's Authorized JavaScript origins.

## 4. Account behavior

- A first-time Google user gets a DevCareerOS user record without a password hash.
- If a password-based account already has the same verified email, Google sign-in links the Google subject ID to that account so the existing career data stays attached to the same MongoDB user.
- Google ID tokens are verified by the backend against the configured client ID. The frontend does not trust the token payload by itself.
- The backend then issues the usual DevCareerOS JWT; protected API routes continue using the existing bearer-token middleware.

## 5. Test checklist

1. Start the backend and frontend.
2. Open `http://localhost:5173/login` and use the Google button.
3. Confirm successful sign-in redirects to the dashboard.
4. Sign out and try the same Google account again; it should return to the same account and existing data.
5. Try the Google button on `/register` with a new Google account; it should create an account and open the dashboard.
6. Confirm the browser console and backend logs contain no OAuth configuration or origin errors.

If Google sign-in reports a configuration error, verify both client ID variables match and that the current frontend origin is listed in Google Cloud Console.
