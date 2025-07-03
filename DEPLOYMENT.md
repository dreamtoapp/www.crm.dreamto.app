# Deployment Guide

## Environment Variables Required

### Database
```env
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority"
```

### Cloudinary (Image Upload)
```env
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
CLOUDINARY_UPLOAD_PRESET="your-upload-preset"
CLOUDINARY_CLIENT_FOLDER="uploads"
```

### Application
```env
NEXT_PUBLIC_BASE_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="https://your-domain.vercel.app"
```

## Vercel Deployment Steps

1. **Connect Repository**
   - Link your GitHub repository to Vercel
   - Select the main branch

2. **Configure Environment Variables**
   - Go to Project Settings > Environment Variables
   - Add all required variables above

3. **Deploy**
   - Vercel will automatically detect Next.js
   - Build command: `pnpm run build`
   - Install command: `pnpm install`

## Health Check

After deployment, verify the application is working:
- Health endpoint: `https://your-domain.vercel.app/api/health`
- Should return: `{"status":"healthy","database":"connected"}`

## Troubleshooting

### Build Failures
- Check environment variables are set correctly
- Verify DATABASE_URL is accessible
- Ensure Prisma client generates successfully

### Runtime Errors
- Check Vercel function logs
- Verify database connection
- Test health endpoint

### Performance Issues
- Monitor function execution time
- Check database query performance
- Review image optimization settings 