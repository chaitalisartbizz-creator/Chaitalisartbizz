const fs = require('fs');
const file = 'src/components/ScrollReveal.jsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/initial="hidden"/g, 'initial="visible"');
fs.writeFileSync(file, content);
console.log('ScrollReveal disabled for screenshot testing');
