export async function blobUrlToFile(url: string, filename: string) {
  const response = await fetch(url);
  const blob = await response.blob();
  const file = new File([blob], filename, { type: blob.type });
  return file;
}
