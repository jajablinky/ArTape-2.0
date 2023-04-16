import CassetteLogo from '../../public/Artape-Cassete-Logo.gif';
import Image from 'next/image';

const Loader = () => {
  return (
    <Image
      src={CassetteLogo}
      width={15}
      alt="artape-logo"
      style={{ filter: 'invert(1)' }}
    />
  );
};

export default Loader;
