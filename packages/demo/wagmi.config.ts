import { defineConfig } from "@wagmi/cli";
import { actions, react } from "@wagmi/cli/plugins";
//import { erc20ABI } from "wagmi";
import { Abi } from "viem";
import StorageABI from "./src/abis/Storage.json";
import { goerli } from "viem/chains";

export default defineConfig({
  out: "src/generated/wagmi.ts",
  contracts: [
    {
      name: "Storage",
      abi: StorageABI as Abi,
      address: {
        [goerli.id]: "0xd7f65e5e9d30E02553Fb03AD74B26577FD5bA22f",
      },
    },
  ],
  plugins: [
    // etherscan({
    //   apiKey: process.env.ETHERSCAN_API_KEY!,
    //   chainId: goerli.id,
    //   contracts: [
    //     {
    //       name: "Storage",
    //       address: {
    //         [goerli.id]: "0xd7f65e5e9d30E02553Fb03AD74B26577FD5bA22f",
    //       },
    //     },
    //   ],
    // }),
    react(),
    actions(),
  ],
});
