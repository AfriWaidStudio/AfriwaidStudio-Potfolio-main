import React, { useState, useEffect } from "react";
import { DollarSign, CreditCard, Banknote, RefreshCw } from "lucide-react";
import { useAuth } from "../../components/AuthContext";
import { Button } from "../../components/ui";
import { Card, Badge } from "../../components/ui";
import { Input } from "../../components/ui";

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
  const { token } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInvoices = async () => {
      if (!token) return;
      try {
        const res = await fetch("/api/invoices", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setInvoices(data.invoices || data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadInvoices();
  }, [token]);

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
          Invoices & Billing
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
          <div className="text-center py-12 text-slate-500">
            <RefreshCw className="w-12 h-12 mx-auto mb-4 text-slate-300 animate-spin" />
            <p className="font-mono text-xs">Loading invoices...</p>
          </div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <DollarSign className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p className="font-mono text-xs">No invoices found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {invoices.map((inv) => (
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