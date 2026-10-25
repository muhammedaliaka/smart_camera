"use client";

import { deleteInvoice } from "./actions";

export function InvoiceList({ invoices }: { invoices: any[] }) {
  return (
    <ul>
      {invoices.map((inv) => (
        <li key={inv.id}>
          {inv.customer_name}: {inv.amount}
          <button onClick={() => deleteInvoice(inv.id)}>Sil</button>
        </li>
      ))}
    </ul>
  );
}
