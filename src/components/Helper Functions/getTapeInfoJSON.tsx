import { TapeInfoJSON } from '@/types/TapeInfo';

const getTapeInfoJSON = (
  tapeInfoFile: ArrayBuffer | null
): TapeInfoJSON | null => {
  if (!tapeInfoFile) {
    console.error('No tapeInfoFile provided');
    return null;
  }

  try {
    const tapeInfoString = new TextDecoder().decode(tapeInfoFile);
    const tapeInfoJSON = JSON.parse(tapeInfoString) as TapeInfoJSON;
    return tapeInfoJSON;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return null;
  }
};

export default getTapeInfoJSON;
