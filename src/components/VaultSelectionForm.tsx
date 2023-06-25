import { VaultSelectionFormProps } from '@/types/VaultSelectionFormProps';
import Loader from './Loader';

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
            />
            {tapeInfo.tapeName}
          </label>
        ))}
      </div>
      <button
        type="submit"
        style={{
          background: 'transparent',
          border: '1px solid var(--artape-black)',
          fontSize: '12px',
        }}
      >
        {loading ? <Loader /> : 'Load Vault'}
      </button>
    </form>
  );
};

export default VaultSelectionForm;
