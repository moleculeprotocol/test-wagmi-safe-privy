// emulates some features of api kit https://github.com/safe-global/safe-core-sdk/tree/main/packages/api-kit
// https://docs.safe.global/safe-core-api/available-services

import { Address } from "viem";
import { goerli, mainnet } from "viem/chains";
import { delay } from "./delay";

type TxServiceApiTransactionResponse = {
  safe: Address;
  to: Address;
  data: `0x${string}`;
  blockNumber: number;
  transactionHash: `0x${string}`;
  safeTxHash: `0x${string}`;
  executor: Address;
  isExecuted: boolean;
  isSuccessful: boolean;
  confirmations: Array<{
    owner: Address;
  }>;
};

const NetworkMap: Record<number, string | null> = {
  [goerli.id]: "goerli",
  [mainnet.id]: "mainnet",
};

// https://safe-transaction-goerli.safe.global/
// https://safe-transaction-mainnet.safe.global/
/**
 * @param network goerli|mainnet
 * @param safeTxHash the "internal" safe tx hash
 * @returns 0xstring the executed transaction
 */
export const resolveSafeTx = async (
  networkId: number,
  safeTxHash: `0x${string}`,
  attempt = 1
): Promise<`0x${string}` | undefined> => {
  const server = `https://safe-transaction-${NetworkMap[networkId]}.safe.global`;
  //  https://safe-transaction-goerli.safe.global/api/v1/multisig-transactions/0xc02ba93a6f025e3e78dfceb5c9d4d681aa9aafc780ba6243d3d70ac9fdf48288/'
  const url = `${server}/api/v1/multisig-transactions/${safeTxHash}`;

  const response = <TxServiceApiTransactionResponse>(
    await (await fetch(url)).json()
  );
  console.debug(`Safe Tx Api attempt ${attempt}`, response);
  if (response.isSuccessful === null) {
    await delay(2500 * attempt);
    return resolveSafeTx(networkId, safeTxHash, attempt + 1);
  }

  if (!response.isSuccessful) {
    return undefined;
  }
  return response.transactionHash;
};

// export const isSafe = (address: Address) => {};
