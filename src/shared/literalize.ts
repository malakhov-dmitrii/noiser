const literalize = (str: string = ''): string =>
  str
    .split(' ')
    .filter((x: string) => x)
    .map((i: string) => i[0])
    .join('')
    .toUpperCase();

export default literalize;
