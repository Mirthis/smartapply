// @ts-nocheck
import { writeFileSync } from "fs";
import { globby } from "globby";

const createExport = (file, folder) => {
  const relativePath = file
    .replace(folder, "")
    .replace(".tsx", "")
    .replace(".ts", "");
  // console.log({ relativePath });
  const name = relativePath.split("/").pop();
  return `export { default as ${name} } from ".${relativePath}";`;
};

const getFolders = async () => {
  // const folders = [];
  const folders = await globby(["src/components/"], { onlyDirectories: true });
  folders.push("src/components");
  return folders;
};

const generateFolderExports = async (folder) => {
  // console.log(folder);
  const files = await globby([`${folder}/*{.ts,.tsx}`, `!${folder}/index.ts`]);
  // console.log({ files });
  const expt = files.map((file) => createExport(file, folder));
  // console.log({ expt });
  const fileName = `${folder}/index.ts`;
  console.log(`Writing ${expt.length} exports to ${fileName}`);
  writeFileSync(fileName, expt.join("\n"));
};

const generateAllExports = async () => {
  const folders = await getFolders();
  // console.log({ folders });
  for (let i = 0; i < folders.length; i++) {
    const folder = folders[i];
    await generateFolderExports(folder);
  }
};

generateAllExports();
// generateIndexExports();
