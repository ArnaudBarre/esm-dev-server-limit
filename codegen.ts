import { writeFileSync, mkdirSync, rmSync } from "fs";

rmSync("src", { recursive: true, force: true });
mkdirSync("./src");

const generate = (dir: string, ext: string, nextImp: (i: number) => string) => {
  mkdirSync(`./src/${dir}`);
  for (let i = 1; i < 1_000; i++) {
    writeFileSync(`src/${dir}/${i}.${ext}`, `import "${nextImp(i + 1)}"`);
  }
  writeFileSync(
    `src/${dir}/1000.${ext}`,
    `
const app = document.createElement("div");
app.id = "app";
app.textContent = "Hello world";
document.body.appendChild(app);
`,
  );
};

generate("esm", "js", (i) => `/src/esm/${i}.js`);
generate("js", "js", (i) => `./${i}`);
generate("ts", "ts", (i) => `./${i}`);
