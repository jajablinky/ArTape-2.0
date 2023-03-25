import { Akord } from '@akord/akord-js';

const email = process.env.EMAIL;
const password = process.env.PASSWORD;

export default async function handler(req, res) {
  try {
    const { akord, wallet, jwtToken } = await Akord.auth.signIn(email, password);
    res.status(200).json({ wallet, jwtToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}