# Podcaster Web App - Setup Guide

## Overview

A professional podcast hosting platform built with Next.js, featuring complete authentication, podcast management, and collaborator support. The app uses Axios for all API calls and supports both light and dark themes.

## Environment Variables

Create a `.env.local` file in the project root with the following variable:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

Replace the API URL with your actual backend server address.

## Key Features

### Authentication
- Register with email and password
- Login with email and password
- OTP verification for enhanced security
- OTP resend functionality
- Forgot password and password reset flows
- Secure token storage (accessToken & refreshToken)

### Podcast Management
- Create new podcasts with metadata (title, author, category, genre)
- Edit existing podcasts
- Upload podcast artwork and audio files
- Hide/Unhide podcasts from visibility
- Remove podcasts
- View all your podcasts
- List stats on dashboard

### Collaborator Features
- Search for artists/podcasters via autocomplete
- Add multiple collaborators to podcasts
- Display collaborator information on podcast cards
- Edit collaborators on existing podcasts

### Profile Management
- View and edit profile information (name, bio, profile image)
- View email address
- Delete account with confirmation


### Theme Support
- Light and dark mode toggle
- System preference detection
- Theme persistence in localStorage
- Smooth transitions between themes

## API Integration

### Axios Setup

The app uses Axios with the following features:

- **Centralized Configuration**: All API calls go through `/lib/api.ts`
- **Automatic Token Management**: Bearer tokens are automatically added to all authenticated requests
- **Error Handling**: Global error interceptor with user-friendly messages
- **Base URL Configuration**: Configurable via `NEXT_PUBLIC_API_URL` environment variable

### API Endpoints Used

**Authentication:**
- POST `/podcaster/register` - Register new podcaster
- POST `/podcaster/login` - Login
- POST `/podcaster/verifyOtp` - Verify OTP
- POST `/podcaster/resendOtp` - Resend OTP
- POST `/podcaster/forgotPassword` - Request password reset
- POST `/podcaster/resetPassword` - Reset password
- POST `/podcaster/logout` - Logout

**Profile:**
- GET `/podcaster/profile/me` - Get current profile
- PUT `/podcaster/profile/edit` - Update profile

**Podcasts:**
- POST `/podcaster/podcast/upload` - Upload new podcast
- PUT `/podcaster/podcast/edit` - Edit podcast
- DELETE `/podcaster/podcast/remove` - Remove podcast
- POST `/podcaster/podcast/hide` - Hide podcast
- POST `/podcaster/podcast/unhide` - Unhide podcast
- GET `/podcaster/podcast/my` - Get user's podcasts


**Collaboration:**
- GET `/artist/search?q=:query` - Search artists
- GET `/artist/getAllArtists` - Get all artists

**Account:**
- DELETE `/podcaster/account` - Delete account

## File Structure

```
/app
  /(auth)              # Authentication pages
    /login
    /register
    /verify-otp
    /forgot-password
  /(app)               # Protected app pages
    /dashboard         # Dashboard with stats
    /podcasts          # My podcasts list
    /podcast
      /new            # Create podcast
      /edit/[id]      # Edit podcast
    /profile          # User profile
    /settings
      /delete-account # Delete account
  /layout.tsx         # Root layout with providers
  /page.tsx          # Home redirect

/components
  /navbar.tsx        # Main navigation with theme toggle
  /podcast-card.tsx  # Podcast card component
  /collaborator-selector.tsx # Artist selection component

/lib
  /api.ts                # Axios API client
  /auth-context.tsx     # Authentication context
  /theme-context.tsx    # Theme management context

/app/globals.css       # Theme colors and global styles
```

## Color System

### Light Theme (Default)
- **Background**: White (oklch 0.98 0 0)
- **Foreground**: Dark Gray (oklch 0.08 0 0)
- **Primary**: Purple (oklch 0.65 0.2 268)
- **Cards**: White with subtle borders

### Dark Theme
- **Background**: Almost Black (oklch 0.08 0 0)
- **Foreground**: Light Gray (oklch 0.95 0 0)
- **Primary**: Purple (oklch 0.65 0.2 268)
- **Cards**: Dark with subtle borders

## Theme Toggle

The theme toggle button is located in the navbar and:
- Shows ☀️ in dark mode (switch to light)
- Shows 🌙 in light mode (switch to dark)
- Available on both desktop and mobile
- Persists user choice in localStorage
- Smooth CSS transitions between themes

## Security Features

- **Bearer Token Authentication**: All protected endpoints require valid Bearer token
- **HTTP-Only Storage**: Tokens stored in localStorage (consider using httpOnly cookies for production)
- **Automatic Token Injection**: Axios interceptor adds tokens to all requests
- **Error Handling**: Graceful error messages for failed requests
- **Protected Routes**: App pages require authentication
- **Token Refresh**: System supports both accessToken and refreshToken

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   - Create `.env.local` with `NEXT_PUBLIC_API_URL`

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Access Application**:
   - Open http://localhost:3000
   - You'll be redirected to login if not authenticated
   - Create an account or login with existing credentials

## Authentication Flow

1. **Registration**: User creates account → OTP verification → Logged in
2. **Login**: Email + password → OTP verification → Logged in
3. **Password Reset**: Forgot password → OTP → New password → Logged in
4. **Session**: Token stored in localStorage → Included in all requests
5. **Logout**: Token cleared → Redirected to login

## Development Notes

- All API calls are made through the centralized Axios client
- Theme changes are instant with smooth CSS transitions
- Protected routes redirect to login if not authenticated
- Error messages are user-friendly and informative
- Components are modular and reusable
- Uses shadcn/ui components for consistency

## Browser Support

- Modern browsers with ES6+ support
- Light/dark mode preference detection requires CSS Media Queries
- Works on desktop, tablet, and mobile devices

## Production Considerations

- Replace `NEXT_PUBLIC_API_URL` with production API endpoint
- Consider using httpOnly cookies for token storage instead of localStorage
- Implement token refresh logic for long sessions
- Add rate limiting on API calls
- Implement CSRF protection
- Use HTTPS for all communications
