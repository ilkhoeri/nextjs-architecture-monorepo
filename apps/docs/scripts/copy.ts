import fs from "fs";
import path from "node:path";

interface CopyProps {
  title: string;
  date: Date | string | number;
  fileSource: string;
  fileOutput: string;
}

interface CopySyncProps extends Omit<CopyProps, "fileOutput"> {
  fileOutput: string | string[];
}

function nameFile(fileSource: string) {
  const file = fileSource.split("/");
  return file[file.length - 1];
}

/**
 * expecting a folder structure like the following:
 * ```md
 * Repo
 * ├── main (Branch)
 * │ ├── CHANGELOG.md
 * │ ├── CODE_OF_CONDUCT.md
 * │ ├── CONTRIBUTING.md
 * │ ├── LICENSE
 * │ │
 * │ └── // others folder and files...
 * │
 * ├── docs (Branch)
 * │ ├── md
 * │ │ ├── file-1.mdx
 * │ │ ├── file-2.mdx
 * │ │ └── // others files...
 * │ │
 * │ └── // others folder and files...
 * │
 * └── // end...
 * ```
 * @param meta {@link CopyProps CopyProps}
 * @returns void
 */
function copy(meta: CopyProps) {
  const { title, date, fileSource, fileOutput } = meta;
  const sourcePath = path.resolve(__dirname, fileSource);
  const targetPath = path.resolve(__dirname, fileOutput);

  try {
    const outputDir = path.dirname(targetPath);
    fs.mkdirSync(outputDir, { recursive: true });

    if (!fs.existsSync(sourcePath)) {
      console.error("Source file not found:", sourcePath);
      return;
    }

    const sourceContent = fs.readFileSync(sourcePath, "utf-8");
    const yamlMetadata = `---\ntitle: ${title}\ndate: ${date}\n---`;
    const newContent = `${yamlMetadata}\n\n${sourceContent.trim()}`;

    fs.writeFileSync(targetPath, newContent, "utf-8");

    console.info(`\n✅ Synchronized ${title} from [${nameFile(fileSource)}] to [${nameFile(fileOutput)}] Successfully.\n`);
  } catch (error) {
    console.error("Error:", `\n${error}\n`);
  }
}

function copySync(meta: CopySyncProps) {
  const { fileOutput, ...rest } = meta;
  try {
    if (Array.isArray(fileOutput)) {
      for (const output of fileOutput) {
        copy({ fileOutput: output, ...rest });
      }
    } else {
      copy({ fileOutput, ...rest });
    }
  } catch (error) {
    console.error("Error:", `\n${error}\n`);
  }
}

const date = new Intl.DateTimeFormat("en-CA").format(new Date());

copySync({
  title: "CHANGELOG",
  date,
  fileSource: "../../../CHANGELOG.md",
  fileOutput: ["../md/en/guidelines/changelog.mdx", "../md/id/guidelines/changelog.mdx"]
});

copySync({
  title: "CONTRIBUTING",
  date,
  fileSource: "../../../CONTRIBUTING.md",
  fileOutput: ["../md/en/guidelines/contributing.mdx", "../md/id/guidelines/contributing.mdx"]
});
