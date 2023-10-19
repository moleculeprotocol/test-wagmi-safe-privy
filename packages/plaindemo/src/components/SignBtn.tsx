import { useAuth } from "./AuthContext";

export const SigninButton = () => {
  const { signin, authSig } = useAuth();

  return (
    <>
      <h2>AuthSig</h2>
      <p>{JSON.stringify(authSig, null, 2)}</p>
      <button onClick={() => signin()}>sign in</button>
    </>
  );
};
