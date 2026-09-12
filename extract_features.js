const fs = require('fs');
const path = require('path');

const srcDir = 'f:/Projects/chaitali artbizz';
const destDir = 'F:/Projects/Website features/chaitali_artbizz_extracted';

function copyFolderSync(from, to) {
    if (!fs.existsSync(from)) return;
    fs.mkdirSync(to, { recursive: true });
    const items = fs.readdirSync(from, { withFileTypes: true });
    for (const item of items) {
        const srcPath = path.join(from, item.name);
        const destPath = path.join(to, item.name);
        
        if (item.name === 'node_modules' || item.name === '.git' || item.name === 'dist') continue;

        if (item.isDirectory()) {
            copyFolderSync(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// 1. Admin Frontend
console.log('Copying Admin Frontend...');
copyFolderSync(path.join(srcDir, 'src/pages/admin'), path.join(destDir, 'frontend/pages/admin'));

// 2. Core Frontend Components
console.log('Copying Frontend Components...');
copyFolderSync(path.join(srcDir, 'src/components'), path.join(destDir, 'frontend/components'));

// 3. Frontend Context (State Management)
console.log('Copying Frontend Context...');
copyFolderSync(path.join(srcDir, 'src/context'), path.join(destDir, 'frontend/context'));

// 4. Frontend Utilities (Cloudinary, etc - "Cloud dependencies pending")
console.log('Copying Frontend Utils...');
copyFolderSync(path.join(srcDir, 'src/utils'), path.join(destDir, 'frontend/utils'));
copyFolderSync(path.join(srcDir, 'src/config'), path.join(destDir, 'frontend/config'));

// 5. Backend Routes & Controllers
console.log('Copying Backend API Routes...');
copyFolderSync(path.join(srcDir, 'server/routes'), path.join(destDir, 'backend/routes'));
copyFolderSync(path.join(srcDir, 'server/middleware'), path.join(destDir, 'backend/middleware'));

// 6. Database Schema
console.log('Copying Database Schema...');
copyFolderSync(path.join(srcDir, 'server/prisma'), path.join(destDir, 'backend/prisma'));

// 7. Backend entry point (for reference)
console.log('Copying Backend Index...');
if (fs.existsSync(path.join(srcDir, 'server/index.js'))) {
    fs.mkdirSync(path.join(destDir, 'backend'), { recursive: true });
    fs.copyFileSync(path.join(srcDir, 'server/index.js'), path.join(destDir, 'backend/index.js'));
}

console.log('Extraction complete! Check F:/Projects/Website features/chaitali_artbizz_extracted');
