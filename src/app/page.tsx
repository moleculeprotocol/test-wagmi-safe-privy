"use client";

import {
  useStorageRetrieve,
  useStorageStore,
  storageABI,
} from "@/generated/wagmi";
import { Button, Flex, FormControl, Input, Text } from "@chakra-ui/react";
import { usePrivyWagmi } from "@privy-io/wagmi-connector";
import { useCallback, useEffect, useState } from "react";
import { decodeEventLog } from "viem";
import { useWaitForTransaction } from "wagmi";
import { WriteContractResult } from "wagmi/actions";

export default function Home() {
  const { ready, wallet } = usePrivyWagmi();
  const [newVal, setNewVal] = useState<number>();
  const [curVal, setCurVal] = useState<number>();
  const [tx, setTx] = useState<WriteContractResult>();

  const { data, error, status } = useStorageRetrieve();
  const { writeAsync } = useStorageStore();
  const { data: receipt, isError, isLoading } = useWaitForTransaction(tx);

  useEffect(() => {
    if (data === undefined) return;
    setCurVal(Number(data));
    setNewVal(Number(data));
  }, [data]);

  useEffect(() => {
    if (!receipt) return;

    const numberChangedEvent = receipt.logs
      .map((log) =>
        decodeEventLog({
          abi: storageABI,
          ...log,
        })
      )
      .find((e) => (e.eventName = "NumberChanged"));
    if (!numberChangedEvent) {
      console.warn("couldnt find numberchanged event");
      return;
    }

    console.log(numberChangedEvent);
    setCurVal(Number(numberChangedEvent.args._new));
  }, [receipt]);

  const onSubmit = useCallback(async () => {
    if (newVal === undefined) return;

    try {
      const writeResult = await writeAsync({
        args: [BigInt(newVal || 0n)],
      });
      console.info(writeResult);
      setTx(writeResult);
    } catch (e: any) {
      console.error(e);
    }
  }, [newVal, writeAsync]);

  if (!wallet) return <Text>Pls connect</Text>;
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
    </main>
  );
}
