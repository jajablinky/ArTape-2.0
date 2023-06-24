import { FieldErrors, UseFormRegister } from 'react-hook-form';
import Loader from './Loader';
import { VaultValues } from '@/types/VaultValues';

type EmailPasswordFormProps = {
  onSubmit: (event: React.FormEvent) => void;
  loading: boolean;
  errors: FieldErrors<VaultValues>;
  register: UseFormRegister<VaultValues>;
};

const EmailPasswordForm = ({
  onSubmit,
  loading,
  errors,
  register,
}: EmailPasswordFormProps) => {
  return (
    <form
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '300px',
      }}
      onSubmit={onSubmit}
    >
      <input
        {...register('email', { required: true })}
        type="email"
        placeholder="Email"
        style={{
          background: 'transparent',
          border: 'none',
          borderBottom: '1px solid var(--artape-black)',
          textAlign: 'right',
        }}
      />
      {errors.email && <div>Email is required</div>}
      <input
        {...register('password', { required: true })}
        type="password"
        placeholder="Password"
        style={{
          background: 'transparent',
          border: 'none',
          borderBottom: '1px solid var(--artape-black)',
          textAlign: 'right',
        }}
      />
      {errors.password && <div>Password is required</div>}
      <button
        type="submit"
        style={{
          backgroundColor: 'var(--artape-black)',
          color: 'var(--artape-white)',
          fontSize: '12px',
        }}
      >
        {loading ? <Loader /> : <span>Go</span>}
      </button>
    </form>
  );
};

export default EmailPasswordForm;
