import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { InvoiceList } from "./invoice-list";

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const { rows } = await query("select * from invoices where owner_id = $1", [user.id]);
  return <InvoiceList invoices={rows} />;
}
