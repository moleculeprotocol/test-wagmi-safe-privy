"use client";

import * as LitJsSdk from "@lit-protocol/lit-node-client";
import React, { useContext, useEffect, useState } from "react";

interface ILitContext {
  lit?: LitJsSdk.LitNodeClient;
}

const LitContext = React.createContext<ILitContext>({});

const useLit = () => useContext(LitContext);

const LitProvider = ({ children }: { children: React.ReactNode }) => {
  const [lit, setLit] = useState<LitJsSdk.LitNodeClient>();

  useEffect(() => {
    const client = new LitJsSdk.LitNodeClient({
      litNetwork: "serrano",
    });
    client.connect().then((e) => {
      console.debug("lit network connected");
      setLit(client);
    });
  }, []);

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
