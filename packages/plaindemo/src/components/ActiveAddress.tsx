import { useIsContractWallet } from "@moleculexyz/wagmi-safe-wait-for-tx";
import { useAccount, usePublicClient } from "wagmi";

export const ActiveAddress = () => {
  const { address } = useAccount();
  const { isContract: isContractWallet } = useIsContractWallet(address);
  // const pc = usePublicClient();

  if (!address) return <></>;
  return (
    <p>
      The active address is: {address} and it&apos;s a{" "}
      {isContractWallet ? "contract" : "EOA"}
    </p>
  );
};
