import t from "tap";
import { readFile } from "node:fs";
import { yieldifiedEnv, yieldify } from "../yieldify.ts";

t.test("yieldify", (t) => {
  yieldifiedEnv(function* () {
    const readFileYieldified = yieldify(readFile);
    t.ok(
      typeof readFileYieldified === "function",
      "should create yieldified version of a function"
    );
    const file = yield readFileYieldified(import.meta.filename, "utf8");
    t.ok(/tap/.test(file), "should read file with yieldified function");
    t.end();
  });
});
