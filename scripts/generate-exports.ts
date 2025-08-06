import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(fileURLToPath(import.meta.url), '../../');

const generateExports = async packages => {
  for (const pkgPath of packages) {
    const srcDir = path.resolve(ROOT, pkgPath, 'src');
    const exportFile = path.resolve(srcDir, 'index.ts');

    try {
      const files = await fs.readdir(srcDir);

      const exportLines = files
        .filter(file => file.endsWith('.ts') || file.endsWith('.tsx'))
        .filter(file => file !== 'index.ts' && !file.startsWith('_') && !file.endsWith('.d.ts'))
        .map(file => {
          const ext = path.extname(file);
          const name = file.slice(0, -ext.length);
          return `export * from './${name}';`;
        });

      await fs.writeFile(exportFile, exportLines.join('\n') + '\n');

      console.log(`✅ Generated exports for ${pkgPath}/src`);
    } catch (err) {
      console.error(`❌ Failed to generate exports for ${pkgPath}/src:`, err.message);
    }
  }
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateExports([
    './packages/hooks',
    './packages/icons',
    './packages/store',
    './packages/ui',
    './packages/utils',
    //
    './shared/shells',
    './shared/visualizations'
  ]);
}
