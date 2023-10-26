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

  const [encrypted, setEncrypted] = useState<{
    ciphertext: string;
    encryptedHash: string;
  }>();
  const [decrypted, setDecrypted] = useState<{
    message: string;
  }>();

  const encrypt = useCallback(async () => {
    if (!lit || !chain) return;
    try {
      const { ciphertext, dataToEncryptHash } = await LitJsSdk.encryptString(
        {
          accessControlConditions: [
            {
              ...accessControlConditions,
              chain: chain.network,
            },
          ],
          authSig,
          chain: chain.network,
          dataToEncrypt: "this is a secret message",
        },
        lit
      );

      setEncrypted({
        ciphertext,
        encryptedHash: dataToEncryptHash,
      });
    } catch (e: any) {
      console.error(e.message);
      alert(`failed ${e.message}`);
    }
  }, [authSig, chain, lit]);

  const decrypt = useCallback(async () => {
    if (!lit || !chain || !encrypted) return;

    const decryptedString = await LitJsSdk.decryptToString(
      {
        accessControlConditions: [
          {
            ...accessControlConditions,
            chain: chain.network,
          },
        ],
        ciphertext: encrypted.ciphertext,
        dataToEncryptHash: encrypted.encryptedHash,
        authSig,
        chain: chain.network,
      },
      lit
    );

    setDecrypted({
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
            <b>Encrypted Hash</b>
            {encrypted.encryptedHash}
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
