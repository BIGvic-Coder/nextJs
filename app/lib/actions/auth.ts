"use server";

import { supabase } from "@/app/lib/supabaseclient";
import { redirect } from "next/navigation";

export async function logout() {
  await supabase.auth.signOut();
  redirect("/login");
}
