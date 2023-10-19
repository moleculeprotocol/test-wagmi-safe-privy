"use client";

import { ConnectKitButton } from "connectkit";
import styles from "./page.module.css";
import { ActiveAddress } from "@/components/ActiveAddress";
import { SigninButton } from "@/components/SignBtn";
export default function Home() {
  return (
    <main className={styles.main}>
      <ConnectKitButton />
      <h1>A happy page</h1>
      <ActiveAddress /> <SigninButton />
    </main>
  );
}
