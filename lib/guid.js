/**
 * Guid function to generate uid
 * @return {Function}
 */
const guid = (() => {
  let counter = 0;

  return (prefix) => {
    let guid = new Date().getTime().toString(32);

    for (let index = 0; index < 5; index++) {
      guid += Math.floor(Math.random() * 65535).toString(32);
    }

    return (prefix || 'o_') + guid + (counter++).toString(32);
  };
})();

export { guid };