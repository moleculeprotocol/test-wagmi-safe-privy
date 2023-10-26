import { useAccount } from "wagmi";
import { useAuth } from "../context/AuthContext";
import { ConnectKitButton } from "connectkit";

export const AuthSigPre = () => {
  const { authSig } = useAuth();

  if (!authSig) return <></>;
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
  const { address } = useAccount();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "2rem",
      }}
    >
      <ConnectKitButton />
      {authSig
        ? "signed in"
        : address && <button onClick={() => signin()}>sign in</button>}
    </div>
  );
};
