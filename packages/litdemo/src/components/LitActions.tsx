import { useAuth } from "@/context/AuthContext";
import { useLit } from "@/context/LitContext";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { useIsContractWallet } from "@moleculexyz/wagmi-safe-wait-for-tx";
import { useCallback, useState } from "react";
import { useAccount, useNetwork } from "wagmi";

const accessControlConditions = {
  contractAddress: "",
  standardContractType: "",
  chain: "ethereum",
  method: "eth_getBalance",
  parameters: [":userAddress", "latest"],
  returnValueTest: {
    comparator: ">=",
    value: "1000000000000", // 0.000001 ETH
  },
};
export const LitActions = () => {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { isContract: isContractWallet } = useIsContractWallet(address);
  const { lit } = useLit();
  const { authSig } = useAuth();

  const [encrypted, setEncrypted] = useState<{ key: string; message: Blob }>();
  const [decrypted, setDecrypted] = useState<{
    key: string;
    message: string;
  }>();

  const encrypt = useCallback(async () => {
    if (!lit || !chain) return;

    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
      "this is a secret message"
    );

    const encryptedSymmetricKey = await lit.saveEncryptionKey({
      accessControlConditions: [
        {
          ...accessControlConditions,
          chain: chain.network,
        },
      ],
      symmetricKey,
      authSig,
      chain: chain.network,
    });

    setEncrypted({
      key: LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "base16"),
      message: encryptedString,
    });
  }, [authSig, chain, lit]);

  const decrypt = useCallback(async () => {
    if (!lit || !chain || !encrypted) return;

    const decryptedKey = await lit.getEncryptionKey({
      accessControlConditions: [
        {
          ...accessControlConditions,
          chain: chain.network,
        },
      ],
      toDecrypt: encrypted.key,
      authSig,
      chain: chain.network,
    });

    const decryptedString = await LitJsSdk.decryptString(
      encrypted.message,
      decryptedKey
    );

    setDecrypted({
      key: LitJsSdk.uint8arrayToString(decryptedKey, "base16"),
      message: decryptedString,
    });
  }, [authSig, chain, encrypted, lit]);

  if (!lit || !authSig) return <></>;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        maxWidth: "80vw",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", gap: "2rem" }}>
        <button onClick={encrypt}>encrypt</button>
        {encrypted && <button onClick={decrypt}>decrypt</button>}
      </div>

      <div style={{ maxWidth: "100%", wordWrap: "break-word" }}>
        {encrypted && (
          <p>
            <b>Encrypted Key</b>
            {encrypted.key}
          </p>
        )}
        {decrypted && (
          <p>
            <b>Decrypted Message</b>
            {decrypted.message}
          </p>
        )}
      </div>
    </div>
  );
};
