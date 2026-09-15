const html = require('fs').readFileSync('pagespeed.html', 'utf8'); console.log(html.includes('"score": 0.9') || html.includes('"score":0.9'));
