# Google Sign-In Setup Guide

## Overview
The login page now includes a "Sign in with Google" button. To make it fully functional, you need to set up Google OAuth.

## Steps to Enable Google Sign-In

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: "IT Documentation Portal"
4. Click "Create"

### 2. Enable Google Sign-In API

1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google+ API" or "Google Identity"
3. Click "Enable"

### 3. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - User Type: External
   - App name: IT Documentation Portal
   - User support email: Your email
   - Developer contact: Your email
   - Click "Save and Continue"
4. Select Application type: "Web application"
5. Add Authorized JavaScript origins:
   - `http://localhost:8080`
   - `http://127.0.0.1:8080`
6. Add Authorized redirect URIs:
   - `http://localhost:8080/login.html`
   - `http://127.0.0.1:8080/login.html`
7. Click "Create"
8. Copy your Client ID (looks like: `xxxxx.apps.googleusercontent.com`)

### 4. Update Your Code

1. Open `frontend/login.html`
2. Find this line:
   ```html
   data-client_id="YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
   ```
3. Replace `YOUR_GOOGLE_CLIENT_ID` with your actual Client ID

### 5. Backend Integration (Optional - For Production)

To fully integrate Google Sign-In with your backend:

1. Install Google Auth Library:
   ```bash
   cd backend
   npm install google-auth-library
   ```

2. Create a new route in `backend/routes/authRoutes.js`:
   ```javascript
   const { OAuth2Client } = require('google-auth-library');
   const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

   router.post('/google-login', async (req, res) => {
     try {
       const { credential } = req.body;
       const ticket = await client.verifyIdToken({
         idToken: credential,
         audience: process.env.GOOGLE_CLIENT_ID,
       });
       const payload = ticket.getPayload();
       
       // Find or create user with payload.email
       let user = await User.findOne({ email: payload.email });
       
       if (!user) {
         user = await User.create({
           name: payload.name,
           email: payload.email,
           password: 'google-oauth', // No password for Google users
           role: 'user'
         });
       }
       
       const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
       res.json({ token, user });
     } catch (error) {
       res.status(401).json({ message: 'Invalid Google token' });
     }
   });
   ```

3. Add to `.env`:
   ```
   GOOGLE_CLIENT_ID=your_client_id_here
   ```

4. Update `frontend/js/login.js` handleGoogleSignIn function:
   ```javascript
   async function handleGoogleSignIn(response) {
     try {
       const res = await fetch(`${API_URL}/auth/google-login`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ credential: response.credential })
       });
       
       const data = await res.json();
       
       if (res.ok) {
         localStorage.setItem('token', data.token);
         localStorage.setItem('user', JSON.stringify(data.user));
         
         if (data.user.role === 'admin') {
           window.location.href = 'admin.html';
         } else {
           window.location.href = 'user.html';
         }
       }
     } catch (error) {
       console.error('Google Sign-In error:', error);
     }
   }
   ```

## Testing

1. Make sure both backend and frontend servers are running
2. Open `http://127.0.0.1:8080/login.html`
3. Click "Sign in with Google"
4. Select your Google account
5. You should be redirected to the dashboard

## Notes

- For development, you can test without backend integration
- For production, always use HTTPS
- Keep your Client ID secure
- Add your production domain to authorized origins

## Troubleshooting

**Error: "Invalid Client ID"**
- Make sure you replaced YOUR_GOOGLE_CLIENT_ID with your actual Client ID
- Check that the Client ID is correct

**Error: "Unauthorized origin"**
- Add your domain to Authorized JavaScript origins in Google Cloud Console

**Button doesn't work**
- Check browser console for errors
- Make sure Google Sign-In script is loaded
