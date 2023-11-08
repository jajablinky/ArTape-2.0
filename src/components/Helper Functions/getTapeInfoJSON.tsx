import { TapeInfoJSON } from '@/types/TapeInfo';

async function getTapeInfoJSON(
  item: any,
  akord: any
): Promise<TapeInfoJSON | null> {
  if (item.name !== 'tapeInfo.json') return null;
  const { data: decryptedTapeInfo } = await akord.stack.getVersion(item.id);

  const tapeInfoString = new TextDecoder().decode(decryptedTapeInfo);
  const tapeInfoJSON = JSON.parse(tapeInfoString) as TapeInfoJSON;
  console.log(tapeInfoJSON);

  return tapeInfoJSON;
}

export default getTapeInfoJSON;
