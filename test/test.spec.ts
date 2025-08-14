import t from "tap";
import { readFile, readdir } from "node:fs";
import { yieldifiedEnv, yieldify } from "../yieldify.ts";

const testFileOnePath = import.meta
  .resolve("./fixtures/test-file-one.txt")
  .replace("file://", "");
const testFileTwoPath = import.meta
  .resolve("./fixtures/test-file-two.txt")
  .replace("file://", "");

t.test("should allow to yield 'node:fs'.readFile", (t) => {
  yieldifiedEnv(function* () {
    const readFileYieldified = yieldify(readFile);
    t.ok(
      typeof readFileYieldified === "function",
      "should create yieldified version of a function"
    );
    const file = yield readFileYieldified(testFileOnePath, "utf8");
    t.ok(/test-file-one/.test(file), `wrong file content: "${file}"`);
    t.end();
  });
});

t.test("should allow multiple 'yieldifiedEnv's at the same time", (t) => {
  let endCalls = 0;
  const end = () => {
    if (++endCalls === 2) t.end();
  };
  yieldifiedEnv(function* () {
    const readFileYieldified = yieldify(readFile);
    const file = yield readFileYieldified(testFileOnePath, "utf8");
    t.ok(/test-file-one/.test(file), `wrong file content: "${file}"`);
    end();
  });
  yieldifiedEnv(function* () {
    const readFileYieldified = yieldify(readFile);
    const file = yield readFileYieldified(testFileTwoPath, "utf8");
    t.ok(/test-file-two/.test(file), `wrong file content: "${file}"`);
    end();
  });
});
