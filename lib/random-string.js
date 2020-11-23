/**
 * Random string generator
 * @return {String}
 */
const randomString = () => {
  const pattern = '0123456789abcdefghiklmnopqrstuvwxyz';
  const salt = 16;

  let returnable = '';

  for (let index = 0; salt > index; index++) {
    const charIdx = Math.floor(Math.random() * pattern.length);

    returnable += pattern.substring(charIdx, charIdx + 1);
  }

  return returnable;
}

export { randomString };
