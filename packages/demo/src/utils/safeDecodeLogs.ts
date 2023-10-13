import { Abi, TransactionReceipt, decodeEventLog } from "viem";

export const safeDecodeLogs = (receipt: TransactionReceipt, abi: Abi) => {
  return receipt.logs
    .map((log) => {
      try {
        return decodeEventLog({
          abi,
          data: log.data,
          topics: log.topics,
        }) as any;
      } catch (e) {
        return null;
      }
    })
    .filter((log) => !!log);
};
