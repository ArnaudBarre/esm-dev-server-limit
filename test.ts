import { spawn } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { launch } from "puppeteer";
import { ChildProcess } from "child_process";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const runTest = async (
  name: string,
  getProcess: () => ChildProcess,
  port: number,
) => {
  const runs: number[] = [];
  for (let i = 0; i < 5; i++) {
    const process = getProcess();
    const page = await browser.newPage();
    await wait(500);
    const start = performance.now();
    await page.goto(`http://localhost:${port}`);
    await page.waitForSelector("#app", { timeout: 10_000 });
    runs.push(Math.round(performance.now() - start));
    await page.close();
    process.kill();
    await wait(500);
  }
  console.log(
    `${name}: ${runs.slice().sort((a, z) => a - z)[2]}ms (runs: [${runs}])`,
  );
};

const initialHTML = readFileSync("index.html", "utf-8");
const runViteTest = async (name: string, htmlImport: string) => {
  writeFileSync("index.html", initialHTML.replace("/esm/1.js", htmlImport));
  await runTest(`Vite ${name}`, () => spawn("vite"), 5173);
};

const browser = await launch();

await runTest("Bun limit", () => spawn("bun", ["bun-limit.ts"]), 3000);
await runTest("Node limit", () => spawn("node", ["node-limit.js"]), 4000);
await runViteTest("ESM", "/esm/1.js");
await runViteTest("JS", "/js/1.js");
await runViteTest("TS", "/ts/1.ts");

await browser.close();
writeFileSync("index.html", initialHTML);
console.log("Finished, you can kill the process");
