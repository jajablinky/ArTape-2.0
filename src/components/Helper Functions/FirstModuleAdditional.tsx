import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Tape } from '@/types/TapeInfo';
import styles from '@/styles/Home.module.css';
import { EmblaOptionsType } from 'embla-carousel';
import Autoplay from 'embla-carousel-autoplay';

interface FirstModuleAdditionalProps {
  tape: Tape;
  currentModuleIndex: number;
  isMediaPlaying: boolean;
}

const FirstModuleAdditional: React.FC<FirstModuleAdditionalProps> = ({
  tape,
  currentModuleIndex,
  isMediaPlaying,
}) => {
  const options: EmblaOptionsType = { loop: true };
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [isCarouselActive, setIsCarouselActive] = useState(false);

  const initializeCarousel = useCallback(() => {
    if (emblaApi) {
      if (isCarouselActive) {
        emblaApi.reInit(options, [Autoplay()]);
      } else {
        emblaApi.reInit(options);
      }
    }
  }, [emblaApi, isCarouselActive]);

  const setCarouselState = () => {
    if (currentModuleIndex === 0 && isMediaPlaying) setIsCarouselActive(true);
    else setIsCarouselActive(false);
    console.log('carousel state:', isCarouselActive);
  };

  useEffect(() => {
    initializeCarousel();
  }, [isCarouselActive, initializeCarousel]);

  useEffect(() => {
    setCarouselState();
  }, [currentModuleIndex, isMediaPlaying]);

  return (
    <div>
      <div className={styles.embla} ref={emblaRef}>
        <div className={styles.embla__container}>
          {tape &&
          tape.modules &&
          tape.modules[0] &&
          tape.modules[0].additionalItem &&
          tape.modules[0].additionalItem.length > 0 ? (
            tape.modules[0].additionalItem.map((image, index) => (
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
            <div>No images found in the first module.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FirstModuleAdditional;
