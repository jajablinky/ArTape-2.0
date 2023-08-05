import { Akord, Auth } from '@akord/akord-js';

const AkordSignIn = async (
  email: string,
  password: string,
  setLoading: any
) => {
  try {
    const { wallet } = await Auth.signIn(email, password);
    const akord = await Akord.init(wallet);
    console.log('successful sign-in and verification');
    return akord;
  } catch (error) {
    console.error(error);
    new Error('could not sign-in, try again!');
    setLoading(false);
  }
};

export default AkordSignIn;
