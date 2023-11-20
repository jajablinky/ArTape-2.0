import {
	VideoFileWithFiles,
	VideoFileWithUrls,
	Tape,
	TapeWithVideoFiles,
} from '@/types/TapeInfo';
import { blobUrlToFile } from './blobUrltoFile';

export async function setVideoFilesWithFiles(
	tape: Tape
): Promise<TapeWithVideoFiles> {
	const videoFiles: VideoFileWithFiles[] = await Promise.all(
		tape.videoFiles.map(async (file: VideoFileWithUrls) => {
			const videoFile = await blobUrlToFile(
				file.videoUrl as string,
				file.fileName
			);

			return { ...file, videoFile };
		})
	);

	return { ...tape, videoFiles }
}