"use server";

import { revalidatePath } from "next/cache";
import { query } from "@/lib/db";

export async function deleteInvoice(id: string) {
  const result = await query("delete from invoices where id = $1 returning *", [id]);
  revalidatePath("/dashboard");
  return result.rows[0];
}
