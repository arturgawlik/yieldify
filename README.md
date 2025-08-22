## What it is

Two little functions that are emmiting node's https://nodejs.org/api/util.html#utilpromisifyoriginal util function, but for `yield`ing.

## How to use it

### Install

`npm i yieldify-yield`

### Run

```javascript
import { yieldifiedEnv, yieldify } from "yieldify-yield";
import { readFile } from "node:fs";
import fsPromise from "node:fs/promises";

yieldifiedEnv(function* () {
  const readFileYieldified = yieldify(readFile);
  const fileFromCb = yield readFileYieldified(import.meta.filename, "utf8");
  console.log(fileFromCb);
  const fileFromPromise = yield fsPromise.readFile(import.meta.filename, "utf8");
  console.log(fileFromPromise);
});
```
