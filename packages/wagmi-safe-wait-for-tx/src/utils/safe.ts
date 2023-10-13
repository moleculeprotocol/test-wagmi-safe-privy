// emulates some features of api kit https://github.com/safe-global/safe-core-sdk/tree/main/packages/api-kit
// https://docs.safe.global/safe-core-api/available-services

import { Address } from "viem";
import {
  arbitrum,
  base,
  baseGoerli,
  gnosis,
  goerli,
  mainnet,
  optimism,
  polygon,
} from "viem/chains";
import { delay } from "./delay.js";

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

//https://docs.safe.global/safe-core-api/available-services
const apiNetworkName = (chainId: number): string => {
  switch (chainId) {
    case gnosis.id:
      return "gnosis-chain";
    case baseGoerli.id:
      return "base-testnet";
    default:
      return (
        {
          [mainnet.id]: "mainnet",
          [optimism.id]: "optimism",
          [polygon.id]: "polygon",
          [base.id]: "base",
          [arbitrum.id]: "arbitrum",
          [goerli.id]: "goerli",
        }[chainId] || "mainnet"
      );
  }
};

/**
 * @see https://safe-transaction-mainnet.safe.global/
 * @see https://safe-transaction-goerli.safe.global/api/v1/multisig-transactions/0xc02ba93a6f025e3e78dfceb5c9d4d681aa9aafc780ba6243d3d70ac9fdf48288/
 *
 * @param network goerli|mainnet
 * @param safeTxHash the "internal" safe tx hash
 * @returns 0xstring the executed transaction
 */
export const resolveSafeTx = async (
  networkId: number,
  safeTxHash: `0x${string}`,
  attempt = 1,
  maxAttempts = 10
): Promise<`0x${string}` | undefined> => {
  const networkName = apiNetworkName(networkId);
  if (attempt >= maxAttempts) {
    throw new Error(
      `timeout: couldnt find safeTx [${safeTxHash}] on [${networkName}]`
    );
  }
  const endpoint = `https://safe-transaction-${networkName}.safe.global`;
  const url = `${endpoint}/api/v1/multisig-transactions/${safeTxHash}`;

  const response = <TxServiceApiTransactionResponse>(
    await (await fetch(url)).json()
  );

  console.debug(
    `[${attempt}] looking up [${safeTxHash}] on [${networkName}]`,
    response
  );
  if (response.isSuccessful === null) {
    await delay(1000 * attempt ** 1.75); //using a polynomial backoff, 2 grows too fast for my taste
    return resolveSafeTx(networkId, safeTxHash, attempt + 1, maxAttempts);
  }

  if (!response.isSuccessful) {
    return undefined;
  }
  return response.transactionHash;
};
