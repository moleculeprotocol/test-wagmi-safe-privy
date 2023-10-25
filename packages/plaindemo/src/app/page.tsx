"use client";

import { ConnectKitButton } from "connectkit";
import styles from "./page.module.css";
import { ActiveAddress } from "@/components/ActiveAddress";
import { AuthSigPre, SigninButton } from "@/components/SignBtn";
import { LitActions } from "@/components/LitActions";
export default function Home() {
  return (
    <main className={styles.main}>
      <ConnectKitButton />
      <h1>A happy page</h1>
      <ActiveAddress />
      <AuthSigPre />
      <SigninButton />
      <LitActions />
    </main>
  );
}
