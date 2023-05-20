import CassetteLogo from '../../public/Artape-Cassete-Logo.gif';
import Image from 'next/image';
import styles from '@/styles/loader.module.css';

const Loader = ({ invert = false, size = 'sm' }) => {
  let width;

  switch (size) {
    case 'md':
      width = 30;
      break;
    case 'large':
      width = 60;
      break;
    default:
      width = 15;
  }

  return <Image src={CassetteLogo} width={width} alt="artape-logo" className={invert ? styles.inverted : styles.normal} />;
};

export default Loader;
