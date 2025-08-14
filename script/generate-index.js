const fs = require('fs');
const path = require('path');

const iconsDir = 'src/component/Icons';

// 获取所有tsx文件（除了index.ts）
const tsxFiles = fs.readdirSync(iconsDir)
  .filter(file => file.endsWith('.tsx'))
  .sort();

console.log(`发现 ${tsxFiles.length} 个图标文件`);

// 将文件名转换为组件名
function getComponentName(fileName) {
  const baseName = fileName.replace('.tsx', '');
  return baseName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

// 生成index.ts内容
let indexContent = '// 此文件由脚本自动生成\n';
indexContent += '// 导出所有图标组件\n\n';

// 添加导出语句
tsxFiles.forEach(file => {
  const componentName = getComponentName(file);
  const filePath = `./${file.replace('.tsx', '')}`;
  indexContent += `export { ${componentName} } from '${filePath}';\n`;
});

// 写入index.ts文件
const indexPath = path.join(iconsDir, 'index.ts');
fs.writeFileSync(indexPath, indexContent);

console.log(`✓ 已生成 index.ts，导出了 ${tsxFiles.length} 个图标组件`);
console.log('导出的组件包括:');
tsxFiles.forEach(file => {
  console.log(`  - ${getComponentName(file)}`);
}); 