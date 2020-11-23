const asynchronously = (Generator) => {
  const generator = Generator();

  (function go(err, result) {
    let step;

    if (err) {
      step = generator.throw(err);
    } else {
      step = generator.next(result);
    }

    if (!step.done) {
      const promise = step.value;

      promise
        .then((resolvedValue) => {
          go(null, resolvedValue);
        })
        .catch((error) => {
          go(error);
        });
    }
  })();
}

export { asynchronously };
