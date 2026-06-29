import React, { useState } from "react";
import { 
  BadgeDollarSign, CheckCircle2, Clock, CheckCircle, Eye, Download, 
  ArrowRight, ShieldCheck, Loader2, Sparkles, FileText, Check
} from "lucide-react";
import { Invoice, ClientProfile } from "../../types";

interface FinancialLedgerProps {
  invoicesList: Invoice[];
  setInvoicesList: React.Dispatch<React.SetStateAction<Invoice[]>>;
  loggedInClient: ClientProfile;
  paymentSuccessToast: string | null;
  setPaymentSuccessToast: (toast: string | null) => void;
}

export default function FinancialLedger({
  invoicesList,
  setInvoicesList,
  loggedInClient,
  paymentSuccessToast,
  setPaymentSuccessToast
}: FinancialLedgerProps) {
  // Local state for interactive overlays
  const [paymentOverlay, setPaymentOverlay] = useState<Invoice | null>(null);
  const [payingState, setPayingState] = useState<"idle" | "authorizing" | "routing" | "success">("idle");
  const [receiptToShow, setReceiptToShow] = useState<Invoice | null>(null);

  const triggerClearPayment = (invoice: Invoice) => {
    setPaymentOverlay(invoice);
    setPayingState("idle");
  };

  const executeClearInvoiceWire = () => {
    setPayingState("authorizing");
    setTimeout(() => {
      setPayingState("routing");
      setTimeout(() => {
        setPayingState("success");
        setPaymentSuccessToast(`Financial clearance receipt authorized for Invoice #${paymentOverlay?.invoiceNumber}`);
        // update invoice list
        setInvoicesList(prev => prev.map(inv => inv.id === paymentOverlay?.id ? { ...inv, status: "Paid" } : inv));
        setTimeout(() => setPaymentSuccessToast(null), 8050);
      }, 1500);
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-fadeIn text-left">
      {/* Financial Status Toast */}
      {paymentSuccessToast && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl flex items-center gap-2 font-mono">
          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{paymentSuccessToast}</span>
        </div>
      )}

      {/* BUDGET BENTO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        <div className="p-5 bg-slate-50 dark:bg-zinc-950/40 border border-slate-205 dark:border-neutral-900 rounded-2xl space-y-1">
          <span className="text-[8px] text-slate-405 dark:text-zinc-500 font-mono uppercase tracking-widest font-bold">Approved Contract Sum</span>
          <p className="text-xl font-mono font-black text-slate-900 dark:text-white">$35,000 USD</p>
          <div className="flex items-center gap-1.5 text-[9px] text-emerald-500 font-mono pt-1">
            <Check className="w-3 h-3 stroke-[3]" />
            <span>Scope approved in stand-up</span>
          </div>
        </div>

        <div className="p-5 bg-slate-50 dark:bg-zinc-950/40 border border-slate-205 dark:border-neutral-900 rounded-2xl space-y-1">
          <span className="text-[8px] text-slate-400 dark:text-zinc-500 font-mono uppercase tracking-widest font-bold">Liquid Ledger Disbursed</span>
          <p className="text-xl font-mono font-black text-slate-900 dark:text-white">
            ${invoicesList.filter(i => i.status === "Paid").reduce((acc, current) => {
              const numVal = parseInt(current.amount.replace(/[^0-9]/g, "")) || 0;
              return acc + numVal;
            }, 0).toLocaleString()} USD
          </p>
          <span className="text-[9px] text-slate-400 block font-sans">Released under active milestones.</span>
        </div>

        <div className="p-5 bg-slate-50 dark:bg-zinc-950/40 border border-slate-205 dark:border-neutral-900 rounded-2xl space-y-1">
          <span className="text-[8px] text-slate-400 dark:text-zinc-500 font-mono uppercase tracking-widest font-bold">Outstanding Ledger Lock</span>
          <p className="text-xl font-mono font-black text-red-500">
            ${invoicesList.filter(i => i.status === "Unpaid" || i.status === "Overdue").reduce((acc, current) => {
              const numVal = parseInt(current.amount.replace(/[^0-9]/g, "")) || 0;
              return acc + numVal;
            }, 0).toLocaleString()} USD
          </p>
          <span className="text-[9px] text-red-405 dark:text-red-400 font-mono flex items-center gap-1 font-bold">
            <span>● awaiting crypto/wire clearance</span>
          </span>
        </div>
      </div>

      {/* TWO PANEL INVOICE + PROPOSAL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Outstanding Bills Ledger - 7 cols */}
        <div className="lg:col-span-7 bg-slate-50 dark:bg-zinc-950/40 border border-slate-200 dark:border-neutral-900 rounded-2xl p-6 space-y-4">
          <div className="border-b border-slate-200 dark:border-zinc-900 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase font-mono tracking-widest">Milestones Bills Ledger</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Clearing invoices authorizes cryptographic SLA release keys.</p>
            </div>
            <span className="text-[8px] bg-slate-100 dark:bg-zinc-900 px-2 py-1 font-mono text-slate-500 rounded font-bold">SECURE PORTAL</span>
          </div>

          <div className="space-y-4">
            {invoicesList.map((inv) => {
              const isPaid = inv.status === "Paid";
              return (
                <div key={inv.id} className="p-4 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900 rounded-xl flex items-center justify-between gap-4 font-sans hover:border-slate-350 dark:hover:border-neutral-805 transition-all">
                  <div className="space-y-1.5 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-zinc-200 font-mono">Invoice #{inv.invoiceNumber}</span>
                      <span className={`px-1.5 py-0.5 text-[8px] font-mono font-black uppercase rounded ${
                        isPaid ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500 animate-pulse"
                      }`}>
                        {inv.status}
                      </span>
                    </div>
                    <div className="text-[9px] text-slate-450 space-y-0.5 font-sans leading-relaxed">
                      <p>Issue Date: <strong className="text-slate-800 dark:text-zinc-300 font-mono">{inv.issueDate}</strong></p>
                      <p>Due Allocation: <strong className="text-slate-800 dark:text-zinc-300 font-mono">{inv.dueDate}</strong></p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono font-black text-slate-900 dark:text-white">{inv.amount}</span>
                    {isPaid ? (
                      <button 
                        onClick={() => setReceiptToShow(inv)}
                        className="px-3 py-1.5 bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-800 dark:text-zinc-200 font-mono text-[9px] font-bold rounded-lg transition flex items-center gap-1 cursor-pointer"
                        title="Display cryptographic proof of payment"
                      >
                        <Eye className="w-3 h-3 text-cyan-400" />
                        <span>RECEIPT</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => triggerClearPayment(inv)}
                        className="px-3.5 py-1.5 bg-slate-900 dark:bg-zinc-900 hover:bg-cyan-500 hover:text-black dark:hover:bg-cyan-500 dark:hover:text-black text-white font-mono text-[9.5px] font-black rounded-lg transition cursor-pointer active:scale-95 flex items-center gap-1"
                        id={`pay-now-inv-${inv.invoiceNumber}`}
                      >
                        <span>SETTLE WIRE</span>
                        <ArrowRight className="w-3 h-3 text-cyan-400" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Scope Proposals - 5 cols */}
        <div className="lg:col-span-5 bg-slate-50 dark:bg-zinc-950/40 border border-slate-200 dark:border-neutral-900 rounded-2xl p-6 space-y-4">
          <div className="border-b border-slate-200 dark:border-zinc-900 pb-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase font-mono tracking-widest">Verified Scope Proposals</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Approved agreement schedules governing this deployment workspace node.</p>
          </div>

          <div className="space-y-3.5">
            {loggedInClient.proposals?.map((prop) => (
              <div key={prop.id} className="p-4 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900 rounded-xl space-y-3 text-left">
                <div className="space-y-1">
                  <span className="text-[8px] text-emerald-500 font-mono font-black uppercase tracking-wider block">✔ ACTIVE CONTRACT AGREEMENT</span>
                  <h4 className="font-bold text-slate-900 dark:text-zinc-250 truncate text-[12px]">{prop.title}</h4>
                  <span className="text-[9px] text-slate-500 block font-mono">Endorsed on {prop.date}</span>
                </div>
                <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 dark:border-zinc-900">
                  <span className="text-xs font-mono font-black text-cyan-500">{prop.value}</span>
                  <span className="px-1.5 py-0.5 text-[8.5px] font-mono uppercase bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 rounded block font-bold border border-slate-200 dark:border-zinc-800">
                    SLA {prop.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* OVERLAY PANEL 1: INVOICE CLEARANCE MODAL STAGE */}
      {paymentOverlay && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn font-sans">
          <div className="bg-white dark:bg-zinc-950 border border-slate-300 dark:border-zinc-900 rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-zinc-90 w-auto hover:bg-slate-200 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 flex items-center justify-center mx-auto text-cyan-500">
                <BadgeDollarSign className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900 dark:text-white uppercase font-mono tracking-wider">Clear Invoice Node</h3>
                <p className="text-[11px] text-slate-500">Invoice Reference: <strong className="text-slate-800 dark:text-zinc-300">#{paymentOverlay.invoiceNumber}</strong></p>
                <p className="text-lg font-mono font-black text-cyan-500 pt-1">{paymentOverlay.amount}</p>
              </div>

              {/* Paying Progress states */}
              <div className="p-4 bg-slate-50 dark:bg-neutral-900/60 rounded-xl text-left border border-slate-200 dark:border-zinc-900">
                {payingState === "idle" && (
                  <div className="space-y-3 font-sans text-xs">
                    <p className="text-slate-600 dark:text-zinc-305 leading-relaxed text-[10px]">
                      Authorize payment of <strong className="text-slate-900 dark:text-white">{paymentOverlay.amount}</strong> to AfriWaid Studio Ltd. This action clears the active milestone deliverables for down-stream build deployments.
                    </p>
                    <div className="p-3 bg-white dark:bg-black border border-slate-250 dark:border-zinc-950 rounded-xl flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="text-[9.5px] font-mono text-slate-500">SECURE SSL 256-BIT TRANSFER PROTOCOL</span>
                    </div>
                  </div>
                )}

                {payingState === "authorizing" && (
                  <div className="py-4 text-center space-y-3">
                    <Loader2 className="w-8 h-8 animate-spin text-cyan-500 mx-auto" />
                    <p className="font-mono text-[10px] text-slate-650 tracking-wide animate-pulse uppercase font-black">Authorizing federated credentials ledger...</p>
                  </div>
                )}

                {payingState === "routing" && (
                  <div className="py-4 text-center space-y-3">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mx-auto" />
                    <p className="font-mono text-[10px] text-emerald-500 tracking-wide animate-pulse uppercase font-black">Rerouting global clearance nodes...</p>
                  </div>
                )}

                {payingState === "success" && (
                  <div className="py-4 text-center space-y-3">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto animate-bounce-slow" />
                    <p className="font-mono text-[11px] text-emerald-500 font-extrabold tracking-wide uppercase">Payment Authorized successfully!</p>
                    <p className="text-[10px] text-slate-500 font-sans leading-normal">Your cryptographic signature receipt is generated. Click close below to dismiss.</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                {payingState !== "success" && (
                  <button 
                    onClick={() => setPaymentOverlay(null)}
                    disabled={payingState !== "idle"}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-mono font-bold text-xs rounded-lg transition disabled:opacity-50 cursor-pointer"
                    id="cancel-payment-btn"
                  >
                    DISMISS
                  </button>
                )}
                {payingState === "idle" && (
                  <button 
                    onClick={executeClearInvoiceWire}
                    className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold font-mono tracking-wider text-xs rounded-lg transition active:scale-95 shadow hover:shadow-cyan-500/20 cursor-pointer"
                    id="confirm-pay-wire-btn"
                  >
                    CONFIRM WIRE
                  </button>
                )}
                {payingState === "success" && (
                  <button 
                    onClick={() => setPaymentOverlay(null)}
                    className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-mono tracking-wider text-xs font-bold rounded-lg transition cursor-pointer"
                    id="close-success-payment"
                  >
                    COMPLETE & CLOSE
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY PANEL 2: RECEIPT ZOOM MODAL STAGE */}
      {receiptToShow && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white dark:bg-zinc-950 border-2 border-dashed border-slate-300 dark:border-zinc-900 rounded-3xl w-full max-w-md p-7 relative shadow-2xl text-left font-mono text-[9px] text-slate-500 tracking-wide uppercase leading-relaxed">
            
            <div className="text-center space-y-2 pb-4 border-b-2 border-dashed border-slate-200 dark:border-zinc-900">
              <span className="text-lg font-black tracking-widest text-slate-900 dark:text-white font-sans">AFRIWAID STUDIO LTD</span>
              <p className="text-[8px] text-slate-400">COSMIC STAND-UP CREDENTIAL RESERVED LOGS</p>
              <div className="inline-block px-2 py-0.5 bg-emerald-500/15 text-emerald-500 font-sans text-[8px] font-bold rounded-full border border-emerald-500/30">
                ✔ TRANSACTION CLEARANCE VERIFIED
              </div>
            </div>

            <div className="space-y-3 py-6 font-mono text-[10px] text-slate-800 dark:text-zinc-300">
              <div className="flex justify-between">
                <span>Receipt token:</span>
                <span className="font-bold text-slate-950 dark:text-white">tx_98dd4a081bcce4</span>
              </div>
              <div className="flex justify-between">
                <span>Invoice Ref:</span>
                <span className="font-bold text-slate-950 dark:text-white">#{receiptToShow.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Clear Date:</span>
                <span className="font-bold text-slate-950 dark:text-white">{new Date().toISOString().split("T")[0]}</span>
              </div>
              <div className="flex justify-between">
                <span>System gateway:</span>
                <span className="font-bold text-cyan-400">ledger_wire_verif_v3</span>
              </div>
              <div className="flex justify-between">
                <span>Assigned Node:</span>
                <span className="font-bold text-slate-955 dark:text-white">{loggedInClient.id}</span>
              </div>
              
              <div className="border-t border-slate-200 dark:border-zinc-900 pt-3 my-2 flex justify-between text-xs font-black">
                <span className="text-slate-500 font-bold">WIRE CLEARED AMOUNT & TAX:</span>
                <span className="text-cyan-500">{receiptToShow.amount}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-zinc-900/40 rounded-xl space-y-1 font-sans text-slate-500 text-[8.5px] leading-relaxed border border-slate-150 dark:border-zinc-900/50">
              <p className="font-bold text-slate-800 dark:text-zinc-250">Cryptographic Signature Proof:</p>
              <p className="break-all text-[8px] opacity-75 font-mono">0x2fc9B1cA904eBEF8Adbf4369f6f69CeCdDE70fBA904ddfcbaf4339420011</p>
            </div>

            <div className="flex gap-2 pt-5">
              <button 
                onClick={() => setReceiptToShow(null)}
                className="flex-1 py-2 text-center bg-slate-900 dark:bg-zinc-900 hover:bg-slate-850 dark:hover:bg-zinc-800 text-white font-sans font-bold text-[10px] uppercase rounded-xl transition cursor-pointer"
                id="close-receipt-btn"
              >
                DISMISS RECORD
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
