"use client";

import { useStorageRetrieve, useStorageStore } from "@/generated/wagmi";
import { Button, Flex, FormControl, Input, Text } from "@chakra-ui/react";
import { usePrivyWagmi } from "@privy-io/wagmi-connector";
import { useCallback, useEffect, useState } from "react";

export default function Home() {
  const { ready, wallet } = usePrivyWagmi();
  const [newVal, setNewVal] = useState<number>();

  const { data, error, status } = useStorageRetrieve();
  useEffect(() => {
    if (data === undefined) return;
    setNewVal(Number(data));
  }, [data]);

  const { writeAsync } = useStorageStore();
  const onSubmit = useCallback(async () => {
    if (newVal === undefined) return;

    try {
      const writeResult = await writeAsync({
        args: [BigInt(newVal || 0n)],
      });
      console.log(writeResult);
    } catch (e: any) {
      console.error(e);
    }
  }, [newVal, writeAsync]);

  if (!wallet) return <Text>Pls connect</Text>;
  return (
    <main>
      <Text>
        current value: {data !== undefined ? data.toString() : "not avail"}{" "}
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
      </form>
    </main>
  );
}
