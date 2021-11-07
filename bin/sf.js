const fs = require("fs");
const path = require("path");

const TemplatePath = path.resolve(__dirname, "../Templates");


if (process.argv.length < 3) {
  console.log("sf ComponentName");
  return;
}
const componentPath = process.argv[2].split("/");
const componentName = componentPath.pop();
const TargetPath = path.resolve(__dirname, "../src/components", ...componentPath);

const copyFile = async (src, dest) => {
  let text = await fs.promises.readFile(src, "utf8");
  fs.promises.writeFile(
    dest,
    text
      .replace(/{{{NAME}}}/g, componentName)
      .replace(/{{{PATH}}}/g, componentPath.length ? componentPath.join('/') + '/' : ''),
    "utf8"
  );
  console.log("output: %s", dest);
};

const getTemplates = () => {
  const files = fs.readdirSync(TemplatePath);
  return files
    .filter(
      (file) =>
        /\.template$/.test(file) &&
        !fs.statSync(path.resolve(TemplatePath, file)).isDirectory()
    )
    .map((file) => file.replace(/\.template$/, ""));
};

//ディレクトリ作成
const p = path.resolve(TargetPath, componentName).replace(/\\/g, '/').split("/")
p.reduce((a, b) => {
  const p = `${a}/${b}`;
  try { fs.statSync(p) } catch (e) { fs.mkdirSync(p) };
  return p
})

//テンプレートからファイルの作成
getTemplates().forEach((template) =>
  copyFile(
    path.resolve(TemplatePath, `${template}.template`),
    path.resolve(
      TargetPath,
      componentName,
      template.replace(/{{{NAME}}}/, componentName)
    )
  )
);
