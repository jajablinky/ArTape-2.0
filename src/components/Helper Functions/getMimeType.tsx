interface MimeTypes {
  [key: string]: string;
}

const mimeTypes: MimeTypes = {
  json: 'application/json',
  mp4: 'video/mp4',
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  // ... other mime types
};

function getMimeType(fileName: string): string {
  if (!fileName) {
    console.error('File name did not exist to get mime type');
    return '';
  }

  const extension = fileName.split('.').pop()?.toLowerCase();
  if (extension) {
    return mimeTypes[extension] || '';
  } else {
    console.error('Extension did not exist');
    return '';
  }
}

export default getMimeType;
