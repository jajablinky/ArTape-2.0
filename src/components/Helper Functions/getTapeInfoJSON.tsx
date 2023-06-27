import { TapeInfoJSON } from '@/types/TapeInfo';

async function getTapeInfoJSON(
  item: any,
  akord: any
): Promise<TapeInfoJSON | null> {
  if (item.name !== 'tapeInfo.json') return null;
  const tapeInfoId = item.id;
  const { data: decryptedTapeInfo } = await akord.stack.getVersion(tapeInfoId);

  const tapeInfoString = new TextDecoder().decode(decryptedTapeInfo);
  const tapeInfoJSON = JSON.parse(tapeInfoString) as TapeInfoJSON;

  return tapeInfoJSON;
}

export default getTapeInfoJSON;
