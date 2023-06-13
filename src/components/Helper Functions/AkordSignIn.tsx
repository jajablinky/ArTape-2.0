import { Akord, Auth } from '@akord/akord-js';

const AkordSignIn = async (email: string, password: string) => {
  const { wallet } = await Auth.signIn(email, password);
  const akord = await Akord.init(wallet);
  console.log('successful sign-in and verification');
  return akord;
};

export default AkordSignIn;
