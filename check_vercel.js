const https = require('https');

https.get('https://chaitalisartbizzz.vercel.app', (res) => {
  let html = '';
  res.on('data', d => html += d);
  res.on('end', () => {
    const match = html.match(/src="\/assets\/index-([^"']+)\.js"/);
    if (match) {
      const url = 'https://chaitalisartbizzz.vercel.app/assets/index-' + match[1] + '.js';
      https.get(url, (res2) => {
        let js = '';
        res2.on('data', d => js += d);
        res2.on('end', () => {
          const adminMatch = js.match(/AdminProducts-[^"']+\.js/);
          console.log('Admin Chunk:', adminMatch ? adminMatch[0] : 'Not found');
          if (adminMatch) {
            https.get('https://chaitalisartbizzz.vercel.app/assets/' + adminMatch[0], (res3) => {
              let adminJs = '';
              res3.on('data', d => adminJs += d);
              res3.on('end', () => {
                console.log('Contains old text?', adminJs.includes('Type a new sub-category'));
                console.log('Contains new text?', adminJs.includes('Type or select a new'));
              });
            });
          }
        });
      });
    }
  });
});
