import { useIsContractWallet } from "@moleculexyz/wagmi-safe-wait-for-tx";
import { ConnectKitButton } from "connectkit";
import { useCallback, useState } from "react";
import { hashMessage } from "viem";
import { useAccount, usePublicClient } from "wagmi";
import { useAuth } from "../context/AuthContext";

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
  const { address } = useAccount();
  const { isSafe, isContract } = useIsContractWallet(address);
  const { authSig, siwe } = useAuth();
  const publicClient = usePublicClient();

  const [isSignatureValid, setIsSignatureValid] = useState<boolean>();
  const [validatedSigOnChain, setValidatedSigOnChain] = useState<string>();

  const verifySignatureOnSafeContract = useCallback(async () => {
    if (!authSig || !publicClient || !address) return;

    const eip1271Abi = [
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "hash",
            type: "bytes32",
          },
          {
            internalType: "bytes",
            name: "signature",
            type: "bytes",
          },
        ],
        name: "isValidSignature",
        outputs: [
          {
            internalType: "bytes4",
            name: "magicValue",
            type: "bytes4",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ];
    const hashedMessage = hashMessage(authSig.signedMessage);
    console.log("hashed message", hashedMessage);
    const retVal = await publicClient.readContract({
      address: address,
      abi: eip1271Abi,
      functionName: "isValidSignature",
      args: [hashedMessage, authSig.sig],
    });

    setValidatedSigOnChain(retVal as string);
  }, [address, authSig, publicClient]);

  const verifySignature = useCallback(async () => {
    if (!authSig || !publicClient) return;

    console.log(
      "verifying authsig (Contract: %s | Safe: %s)",
      isContract,
      isSafe,
      authSig
    );
    if (isSafe) {
      verifySignatureOnSafeContract();
    }

    //note that viem is using https://eips.ethereum.org/EIPS/eip-6492 under the hood
    setIsSignatureValid(
      await publicClient.verifyMessage({
        address: authSig.address as `0x${string}`,
        message: authSig.signedMessage,
        signature: authSig.sig,
      })
    );
  }, [
    authSig,
    publicClient,
    isContract,
    isSafe,
    verifySignatureOnSafeContract,
  ]);

  if (!authSig) return undefined;

  return (
    <div>
      <button onClick={verifySignature}>verify signature</button>

      {typeof isSignatureValid === "boolean" && (
        <p>
          Signature is <b>{isSignatureValid ? "valid" : "invalid"}</b>
        </p>
      )}
      {validatedSigOnChain && (
        <p>
          call result of isValidSignature(bytes32,bytes):{" "}
          <b>
            {validatedSigOnChain}{" "}
            {validatedSigOnChain == "0x1626ba7e" ? "(valid)" : "(invalid)"}
          </b>
        </p>
      )}
    </div>
  );
};

export const SigninButton = () => {
  const { signin, authSig, signinWithLit } = useAuth();
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
      {<button onClick={() => signinWithLit()}>sign in with lit</button>}
      <ConnectKitButton />
      {authSig
        ? "signed in"
        : address && (
            <>
              <button onClick={() => signin()}>sign in</button>
            </>
          )}
    </div>
  );
};
