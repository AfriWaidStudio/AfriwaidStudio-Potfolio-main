import React, { useEffect, useState } from "react";
import { Download, Receipt, RefreshCw } from "lucide-react";
import { Button, Card } from "../../components/ui";
import { PortalState } from "./PortalState";
import { downloadTextFile, formatDate, portalRequest } from "./portalApi";

interface Invoice {
  id: string;
  invoiceNo: string;
  amount: number;
  currency: string;
  company: string;
  description: string;
  status: string;
  issueDate: string;
  dueDate: string;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadInvoices = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await portalRequest<{ invoices: Invoice[] }>("/api/invoices");
      setInvoices(data.invoices || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invoices could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const downloadInvoice = (invoice: Invoice) => {
    const content = [
      "AFRIWAID STUDIO INVOICE",
      `Invoice: ${invoice.invoiceNo}`,
      `Company: ${invoice.company}`,
      `Issue date: ${invoice.issueDate}`,
      `Due date: ${invoice.dueDate}`,
      `Status: ${invoice.status}`,
      `Amount: ${invoice.currency} ${invoice.amount.toLocaleString()}`,
      "",
      invoice.description
    ].join("\n");
    downloadTextFile(`${invoice.invoiceNo}.pdf`, content, "application/pdf");
  };

  if (loading) return <PortalState loading icon={Receipt} title="Loading invoices" />;
  if (error) return <PortalState icon={Receipt} title="Invoices need attention" message={error} actionLabel="Retry" onAction={loadInvoices} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white">Invoices</h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400">Billing records loaded from the invoice API.</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadInvoices} leftIcon={<RefreshCw className="w-4 h-4" />}>Refresh</Button>
      </div>

      {invoices.length === 0 ? (
        <PortalState icon={Receipt} title="No invoices" message="Invoices issued to your company will appear here." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {invoices.map((invoice) => (
            <Card key={invoice.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-mono text-slate-400">{invoice.invoiceNo}</p>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{invoice.currency} {invoice.amount.toLocaleString()}</h2>
                  <p className="text-sm text-slate-500 mt-1">{invoice.description}</p>
                </div>
                <span className={`px-2 py-1 rounded text-[10px] font-mono uppercase ${invoice.status === "paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                  {invoice.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-5 text-xs text-slate-500">
                <span>Issued: {formatDate(invoice.issueDate)}</span>
                <span>Due: {formatDate(invoice.dueDate)}</span>
              </div>
              <Button className="mt-5" size="sm" variant="secondary" onClick={() => downloadInvoice(invoice)} leftIcon={<Download className="w-4 h-4" />}>
                Download PDF
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
