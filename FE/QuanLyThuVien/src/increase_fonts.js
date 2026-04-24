import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const files = [
    'components/home/NewBooks.css',
    'components/home/PopularBooks.css',
    'components/home/BookCategories.css',
    'components/home/BrowseBooks.css',
    'components/home/BorrowingRules.css',
    'components/home/HomeAnnouncements.css',
    'components/home/PromotionProgram.css',
    'components/layout/LibraryHero.css'
];

files.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${filePath}`);
        return;
    }
    
    let css = fs.readFileSync(filePath, 'utf8');
    
    css = css.replace(/font-size:\s*(\d+)px/g, (match, size) => {
        let val = parseInt(size);
        if (val >= 11 && val <= 20) {
            val += 2; // Increase normal text
        } else if (val > 20 && val <= 40) {
            val += 4; // Increase headings
        } else if (val > 40) {
            val += 6; // Increase very large text
        }
        return `font-size: ${val}px`;
    });
    
    fs.writeFileSync(filePath, css);
    console.log(`Updated fonts in ${file}`);
});
