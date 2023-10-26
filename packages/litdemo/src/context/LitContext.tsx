"use client";

import * as LitJsSdk from "@lit-protocol/lit-node-client";
import React, { useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

interface ILitContext {
  lit?: LitJsSdk.LitNodeClient;
}

const LitContext = React.createContext<ILitContext>({});

const useLit = () => useContext(LitContext);

const LitProvider = ({ children }: { children: React.ReactNode }) => {
  const { authSig } = useAuth();

  const [lit, setLit] = useState<LitJsSdk.LitNodeClient>();

  useEffect(() => {
    if (!authSig) return;

    const client = new LitJsSdk.LitNodeClient({});
    client.connect().then((e) => {
      console.debug("lit network connected");
      setLit(client);
    });
  }, [authSig]);

  return (
    <LitContext.Provider
      value={{
        lit,
      }}
    >
      {children}
    </LitContext.Provider>
  );
};

export { LitProvider, useLit };
