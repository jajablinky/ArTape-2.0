import { useRouter } from 'next/router';
import { useTape } from '@/components/TapeContext';

const Tape = () => {
  const router = useRouter();
  const { id } = router.query;
  const { tape } = useTape();

  if (!tape) {
    // Handle the case when there is no tape data available
    return <div>No tape data available</div>;
  }

  const { audioUrls, tapeInfoJSON, imageUrls } = tape;
  return (
    <>
      <div>
        {audioUrls ? (
          <>
            <h1>Audio URLs:</h1>
            <ul>
              {audioUrls.map((url, index) => (
                <li key={index}>{url}</li>
              ))}
            </ul>{' '}
          </>
        ) : null}
        {imageUrls ? (
          <>
            <h1>Image URLs:</h1>
            <ul>
              {imageUrls.map((url, index) => (
                <li key={index}>{url}</li>
              ))}
            </ul>{' '}
          </>
        ) : null}
        {tapeInfoJSON ? (
          <>
            <h1>Tape Info Metadata:</h1>
            <p>{JSON.stringify(tapeInfoJSON, null, 2)}</p>
          </>
        ) : null}
      </div>
    </>
  );
};

export default Tape;
