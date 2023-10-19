import { Text } from "@chakra-ui/react";
import { useIsContractWallet } from "@moleculexyz/wagmi-safe-wait-for-tx";
import { useAccount, usePublicClient } from "wagmi";

export const ActiveAddress = () => {
  const { address } = useAccount();
  const { isContract: isContractWallet } = useIsContractWallet(address);
  const pc = usePublicClient();

  return (
    <Text fontSize="sm">
      The active address is: {address} and it&apos;s a{" "}
      {isContractWallet ? "contract" : "EOA"}
    </Text>
  );
};
