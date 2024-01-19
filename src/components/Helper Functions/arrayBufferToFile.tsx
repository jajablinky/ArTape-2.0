const arrayBufferToFile = (
  arrayBuffer: ArrayBuffer,
  fileName: string,
  mimeType: string
): { file: File; url: string } | null => {
  if (!arrayBuffer || arrayBuffer.byteLength === 0) {
    console.error('Invalid or empty ArrayBuffer provided');
    return null; // or you could throw an error
  }

  // Create a blob from the array buffer
  const blob = new Blob([arrayBuffer], { type: mimeType });

  // Create a file from the blob
  const file = new File([blob], fileName, { type: mimeType });

  // Create a URL for the blob
  const url = URL.createObjectURL(blob);

  return { file, url };
};

export default arrayBufferToFile;
