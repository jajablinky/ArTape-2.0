import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Tape } from '@/types/TapeInfo';
import styles from '@/styles/Home.module.css';
import { EmblaOptionsType } from 'embla-carousel';
import Autoplay from 'embla-carousel-autoplay';

interface ModuleAdditionalProps {
  tape: Tape;
  currentModuleIndex: number;
  isMediaPlaying: boolean;
  moduleIndex: number;
}

const ModuleAdditional: React.FC<ModuleAdditionalProps> = ({
  tape,
  currentModuleIndex,
  isMediaPlaying,
  moduleIndex,
}) => {
  const options: EmblaOptionsType = { loop: true };
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [isCarouselActive, setIsCarouselActive] = useState(false);

  const initializeCarousel = useCallback(() => {
    if (emblaApi) {
      if (isCarouselActive) {
        emblaApi.reInit(options, [Autoplay()]);
      } else {
        emblaApi.plugins().autoplay?.stop();
      }
    }
  }, [emblaApi, isCarouselActive]);

  const setCarouselState = () => {
    if (currentModuleIndex === moduleIndex && isMediaPlaying)
      setIsCarouselActive(true);
    else setIsCarouselActive(false);
  };

  useEffect(() => {
    initializeCarousel();
  }, [isCarouselActive, initializeCarousel]);

  useEffect(() => {
    setCarouselState();
  }, [currentModuleIndex, isMediaPlaying]);

  useEffect(() => {
    console.log('');
  }, [tape]);

  return (
    <div>
      <div className={styles.embla} ref={emblaRef}>
        <div className={styles.embla__container}>
          {tape &&
          tape.modules &&
          tape.modules[moduleIndex] &&
          tape.modules[moduleIndex].additionalItem &&
          tape.modules[moduleIndex].additionalItem.length > 0 ? (
            tape.modules[moduleIndex].additionalItem.map((image, index) => (
              <div className={styles.embla__slide} key={index}>
                <img
                  className={`${image.name} ${styles.objectFit} embla__slide__img`}
                  src={image.url || ''}
                  alt={image.alt || image.name}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            ))
          ) : (
            <div>No images found in the module.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModuleAdditional;
