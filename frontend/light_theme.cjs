const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

const modifications = [
  { search: /<Box w="2px" h="100px" bg="whiteAlpha\.200" my=\{2\} \/>/g, replace: '<Box w="2px" h="100px" bg="border-color" my={2} />' },
  { search: /bg="whiteAlpha\.100"/g, replace: 'bg="slate-bg"' },
  { search: /bg="whiteAlpha\.200"/g, replace: 'bg="slate-bg"' },
  { search: /bg="whiteAlpha\.50"/g, replace: 'bg="slate-bg"' },
  { search: /borderColor="whiteAlpha\.100"/g, replace: 'borderColor="border-color"' },
  { search: /borderColor="whiteAlpha\.200"/g, replace: 'borderColor="border-color"' },
  { search: /borderColor="whiteAlpha\.400"/g, replace: 'borderColor="border-color"' },
  { search: /borderColor="whiteAlpha\.500"/g, replace: 'borderColor="border-color"' },
  { search: /color="whiteAlpha\.300"/g, replace: 'color="text-muted"' },
  { search: /color="whiteAlpha\.500"/g, replace: 'color="text-muted"' },
  { search: /colorScheme="whiteAlpha"/g, replace: 'colorScheme="gray"' },
  { search: /_hover=\{\{ bg: "whiteAlpha\.50" \}\}/g, replace: '_hover={{ bg: "slate-bg" }}' },
  { search: /_hover=\{\{ bg: "whiteAlpha\.200", color: "white" \}\}/g, replace: '_hover={{ bg: "slate-bg", color: "text-primary" }}' },
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      
      for (const mod of modifications) {
        if (content.match(mod.search)) {
          content = content.replace(mod.search, mod.replace);
          modified = true;
        }
      }

      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

processDirectory(directoryPath);
console.log('Done mapping whiteAlpha variants.');
