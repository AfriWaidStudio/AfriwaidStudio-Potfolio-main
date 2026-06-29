import React from "react";
import { 
  ShieldCheck, Eye, EyeOff, Copy, Check, Terminal, Wifi, ChevronRight, Loader2
} from "lucide-react";

interface SecurityCredentialsProps {
  tokenVisible: boolean;
  setTokenVisible: (visible: boolean) => void;
  copiedToken: boolean;
  setCopiedToken: (copied: boolean) => void;
  generatedKey: string;
  sshNodes: { region: string; ip: string; protocol: string; service: string }[];
  profileFirstName: string;
  setProfileFirstName: (v: string) => void;
  profileLastName: string;
  setProfileLastName: (v: string) => void;
  profileUsername: string;
  setProfileUsername: (v: string) => void;
  profileMsg: string;
  setProfileMsg: (msg: string) => void;
  profileErr: string;
  setProfileErr: (err: string) => void;
  profileLoading: boolean;
  handleSaveProfileDetails: (e: React.FormEvent) => void;
}

export default function SecurityCredentials({
  tokenVisible,
  setTokenVisible,
  copiedToken,
  setCopiedToken,
  generatedKey,
  sshNodes,
  profileFirstName,
  setProfileFirstName,
  profileLastName,
  setProfileLastName,
  profileUsername,
  setProfileUsername,
  profileMsg,
  profileErr,
  profileLoading,
  handleSaveProfileDetails
}: SecurityCredentialsProps) {

  const handleCopyToken = () => {
    navigator.clipboard.writeText(generatedKey);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn text-left">
      
      {/* Visual Success notification for save profiles */}
      {profileMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl flex items-center gap-2 font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{profileMsg}</span>
        </div>
      )}

      {profileErr && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs rounded-xl flex items-center gap-2 font-mono">
          <span>Failed: {profileErr}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        
        {/* Left Side: API Secrets and active SSH Nodes - 7 cols */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* SECURE API TOKENS */}
          <div className="bg-slate-50 dark:bg-zinc-950/40 border border-slate-201 dark:border-neutral-900 rounded-2xl p-6 space-y-4">
            <div className="border-b border-slate-200 dark:border-zinc-900 pb-3 flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-90 w-auto hover:bg-slate-105 dark:bg-zinc-900 border border-slate-250 dark:border-zinc-800 flex items-center justify-center text-cyan-400">
                <Terminal className="w-4 h-4" />
              </span>
              <div className="text-left">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase font-mono tracking-widest">Client Access Secret Key</h3>
                <p className="text-[10px] text-slate-505 mt-0.5">Automate workflow callbacks, JSON reports, or CI deployments via SDKs.</p>
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-zinc-950 border border-slate-201 dark:border-zinc-900 rounded-xl space-y-3">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[8.5px] font-mono text-slate-400">LIVE INTEGRATION KEY</span>
                <span className="text-[8.5px] bg-red-500/10 text-red-500 font-mono font-bold uppercase px-1 rounded">Do not distribute keys</span>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 bg-slate-100 dark:bg-black border border-slate-200 dark:border-zinc-900 px-3.5 py-3 rounded-lg flex items-center justify-between gap-3 font-mono min-w-0">
                  <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200 truncate select-all">
                    {tokenVisible ? generatedKey : "••••••••••••••••••••••••••••••••••••••••"}
                  </span>
                  
                  <div className="flex items-center gap-1 shrink-0">
                    <button 
                      type="button"
                      onClick={() => setTokenVisible(!tokenVisible)}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-zinc-900 rounded text-slate-400 transition cursor-pointer"
                      title={tokenVisible ? "Hide Secret Key" : "Display Secret Key"}
                    >
                      {tokenVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button 
                      type="button"
                      onClick={handleCopyToken}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-zinc-900 rounded text-slate-400 transition cursor-pointer"
                      title="Copy Key to clipboard"
                    >
                      {copiedToken ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 leading-normal font-sans">
                Authenticate JSON API gateways by mapping this string onto the custom <code className="p-0.5 bg-slate-100 dark:bg-zinc-900 font-mono rounded text-[9px] text-cyan-500">Authorization: Bearer</code> header logs.
              </p>
            </div>
          </div>

          {/* ACTIVE SSH CONTAINERS / ENDPOINTS */}
          <div className="bg-slate-50 dark:bg-zinc-950/40 border border-slate-201 dark:border-neutral-900 rounded-2xl p-6 space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase font-mono tracking-widest">SSL Sandbox Node Registrations</h3>
              <p className="text-[10px] mt-0.5 text-slate-505 font-sans">Deployment container registers tracking active TLS sessions.</p>
            </div>

            <div className="space-y-3">
              {sshNodes.map((node, nIdx) => (
                <div key={nIdx} className="p-3.5 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900 rounded-xl flex items-center justify-between gap-4 font-mono text-[10px]">
                  <div className="text-left space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-extrabold text-slate-900 dark:text-slate-100">{node.region}</span>
                    </div>
                    <p className="text-[9px] text-slate-450">{node.service} container registration</p>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="font-bold text-cyan-400 block">{node.ip}</span>
                    <span className="text-[8.5px] bg-slate-100 dark:bg-zinc-900 px-1 py-0.5 rounded text-slate-500">{node.protocol}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Identity Core Settings Form - 5 cols */}
        <div className="lg:col-span-5 bg-slate-50 dark:bg-zinc-950/40 border border-slate-201 dark:border-neutral-900 rounded-2xl p-6 space-y-4">
          <div className="border-b border-slate-200 dark:border-zinc-900 pb-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase font-mono tracking-widest">Identity Core Registry</h3>
            <p className="text-[10px] text-slate-550 mt-0.5">Manage secure federated credentials stored in account cache.</p>
          </div>

          <form onSubmit={handleSaveProfileDetails} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 text-left">
                <label className="text-[9px] text-slate-400 dark:text-zinc-500 uppercase tracking-widest font-mono font-bold">First Name</label>
                <input 
                  type="text" 
                  value={profileFirstName}
                  onChange={(e) => setProfileFirstName(e.target.value)}
                  className="w-full p-2.5 bg-white dark:bg-zinc-950 border border-slate-201 dark:border-zinc-900 rounded-xl text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:outline-none focus:border-cyan-500/50"
                  placeholder="Set first name..."
                  id="profile-fn-input"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-[9px] text-slate-400 dark:text-zinc-500 uppercase tracking-widest font-mono font-bold">Last Name</label>
                <input 
                  type="text" 
                  value={profileLastName}
                  onChange={(e) => setProfileLastName(e.target.value)}
                  className="w-full p-2.5 bg-white dark:bg-zinc-950 border border-slate-201 dark:border-zinc-900 rounded-xl text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:outline-none focus:border-cyan-500/50"
                  placeholder="Set last name..."
                  id="profile-ln-input"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-[9px] text-slate-400 dark:text-zinc-500 uppercase tracking-widest font-mono font-bold">Workspace Username ID</label>
              <input 
                type="text" 
                value={profileUsername}
                onChange={(e) => setProfileUsername(e.target.value)}
                className="w-full p-2.5 bg-white dark:bg-zinc-950 border border-slate-201 dark:border-zinc-900 rounded-xl text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:outline-none focus:border-cyan-500/50 font-mono"
                placeholder="Set ID handles..."
                id="profile-username-input"
              />
              <p className="text-[8.5px] text-slate-450 italic">Username handles route direct mentions in DM support channels.</p>
            </div>

            <button
              type="submit"
              disabled={profileLoading}
              className="w-full py-3 bg-slate-950 dark:bg-zinc-900 hover:bg-cyan-500 hover:text-black dark:hover:bg-cyan-500 dark:hover:text-black text-slate-300 font-bold uppercase tracking-wider rounded-xl transition text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              id="profile-save-btn"
            >
              {profileLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-405 shrink-0" />
                  <span>Saving Crypt Ledger...</span>
                </>
              ) : (
                <span>Update Client Profile</span>
              )}
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
