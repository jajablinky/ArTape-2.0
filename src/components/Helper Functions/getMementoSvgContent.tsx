import React from 'react';
import { getPineappleSvgContent } from '@/components/Images/Mementos/PineappleMemento';
import { getLoudSvgContent } from '@/components/Images/Mementos/LoudMemento';
import { getMinimalSvgContent } from '@/components/Images/Mementos/MinimalMemento';
import { getCassetteSvgContent } from '@/components/Images/Mementos/CassetteMemento';

const getMementoSvgContent = (memento: string, color: string): Blob | null => {
  let svgContent: string | null = null;
  switch (memento) {
    case 'Pineapple':
      svgContent = getPineappleSvgContent(color);
      break;
    case 'Loud':
      svgContent = getLoudSvgContent(color);
      break;
    case 'Minimal':
      svgContent = getMinimalSvgContent(color);
      break;
    case 'Tape':
      svgContent = getCassetteSvgContent(color);
      break;
    default:
      return null;
  }

  if (svgContent) {
    return new Blob([svgContent], { type: 'text/html' });
  } else {
    return null;
  }
};

export default getMementoSvgContent;
