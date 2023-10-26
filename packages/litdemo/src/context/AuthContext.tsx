"use client";

import { useIsContractWallet } from "@moleculexyz/wagmi-safe-wait-for-tx";
import React, { useCallback, useContext, useState } from "react";
import { SiweMessage } from "siwe";
import { recoverMessageAddress } from "viem";
import { useAccount, useNetwork, usePublicClient, useSignMessage } from "wagmi";

const SIWE_KEY = "foo-siwe";

export interface AuthSig {
  sig: any;
  derivedVia: string;
  signedMessage: string;
  address: `0x${string}`;
}

interface IAuthContext {
  siwe?: SiweMessage;
  authSig?: AuthSig;
  signin: () => Promise<void | any>;
  signout: () => void;
}

type AuthState = {
  siwe?: SiweMessage;
  authSig?: AuthSig;
  nonce: string | undefined;
};

const AuthContext = React.createContext<IAuthContext>({
  signin: async () => Promise.resolve(),
  signout: () => undefined,
});

const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AuthState>({ nonce: "somenonce" });

  const { address } = useAccount();
  const { isContract, isSafe } = useIsContractWallet(address);
  const { chain } = useNetwork();
  const { signMessageAsync } = useSignMessage();

  const signout = () => {
    (async () => {
      setState({ nonce: undefined });
    })();
  };

  const signin = useCallback(async () => {
    const chainId = chain?.id;

    if (!state.nonce || !address || !chainId) return;

    const message = new SiweMessage({
      domain: window.location.host,
      address,
      statement: "Sign in with Ethereum.",
      uri: window.location.origin,
      version: "1",
      chainId,
      nonce: state.nonce,
    });

    const messageToSign = message.prepareMessage();
    const signature = await signMessageAsync({
      message: messageToSign as `0x${string}`,
    });

    // see https://github.com/LIT-Protocol/hotwallet-signing-example/blob/main/sign.js
    // https://developer.litprotocol.com/SDK/Explanation/WalletSigs/authSig

    const derivedVia = isContract ? "EIP1271" : "web3.eth.personal.sign";
    const newState = {
      siwe: message,
      authSig: {
        address: address,
        sig: signature,
        derivedVia,
        signedMessage: messageToSign,
      },
    };

    setState((x) => ({
      ...x,
      ...newState,
    }));
    return newState;
  }, [address, chain?.id, isContract, signMessageAsync, state.nonce]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signin,
        signout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, useAuth };
