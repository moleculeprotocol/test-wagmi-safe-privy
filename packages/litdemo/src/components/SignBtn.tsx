import { useAccount, usePublicClient } from "wagmi";
import { useAuth } from "../context/AuthContext";
import { ConnectKitButton } from "connectkit";
import { useIsContractWallet } from "@moleculexyz/wagmi-safe-wait-for-tx";
import { useCallback, useState } from "react";

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

export const VerifySignature = () => {
  const { isContract } = useIsContractWallet();
  const { authSig, siwe } = useAuth();
  const publicClient = usePublicClient();

  const [isSignatureValid, setIsSignatureValid] = useState<boolean>();

  const verifySignature = useCallback(async () => {
    if (!authSig || !publicClient) return;

    console.log("verifying", authSig);
    setIsSignatureValid(
      await publicClient.verifyMessage({
        address: authSig.address,
        message: authSig.signedMessage,
        signature: authSig.sig,
      })
    );
  }, [authSig, publicClient]);

  if (!authSig) return undefined;

  return (
    <div>
      <button onClick={verifySignature}>verify signature</button>

      {typeof isSignatureValid === "boolean" && (
        <p>
          Signature is <b>{isSignatureValid ? "valid" : "invalid"}</b>
        </p>
      )}
    </div>
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
