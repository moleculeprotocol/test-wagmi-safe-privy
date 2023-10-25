import { useAuth } from "../context/AuthContext";

export const AuthSigPre = () => {
  const { authSig } = useAuth();

  return (
    <>
      <h2>AuthSig</h2>
      <div style={{ maxWidth: "80vw" }}>
        <pre style={{ whiteSpace: "pre-wrap" }}>
          {JSON.stringify(authSig, null, 2)}
        </pre>
      </div>
    </>
  );
};

export const SigninButton = () => {
  const { signin, authSig } = useAuth();

  return (
    <>
      <button onClick={() => signin()}>sign in</button>
    </>
  );
};
