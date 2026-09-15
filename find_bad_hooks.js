const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

function findFiles(dir, filter, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        findFiles(filePath, filter, fileList);
      }
    } else if (filter.test(filePath)) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const files = findFiles(process.argv[2], /\.(js|jsx)$/);

files.forEach(file => {
  const code = fs.readFileSync(file, 'utf-8');
  try {
    const ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx']
    });

    traverse(ast, {
      CallExpression(path) {
        if (path.node.callee.name && path.node.callee.name.startsWith('use') && path.node.callee.name !== 'use') {
          const hookName = path.node.callee.name;
          
          let parent = path.parentPath;
          while (parent) {
            if (parent.isIfStatement() || parent.isForStatement() || parent.isWhileStatement() || parent.isDoWhileStatement() || parent.isSwitchStatement() || parent.isConditionalExpression() || parent.isLogicalExpression()) {
              console.log(`CONDITIONAL HOOK: ${hookName} inside ${parent.type} in ${file}:${path.node.loc.start.line}`);
              break;
            }
            if (parent.isFunctionDeclaration() || parent.isArrowFunctionExpression() || parent.isFunctionExpression()) {
              break;
            }
            parent = parent.parentPath;
          }

          let currentPath = path;
          while (currentPath) {
            const block = currentPath.parentPath;
            if (block && block.isBlockStatement()) {
              const body = block.node.body;
              for (const statement of body) {
                if (statement.type === 'ReturnStatement' && statement.loc.start.line < path.node.loc.start.line) {
                   console.log(`EARLY RETURN HOOK: ${hookName} is after return in ${file}:${path.node.loc.start.line} (return at ${statement.loc.start.line})`);
                }
                if (statement.type === 'IfStatement' && statement.loc.start.line < path.node.loc.start.line) {
                  let hasReturn = false;
                  if (statement.consequent.type === 'ReturnStatement') hasReturn = true;
                  if (statement.consequent.type === 'BlockStatement' && statement.consequent.body.some(n => n.type === 'ReturnStatement')) hasReturn = true;
                  if (hasReturn) {
                    console.log(`EARLY RETURN HOOK: ${hookName} is after conditional return in ${file}:${path.node.loc.start.line} (if at ${statement.loc.start.line})`);
                  }
                }
              }
            }
            if (block && (block.isFunctionDeclaration() || block.isArrowFunctionExpression() || block.isFunctionExpression())) {
              break;
            }
            currentPath = block;
          }
        }
      }
    });
  } catch (e) {
    console.error(`Could not parse ${file}: ${e.message}`);
  }
});
