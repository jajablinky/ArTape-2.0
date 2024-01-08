import { Tape } from '@/types/TapeInfo';
import Image from 'next/image';
import styles from '@/styles/Home.module.css';

const renderFirstModuleAdditional = (tape: Tape) => {
  // Assuming 'tape' is your tape context and it's structured correctly
  // and the first module's images are in the 'additionalItem' array
  const firstModule = tape.modules[0];
  const firstImage = firstModule?.additionalItem[0]; // Get the first image of the first module

  if (firstImage) {
    return (
      <Image
        className={`${firstImage.name} ${styles.objectFit}`}
        src={firstImage.url || ''}
        alt={firstImage.alt || firstImage.name}
        fill={true}
      />
    );
  } else {
    // Handle the case when there is no image in the first module
    return <div>No image found in the first module</div>;
  }
};

export default renderFirstModuleAdditional;
