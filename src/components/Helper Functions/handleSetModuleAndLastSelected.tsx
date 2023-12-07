export const handleSetModuleAndLastSelected = async (
  moduleIndex: number,
  setLastSelectedMedia: React.Dispatch<React.SetStateAction<number>>,
  currentModuleIndex: number,
  setCurrentModuleIndex: React.Dispatch<React.SetStateAction<number>>
) => {
  const setLastSelectedMediaPromise = new Promise((resolve) => {
    // Update last selected media and pass the new value to resolve
    setLastSelectedMedia(() => {
      resolve(currentModuleIndex);
      return currentModuleIndex;
    });
  });

  // Wait for setLastSelectedMediaPromise to resolve before moving on
  await setLastSelectedMediaPromise;

  // Now you can update currentModuleIndex
  setCurrentModuleIndex(moduleIndex);
};
