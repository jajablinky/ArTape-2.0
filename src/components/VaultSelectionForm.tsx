import { VaultSelectionFormProps } from '@/types/VaultSelectionFormProps';
import Loader from './Loader';
import styles from '@/styles/Home.module.css';

const VaultSelectionForm = ({
  tapeInfoOptions,
  setSelectedTapeInfo,
  onSubmit,
  loading,
}: VaultSelectionFormProps) => {
  return (
    <form
      onSubmit={onSubmit}
      style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '32px',
        }}
      >
        {tapeInfoOptions.map((tapeInfo) => (
          <label
            key={tapeInfo.vaultId}
            className={styles.vaultSelection}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <input
              type="radio"
              name="vault"
              value={tapeInfo.vaultId}
              onChange={() => setSelectedTapeInfo(tapeInfo)}
              style={{ backgroundColor: tapeInfo.color }}
            />
            {tapeInfo.tapeName}
          </label>
        ))}
      </div>
      <button
        type="submit"
        style={{
          background: 'var(--artape-white)',
          border: '1px solid var(--artape-black)',
          fontSize: '12px',
          position: 'fixed',
          bottom: '20px',
          left: '0',
          right: '0',
          width: '500px',
          margin: 'auto',
        }}
      >
        {loading ? <Loader /> : 'Load Vault'}
      </button>
    </form>
  );
};

export default VaultSelectionForm;
