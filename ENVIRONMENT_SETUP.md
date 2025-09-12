# Environment Setup Guide

## Overview
This application uses environment variables to configure API endpoints and other settings. This ensures security and flexibility across different deployment environments.

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Base URL for the API server | `http://127.0.0.1:8000/` |
| `VITE_APP_ENV` | Application environment | `development` or `production` |

### Setting Up Environment Variables

#### 1. Create Environment File
Create a `.env` file in the `ui/` directory:

```bash
# Development
VITE_API_URL=http://127.0.0.1:8000/
VITE_APP_ENV=development
```

#### 2. Production Environment
For production, create a `.env.production` file:

```bash
# Production
VITE_API_URL=https://your-api-domain.com/
VITE_APP_ENV=production
```

#### 3. Local Development
For local development, create a `.env.local` file (this file is gitignored):

```bash
# Local development overrides
VITE_API_URL=http://localhost:8000/
VITE_APP_ENV=development
```

## Security Considerations

### 1. Environment File Security
- **Never commit `.env` files** to version control
- Use `.env.example` as a template
- Add `.env*` to `.gitignore`

### 2. API Security
- Use HTTPS in production
- Implement proper CORS policies
- Use authentication tokens
- Validate all API responses

### 3. Build Process
- Environment variables are embedded at build time
- Use different build commands for different environments
- Validate environment variables before deployment

## Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Deployment

### Vercel
Set environment variables in the Vercel dashboard under Project Settings > Environment Variables.

### Netlify
Set environment variables in the Netlify dashboard under Site Settings > Environment Variables.

### Docker
Use environment variables in your Dockerfile or docker-compose.yml:

```dockerfile
ENV VITE_API_URL=https://your-api-domain.com/
ENV VITE_APP_ENV=production
```

## Troubleshooting

### Common Issues

1. **Environment variables not loading**
   - Ensure variables start with `VITE_`
   - Restart the development server
   - Check file location (must be in `ui/` directory)

2. **API connection issues**
   - Verify the API URL is correct
   - Check CORS settings on the API server
   - Ensure the API server is running

3. **Build failures**
   - Check for missing environment variables
   - Verify all required variables are set
   - Check for typos in variable names
