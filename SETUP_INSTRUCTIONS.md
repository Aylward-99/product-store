# Setup Instructions for Your Local Machine

## Step 1: Create the project structure

Create a new folder called `product-store` and create these files:

## Step 2: Essential Files to Copy

### 1. Copy package.json (from the file above)
### 2. Copy all files from client/src/ folder  
### 3. Copy all files from server/ folder
### 4. Copy shared/schema.ts
### 5. Copy configuration files

## Step 3: After copying all files

1. Open terminal in your project folder
2. Run: `npm install`
3. Run: `npm run dev` (to test locally)
4. Initialize git and push:

```bash
git init
git remote add origin https://github.com/Aylward-99/product-store.git
git add .
git commit -m "Initial commit: Enhanced product gallery"
git push -u origin main
```

## Alternative: Use this curl command

Run this in your terminal to download the files directly:

```bash
mkdir product-store
cd product-store
# I'll provide download links for each file
```

## Files needed (copy these from Replit):
- package.json
- README.md
- .gitignore
- All client/ files
- All server/ files  
- shared/schema.ts
- Configuration files (tsconfig.json, tailwind.config.ts, etc.)