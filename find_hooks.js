const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('src');

files.forEach(file => {
  const code = fs.readFileSync(file, 'utf8');
  try {
    const ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx']
    });

    traverse(ast, {
      Function(path) {
        let hasReturnOrIf = false;
        let returnLine = -1;
        path.traverse({
          ReturnStatement(retPath) {
            if (retPath.parentPath.isBlockStatement() && retPath.parentPath.parentPath === path) {
              // top level return
              hasReturnOrIf = true;
              returnLine = retPath.node.loc.start.line;
            }
          },
          IfStatement(ifPath) {
             if (ifPath.parentPath.isBlockStatement() && ifPath.parentPath.parentPath === path) {
                 if (ifPath.node.consequent.type === 'ReturnStatement' || 
                     (ifPath.node.consequent.type === 'BlockStatement' && ifPath.node.consequent.body.some(n => n.type === 'ReturnStatement'))) {
                     hasReturnOrIf = true;
                     returnLine = ifPath.node.loc.start.line;
                 }
             }
          },
          CallExpression(callPath) {
            if (callPath.node.callee.name && callPath.node.callee.name.startsWith('use')) {
              // hook call
              if (hasReturnOrIf && callPath.node.loc.start.line > returnLine) {
                console.log(`Violation in ${file} at line ${callPath.node.loc.start.line} (return at ${returnLine})`);
              }
              // Also check if inside an if or loop
              let p = callPath.parentPath;
              while (p && p !== path) {
                if (p.isIfStatement() || p.isForStatement() || p.isWhileStatement() || p.isFunction()) {
                  if (!p.isFunction()) {
                    console.log(`Conditional hook in ${file} at line ${callPath.node.loc.start.line}`);
                  }
                }
                p = p.parentPath;
              }
            }
          }
        });
      }
    });
  } catch (e) {
    // console.log("Parse error on " + file);
  }
});
