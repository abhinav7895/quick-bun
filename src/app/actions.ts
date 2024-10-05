"use server";

import { signIn } from "@/auth";

export const handeSignin = async () => {
  await signIn("google", {
    redirectTo: "/",
    redirect: true,
  });
};
