import t from "tap";
import { readFile } from "node:fs";
import fsPromise from "node:fs/promises";
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

t.test(
  "should throw error when 'yeildify' is called without 'yieldifiedEnv'",
  (t) => {
    process.once("uncaughtException", (err) => {
      if (err instanceof Error) {
        t.match(
          err.message,
          /`yieldify` must be used in context of generator function that is passed to `yieldifiedEnv`./,
          "should have appropriate error message."
        );
      } else {
        t.fail("should throw error that is instanceof 'Error'.");
      }
      t.end();
    });
    const readFileYieldified = yieldify(readFile);
    readFileYieldified(testFileOnePath, "utf8");
  }
);

t.test("should pass errors from callback", (t) => {
  yieldifiedEnv(function* () {
    const readFileYieldified = yieldify(readFile);
    try {
      yield readFileYieldified(
        "/some/non/existing/file.txt",
        "utf8"
      );
    } catch (err) {
      if (err instanceof Error) {
        t.match(
          err.message,
          /no such file or directory/,
          "should have appropriate error message."
        );
      } else {
        t.fail("should throw error that is instanceof 'Error'.");
      }
    }
    t.end();
  });
});

t.test("should work with Promise resolve", (t) => {
  yieldifiedEnv(function* () {
    const file = yield fsPromise.readFile(testFileOnePath, "utf8");
    t.ok(/test-file-one/.test(file), `wrong file content: "${file}"`);
    t.end();
  });
});

t.test("should work with Promise reject", (t) => {
  yieldifiedEnv(function* () {
    try {
      yield fsPromise.readFile("/some/non/existing/file.txt", "utf8");
    } catch (err) {
    if (err instanceof Error) {
        t.match(
          err.message,
          /no such file or directory/,
          "should have appropriate error message."
        );
      } else {
        t.fail("should throw error that is instanceof 'Error'.");
      }
    }
    t.end();
  });
});
