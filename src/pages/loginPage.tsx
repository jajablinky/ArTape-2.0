import React, { useState } from 'react';
import { Akord } from '@akord/akord-js';

const loginPage = () => {
  const [akord, setAkord] = useState<Akord | null>();
  const [email, setEmail] = useState<string>('');
  const [pass, setPass] = useState<string>('');
  const [vaultId, setVaultId] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(
    null
  );
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const renderLoadingMessage = () => {
    if (isLoading) {
      return (
        <div className="loading" role="alert">
          <p>Loading</p>
        </div>
      );
    }
    return null;
  };

  const renderSuccessMessage = () => {
    if (isSuccess) {
      return (
        <div className="success" role="alert">
          <p>Success!</p>
        </div>
      );
    }
    return null;
  };

  const renderErrorMessage = () => {
    if (errorMessage) {
      return (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      );
    }
    return null;
  };

  const loginForm = () => {
    return (
      <div style={{ width: '340px' }}>
        <form onSubmit={handleLogin}>
          <div className="email-div">
            <input
              type="text"
              value={email}
              placeholder="email@email.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="password-div">
            <input
              type="password"
              placeholder="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>
          <p>or</p>
          <div className="vaultId-div">
            <input
              type="text"
              placeholder="vault id"
              value={vaultId}
              onChange={(e) => setVaultId(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>
        {renderLoadingMessage()}
        {renderSuccessMessage()}
        {renderErrorMessage()}
      </div>
    );
  };

  const handleLogin = async (event: any) => {
    try {
      setIsLoading(true);
      event.preventDefault();
      if (!email) {
        throw new Error('Missing email');
      }
      if (!pass) {
        throw new Error('Missing pass');
      }
      const { jwtToken, wallet } = await Akord.auth.signIn(
        email,
        pass
      );
      const akord = await Akord.init(wallet, jwtToken);
      setAkord(akord);
      setIsLoading(false);
      setIsSuccess(true);
    } catch (e) {
      setIsLoading(false);
      setErrorMessage(e.message);
    }
  };
  return <div>loginPage</div>;
};

export default loginPage;
