import { TapeWithFiles } from '@/types/TapeInfo';

const createNewTape = (i: number): TapeWithFiles => {
  const newTape: TapeWithFiles = {
    audioFiles: Array(i).fill({
      audioFile: null,
      duration: 0,
      audioUrl: '',
      name: '',
      artistName: '',
      trackNumber: 0,
      albumPicture: '',
      albumPictureFile: null,
      albumPictureUrl: '',
    }),
    imageFiles: [],
    profilePicture: { name: '', url: '' },
    tapeInfoJSON: null,
    tapeArtistName: '',
    tapeDescription: '',
    type: '',
    color: '',
    memento: '',
  };

  return newTape;
};

export default createNewTape;
