const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir('c:/Users/bicky/Desktop/Projects/CrewNex/Frontend/src', function(filePath) {
    if (filePath.endsWith('.jsx') || filePath.endsWith('.js') || filePath.endsWith('.tsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;
        
        // Replace low contrast text classes
        content = content.replace(/text-white\/30/g, 'text-white/60');
        content = content.replace(/text-white\/40/g, 'text-white/70');
        content = content.replace(/text-white\/50/g, 'text-white/80');
        content = content.replace(/placeholder-white\/30/g, 'placeholder-white/60');
        
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Updated:', filePath);
        }
    }
});
