let generator: Iterator<unknown>;
export function yieldifiedEnv(topLevelGenerator: () => Generator) {
  generator = topLevelGenerator();
  generator.next();
}
export function yieldify(fn) {
  return (...args) => {
    fn(...args, (err, res) => {
      if (err) generator.throw(err);
      generator.next(res);
    });
  };
}
