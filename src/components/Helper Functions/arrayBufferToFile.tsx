const arrayBufferToFile = (
  arrayBuffer: ArrayBuffer,
  fileName: string,
  mimeType: string
): { file: File; url: string } | null => {
  if (!arrayBuffer || arrayBuffer.byteLength === 0) {
    console.error('Invalid or empty ArrayBuffer provided');
    return null;
  }

  const blob = new Blob([arrayBuffer], { type: mimeType });

  const file = new File([blob], fileName, { type: mimeType });

  const url = URL.createObjectURL(blob);

  return { file, url };
};

export default arrayBufferToFile;
