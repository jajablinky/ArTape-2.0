export const extractColorFromTags = (tags: string[] | undefined) => {
  if (tags) {
    const colorTag = tags.find((tag) => tag.startsWith('color-'));
    if (colorTag) {
      return colorTag.split('-')[1];
    }
  }
  return null;
};
