import React, { useState, useEffect } from "react";
import { DollarSign, CreditCard, Banknote, RefreshCw } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";
import { Card, Badge } from "../../components/ui";
import { PortalState, getRouteLeaf } from "./PortalState";

interface Invoice {
  id: string;
  invoiceNo: string;
  amount: number;
  currency: string;
  company: string;
  description: string;
  status: "paid" | "unpaid";
  issueDate: string;
  dueDate: string;
}

export default function InvoicesPage() {
  const { user } = useAuth();
  const location = useLocation();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadInvoices = async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/invoices", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("afriwaid_auth_token") || ""}` }
      });
      if (!res.ok) throw new Error(`Invoices could not be loaded (${res.status}).`);
      const data = await res.json();
      setInvoices(data.invoices || data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invoices could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, [user]);

  const section = getRouteLeaf(location.pathname, "/portal/invoices");
  const filteredInvoices = invoices.filter((i) => {
    if (section === "receipts") return i.status === "paid";
    if (section === "payments") return i.status === "unpaid";
    return true;
  });
  const titleMap: Record<string, string> = {
    overview: "Invoices & Billing",
    ledger: "Ledger Desk",
    receipts: "Receipts",
    payments: "Payments",
  };
  const title = titleMap[section] || "Invoices & Billing";

  const stats = {
    total: invoices.length,
    paid: invoices.filter(i => i.status === "paid").length,
    unpaid: invoices.filter(i => i.status === "unpaid").length,
    totalAmount: invoices.reduce((sum, i) => sum + i.amount, 0),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white mb-2">
          {title}
        </h1>
        <p className="text-slate-500 dark:text-zinc-400 text-sm">
          Manage invoices and billing information.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <DollarSign className="w-6 h-6 text-slate-500 mb-2" />
          <p className="text-[10px] text-slate-400 font-mono uppercase">Total Invoices</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
        </Card>
        <Card>
          <Banknote className="w-6 h-6 text-emerald-500 mb-2" />
          <p className="text-[10px] text-slate-400 font-mono uppercase">Paid</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.paid}</p>
        </Card>
        <Card>
          <CreditCard className="w-6 h-6 text-red-500 mb-2" />
          <p className="text-[10px] text-slate-400 font-mono uppercase">Unpaid</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.unpaid}</p>
        </Card>
        <Card>
          <DollarSign className="w-6 h-6 text-blue-500 mb-2" />
          <p className="text-[10px] text-slate-400 font-mono uppercase">Total Amount</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">${stats.totalAmount.toLocaleString()}</p>
        </Card>
      </div>

      <Card title="Invoice List">
        {loading ? (
          <PortalState loading icon={RefreshCw} title="Loading invoices" />
        ) : error ? (
          <PortalState icon={DollarSign} title="Invoices unavailable" message={error} actionLabel="Retry" onAction={loadInvoices} />
        ) : filteredInvoices.length === 0 ? (
          <PortalState icon={DollarSign} title="No invoices found" message="There are no billing records in this view." />
        ) : (
          <div className="space-y-3">
            {filteredInvoices.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-zinc-950 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{inv.invoiceNo}</p>
                  <p className="text-[10px] text-slate-400">{inv.company} - ${inv.amount} {inv.currency}</p>
                </div>
                <div className="text-right">
                  <Badge variant={inv.status === "paid" ? "success" : "error"}>
                    {inv.status}
                  </Badge>
                  <p className="text-[10px] text-slate-400 mt-1">Due: {inv.dueDate}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
