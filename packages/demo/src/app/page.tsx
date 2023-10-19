"use client";

import { ActiveAddress } from "@/components/ActiveAddress";
import {
  storageABI,
  useStorageRetrieve,
  useStorageStore,
} from "@/generated/wagmi";
import { safeDecodeLogs } from "@/utils/safeDecodeLogs";
import {
  Button,
  Flex,
  FormControl,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useSafeWaitForTransaction } from "@moleculexyz/wagmi-safe-wait-for-tx";
import { useCallback, useEffect, useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import { WriteContractResult } from "wagmi/actions";

export default function Home() {
  //const { ready, wallet: activeWallet, setActiveWallet } = usePrivyWagmi();
  const { address } = useAccount();

  const { chain } = useNetwork();

  const toast = useToast();
  const [newVal, setNewVal] = useState<number>();
  const [curVal, setCurVal] = useState<number>();
  const [tx, setTx] = useState<WriteContractResult>();

  const { data, error, status } = useStorageRetrieve();
  const { writeAsync } = useStorageStore();
  const { data: receipt, isError, isLoading } = useSafeWaitForTransaction(tx);

  useEffect(() => {
    if (data === undefined) return;
    setCurVal(Number(data));
    setNewVal(Number(data));
  }, [data]);

  useEffect(() => {
    if (!receipt) return;

    const numberChangedEvent = safeDecodeLogs(receipt, storageABI).find(
      (e) => e?.eventName == "NumberChanged"
    );
    if (!numberChangedEvent) {
      console.warn("couldnt find numberchanged event");
      return;
    }

    console.log(numberChangedEvent);
    toast({
      status: "success",
      title: "Number updated",
      description: `to ${numberChangedEvent.args._new}`,
    });
    setCurVal(Number(numberChangedEvent.args._new));
  }, [receipt, toast]);

  const onSubmit = useCallback(async () => {
    if (!address || !chain || newVal === undefined) return;

    setTx(
      await writeAsync({
        args: [BigInt(newVal || 0n)],
      })
    );
  }, [address, chain, newVal, writeAsync]);

  return (
    <main>
      <Text>
        current value: {curVal !== undefined ? curVal.toString() : "not avail"}
      </Text>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
          return false;
        }}
      >
        <Flex>
          <FormControl>
            <Input
              name="newVal"
              type="number"
              value={newVal}
              onChange={(v) => setNewVal(v.target.valueAsNumber)}
            />
          </FormControl>
          <Button colorScheme="cyan" type="submit">
            Store
          </Button>
        </Flex>
        {tx && (
          <Flex direction="column" my={6}>
            <Text>
              Transaction: <b>{tx.hash}</b>
            </Text>
            {receipt && (
              <Text>
                Receipt: <b>{receipt.status}</b>
              </Text>
            )}
          </Flex>
        )}
      </form>
      <ActiveAddress />
    </main>
  );
}
