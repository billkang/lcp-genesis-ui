import { resolve } from 'path';
import { lstatSync, readdirSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { outputFile, copyFileSync } from 'fs-extra';
import { build, InlineConfig, defineConfig, UserConfig } from 'vite';
import { compile } from 'handlebars';
import { config } from '../vite.config';

/**
 * 生成代码
 * @param meta 数据定义
 * @param filePath 目标文件路径
 * @param templatePath 模板文件路径
 */
function generateCode(meta: unknown, filePath: string, templatePath: string) {
  if (existsSync(templatePath)) {
    const content: string = readFileSync(templatePath).toString();
    const result: string = compile(content)(meta);

    writeFileSync(filePath, result);
  }

  console.log(`🚀${filePath} 创建成功`);
}

/**
 * 获取组件列表
 * 通过解析entry.ts模块获取组件数据
 * @param input
 * @returns
 */
async function getComponents(entryPath: string) {
  const components = await import(`file://${entryPath}`);

  return Object.keys(components)
    .filter(k => k !== 'default')
    .map(k => ({
      name: components[k].name,
      component: k,
    }));
}

/**
 * 生成类型定义文件 d.ts
 * @param entryPath 组件入口
 */
export async function generateDTS(entryPath: string) {
  const templatePath: string = resolve(__dirname, './entry.d.ts.hbs');
  const dtsPath: string = resolve(__dirname, entryPath.replace('.esm.js', '.d.ts'));

  // 组件库数据
  const components = await getComponents(entryPath);

  // 生成模版
  generateCode(
    {
      components,
    },
    dtsPath,
    templatePath
  );
}

const buildAll = async () => {
  // 全量打包
  await build();

  const baseOutDir: string = config.build.outDir;
  const pkg = require('../package.json');

  pkg.main = 'index.umd.js';
  pkg.module = 'index.esm.js';
  pkg.types = 'index.d.ts';

  // create package.json
  outputFile(resolve(baseOutDir, 'package.json'), JSON.stringify(pkg, null, 2));

  // copy readme.md
  copyFileSync(resolve('./README.md'), resolve(baseOutDir, 'README.md'));

  // 创建dts文件
  generateDTS(resolve(config.build.outDir, 'index.esm.js'));

  const componentsDir = resolve(__dirname, '../src/components/');
  const componentList = readdirSync(componentsDir).filter(name => {
    const compDir = resolve(componentsDir, name);
    const isDir = lstatSync(compDir).isDirectory();
    return isDir && readdirSync(compDir).includes('index.ts');
  });

  for (let name of componentList) {
    const outDir = resolve(baseOutDir, name);
    const custom = {
      lib: {
        entry: resolve(componentsDir, name),
        name,
        fileName: 'index',
        formats: ['esm', 'umd'],
      },
      outDir,
    };

    Object.assign(config.build, custom);

    await build(defineConfig(config as UserConfig) as InlineConfig);

    outputFile(
      resolve(outDir, 'package.json'),
      `{
        "name": "genesis-ui/${name}",
        "main": "index.umd.js",
        "module": "index.esm.js"
      }`,
      'utf-8'
    );
  }
};

buildAll();
