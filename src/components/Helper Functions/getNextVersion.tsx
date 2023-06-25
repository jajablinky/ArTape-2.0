const getNextVersion = (highest: string) => {
  const [major, minor, lowest] = highest.split('.').map(Number);

  let nextMajor = major;
  let nextMinor = minor;
  let nextLowest = lowest + 1;

  if (nextLowest === 10) {
    nextLowest = 0;
    nextMinor += 1;
    if (nextMinor === 10) {
      nextMinor = 0;
      nextMajor += 1;
    }
  }

  return `${nextMajor}.${nextMinor}.${nextLowest}`;
};

export default getNextVersion;
