export const handleSetModuleAndLastSelected = async (
  moduleIndex: number,
  setLastSelectedMedia: React.Dispatch<React.SetStateAction<number>>,
  currentModuleIndex: number,
  setCurrentModuleIndex: React.Dispatch<React.SetStateAction<number>>
) => {
  const setLastSelectedMediaPromise = new Promise((resolve) => {
    setLastSelectedMedia(() => {
      resolve(currentModuleIndex);
      return currentModuleIndex;
    });
  });

  await setLastSelectedMediaPromise;

  setCurrentModuleIndex(moduleIndex);
};
