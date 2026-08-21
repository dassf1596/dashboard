"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "กรุณากรอก Email และ Password" };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message.includes("Email not confirmed")) {
      return { error: "Email นี้ยังไม่ได้รับการยืนยัน (ไปที่ Supabase -> Users แล้วกด Confirm Email หรือปิด Confirm email)" };
    }
    if (error.message.includes("Invalid login credentials")) {
      return { error: "Email หรือ Password ไม่ถูกต้อง" };
    }
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
