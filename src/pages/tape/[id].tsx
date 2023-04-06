import React from 'react';
import { useRouter } from 'next/router';

const Tape = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      <h1>Tape ID: {id}</h1>
      {/* Your component logic and UI elements go here */}
    </div>
  );
};

export default Tape;
