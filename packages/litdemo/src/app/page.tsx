"use client";

import { ActiveAddress } from "@/components/ActiveAddress";
import { LitActions } from "@/components/LitActions";
import {
  AuthSigPre,
  SigninButton,
  VerifySignature,
} from "@/components/SignBtn";
import styles from "./page.module.css";
export default function Home() {
  return (
    <main className={styles.main}>
      <h1>Test Lit AuthSigs</h1>
      <SigninButton />
      <ActiveAddress />
      <AuthSigPre />
      <VerifySignature />
      <LitActions />
    </main>
  );
}
