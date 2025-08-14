const fs = require('fs');
const path = require('path');

// SVG目录和输出目录
const svgDir = 'src/asset/svg';
const outputDir = 'src/component/Icons';

// 已经处理过的文件
const processedFiles = [];

// 将文件名转换为驼峰命名
function toCamelCase(str) {
  return str
    .replace(/\.svg$/, '')
    .split('-')
    .map((word, index) => {
      if (index === 0) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join('');
}

// 从SVG内容中提取path数据
function extractPathFromSvg(svgContent) {
  const pathMatch = svgContent.match(/<path d="([^"]+)"/);
  return pathMatch ? pathMatch[1] : '';
}

// 生成tsx文件内容
function generateTsxContent(componentName, pathData, displayName) {
  return `import { SvgIcon, SvgIconProps } from "@mui/material";
import * as React from "react";

export const ${componentName} = (props: SvgIconProps) => {
  return (
    <SvgIcon
      viewBox='0 0 24 24'
      version='1.1'
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="${pathData}"></path>
    </SvgIcon>
  );
};
${componentName}.displayName = '${displayName}';
`;
}

// 读取SVG目录中的所有文件
const svgFiles = fs.readdirSync(svgDir).filter(file =>
  file.endsWith('.svg') && !processedFiles.includes(file)
);

console.log(`准备处理 ${svgFiles.length} 个SVG文件...`);

// 处理每个SVG文件
svgFiles.forEach(file => {
  const svgPath = path.join(svgDir, file);
  const svgContent = fs.readFileSync(svgPath, 'utf8');

  // 提取path数据
  const pathData = extractPathFromSvg(svgContent);

  if (!pathData) {
    console.log(`警告: 无法从 ${file} 中提取path数据`);
    return;
  }

  // 生成组件名和文件名
  const componentName = toCamelCase(file) + 'Icon';
  const displayName = 'icon-' + file.replace('.svg', '');
  const outputFileName = file.replace('.svg', '-icon.tsx');
  const outputPath = path.join(outputDir, outputFileName);

  // 生成tsx内容
  const tsxContent = generateTsxContent(componentName, pathData, displayName);

  // 写入文件
  fs.writeFileSync(outputPath, tsxContent);
  console.log(`✓ 已创建: ${outputFileName}`);
});

console.log(`完成! 总共处理了 ${svgFiles.length} 个文件`);