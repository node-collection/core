import fs from 'node:fs';
import path from 'node:path';

const dtsPath = path.resolve('./dist/index.d.ts');
let content = fs.readFileSync(dtsPath, 'utf-8');

// Regex untuk extract semua declare module blocks
const moduleAugmentRegex = /declare module\s+['"][^'"]+['"]\s*\{([\s\S]*?)\n\}/g;

const augmentations: string[] = [];
let match: RegExpExecArray | null;

// 1. Kumpulkan semua isi augmentation
while ((match = moduleAugmentRegex.exec(content)) !== null) {
  augmentations.push(match[1]); // isi dalam { ... }
}

// 2. Hapus semua declare module blocks dari content
content = content.replace(moduleAugmentRegex, '');

// 3. Untuk setiap interface kosong, inject method dari augmentation
for (const augBody of augmentations) {
  // Parse tiap interface di dalam augmentation body
  const interfaceRegex = /interface\s+(\w+)<T>\s*\{([\s\S]*?)\}/g;
  let ifaceMatch: RegExpExecArray | null;

  while ((ifaceMatch = interfaceRegex.exec(augBody)) !== null) {
    const ifaceName = ifaceMatch[1];
    const ifaceBody = ifaceMatch[2];

    // Inject ke interface kosong yang sudah ada di top-level
    content = content.replace(new RegExp(`(interface ${ifaceName}<T>\\s*\\{)(\\s*\\})`), `$1${ifaceBody}}`);
  }
}

// 4. Cleanup whitespace berlebih
content = content.replace(/\n{3,}/g, '\n\n').trim() + '\n';

fs.writeFileSync(dtsPath, content);
console.log('✅ Declaration types merged successfully');
