import React from 'react';
import { useRouter } from 'next/router';
import AudioPlayer from '@/components/AudioPlayer';
import { useTape } from '@/components/TapeContext';

const Tape = () => {
  const router = useRouter();
  const { id } = router.query;
  const { tape } = useTape();

  if (!tape) {
    // Handle the case when there is no tape data available
    return <div>No tape data available</div>;
  }

  const { audioUrls, tapeInfoJSON } = tape;
  return (
    <>
      <div>
        <h1>Audio URLs:</h1>
        <ul>
          {audioUrls.map((url, index) => (
            <li key={index}>{url}</li>
          ))}
        </ul>
        <p>tapeInfoJSON: {JSON.stringify(tapeInfoJSON, null, 2)}</p>
      </div>
    </>
  );
};

export default Tape;
