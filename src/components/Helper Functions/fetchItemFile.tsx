import { Akord, Stack } from '@akord/akord-js';
import getMimeType from './getMimeType';
import arrayBufferToFile from './arrayBufferToFile';

const fetchItemFile = async (
  vaultId: string,
  parentId: string,
  akord: Akord
): Promise<
  Array<{
    file: File | null;
    fileName: string;
    url: string | null;
    arrayBuffer: ArrayBuffer | null;
  }>
> => {
  try {
    const items = await akord.stack.listAll(vaultId, { parentId });

    return Promise.all(
      items.map(async (item) => {
        const itemName = item.name;
        const versionData = await akord.stack.getVersion(item.id);

        if (!versionData.data) {
          console.error('Version data is missing or invalid');
          return { file: null, fileName: itemName, url: '', arrayBuffer: null };
        }

        const mimeType = getMimeType(itemName);
        if (mimeType !== 'application/json') {
          const result = arrayBufferToFile(
            versionData.data,
            itemName,
            mimeType
          );
          if (!result) {
            console.error('Failed to convert ArrayBuffer to File');
            return {
              arrayBuffer: null,
              fileName: itemName,
              file: null,
              url: null,
            };
          }
          return {
            file: result.file,
            fileName: itemName,
            url: result.url,
            arrayBuffer: null,
          };
        }

        if (mimeType === 'application/json') {
          return {
            arrayBuffer: versionData.data,
            fileName: itemName,
            file: null,
            url: null,
          };
        }

        console.error('Unhandled file type:', mimeType);
        return { file: null, fileName: itemName, url: '', arrayBuffer: null };
      })
    );
  } catch (error) {
    console.error('Could not fetch item details:', error);
    // Return an empty array or handle the error as appropriate
    return [];
  }
};

export default fetchItemFile;
