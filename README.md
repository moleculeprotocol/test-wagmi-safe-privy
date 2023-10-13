# Wait for Transaction Receipts for AA (Safe) wallets

This library is compatible to wagmi hooks & viem publicProviders. It allows waiting for transaction receipts for Safe transactions. This is helpful when your users are connecting their Safe accounts using Walletconnect. A transaction submitted on that connection will return the `safeTx` hash of the Safe's infrastructure. To wait for a regular transaction receipt, you first must resolve the onchain transaction that has been executed by the respective relayer or submitted by the final signer.

[![npm version](https://badge.fury.io/js/@moleculexyz%2Fwagmi-safe-wait-for-tx.svg)](https://badge.fury.io/js/@moleculexyz%2Fwagmi-safe-wait-for-tx)
![GitHub deployments](https://img.shields.io/github/deployments/moleculeprotocol/test-wagmi-safe-privy/github-pages?label=demo%20deployed&link=https%3A%2F%2Fmoleculeprotocol.github.io%2Ftest-wagmi-safe-privy%2F)

## available hooks

- `useIsSafeWallet(address: Address): boolean|undefined` figures out whether address is a Safe account
- `useSafeWaitForTransaction(writeResult: WriteContractResult | undefined)` a drop in replacement for `useWaitForTransaction`
- `safeWaitForTransactionReceipt(publicClient, {hash, address})` plain viem usage: takes a public client & an address and returns `Promise<TransactionReceipt>``

## install

```bash
yarn add @moleculexyz/wagmi-safe-wait-for-tx
```

## Docs

See [the library Readme](./packages/wagmi-safe-wait-for-tx/README.md).  
NPM package https://www.npmjs.com/package/@moleculexyz/wagmi-safe-wait-for-tx

## Original Issues

https://ethereum.stackexchange.com/questions/155384/how-to-get-receipt-in-wagmi-viem-for-a-transaction-issued-with-safe-on-walletc

Copyright (c) 2023 by [Molecule AG](https://molecule.xyz)
