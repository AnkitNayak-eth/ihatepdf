'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileDown, RefreshCw, Terminal, ShieldAlert, Lock, Unlock,
  Eye, EyeOff, FileUp, Send, Search, Copy, Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Crypto helpers (AES-256-GCM via Web Crypto API) ───
const SALT_LEN = 16;
const IV_LEN = 12;

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

async function encryptMessage(plaintext: string, password: string): Promise<string> {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LEN));
  const iv = crypto.getRandomValues(new Uint8Array(IV_LEN));
  const key = await deriveKey(password, salt);
  const cipherBuf = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(plaintext)
  );
  // concat: salt + iv + ciphertext → base64
  const out = new Uint8Array(SALT_LEN + IV_LEN + cipherBuf.byteLength);
  out.set(salt, 0);
  out.set(iv, SALT_LEN);
  out.set(new Uint8Array(cipherBuf), SALT_LEN + IV_LEN);
  return btoa(String.fromCharCode(...out));
}

async function decryptMessage(b64: string, password: string): Promise<string> {
  const raw = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
  const salt = raw.slice(0, SALT_LEN);
  const iv = raw.slice(SALT_LEN, SALT_LEN + IV_LEN);
  const ciphertext = raw.slice(SALT_LEN + IV_LEN);
  const key = await deriveKey(password, salt);
  const plainBuf = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext
  );
  return new TextDecoder().decode(plainBuf);
}

// ─── PDF embedding / extraction helpers ───
// We hide the payload as a custom PDF metadata key inside a
// specially-named invisible annotation and also as a custom
// info dict entry using pdf-lib.

// Marker used to identify our hidden payload in the raw PDF bytes
const STEG_MARKER_START = '%%IHPDF_STEG_START%%';
const STEG_MARKER_END = '%%IHPDF_STEG_END%%';

type Tab = 'HIDE' | 'EXTRACT';

export default function Steganography() {
  // Shared
  const [tab, setTab] = useState<Tab>('HIDE');
  const [processing, setProcessing] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  // Hide tab
  const [hideFile, setHideFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [usePassword, setUsePassword] = useState(true);
  const [password, setPassword] = useState('');
  const [hideResultUrl, setHideResultUrl] = useState<string | null>(null);
  const [hideIsHovering, setHideIsHovering] = useState(false);

  // Extract tab
  const [extractFile, setExtractFile] = useState<File | null>(null);
  const [extractPassword, setExtractPassword] = useState('');
  const [extractedMessage, setExtractedMessage] = useState<string | null>(null);
  const [extractIsHovering, setExtractIsHovering] = useState(false);
  const [copied, setCopied] = useState(false);

  const hideInputRef = useRef<HTMLInputElement>(null);
  const extractInputRef = useRef<HTMLInputElement>(null);

  const addLog = (msg: string) => setLogs(prev => [msg, ...prev].slice(0, 8));

  // ─── HIDE ───
  const handleHide = async () => {
    if (!hideFile || !message.trim()) return;
    if (usePassword && !password.trim()) return;
    setProcessing(true);
    setLogs([]);

    try {
      addLog('Loading carrier document...');
      const arrayBuffer = await hideFile.arrayBuffer();

      addLog(usePassword ? 'Encrypting payload with AES-256-GCM...' : 'Encoding payload (no encryption)...');
      let payload: string;
      if (usePassword) {
        payload = await encryptMessage(message, password);
      } else {
        payload = btoa(unescape(encodeURIComponent(message)));
      }

      addLog('Injecting into PDF structure...');
      // We inject the payload as a PDF comment block at the end of the file
      // PDF spec allows comments (starting with %) anywhere — readers ignore them
      const srcBytes = new Uint8Array(arrayBuffer);
      const encoder = new TextEncoder();
      const commentBlock = encoder.encode(
        `\n${STEG_MARKER_START}\n% ${payload}\n${STEG_MARKER_END}\n`
      );

      // Also inject via pdf-lib metadata for redundancy
      const { PDFDocument } = await import('pdf-lib');
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

      // Store in custom metadata — this survives most PDF tools
      pdfDoc.setKeywords([`IHPDF_STEG:${payload}`]);
      // Preserve existing subject, append our marker
      const existingSubject = pdfDoc.getSubject() || '';

      const pdfBytes = await pdfDoc.save();

      // Append comment block after the saved bytes
      const finalBytes = new Uint8Array(pdfBytes.length + commentBlock.length);
      finalBytes.set(pdfBytes, 0);
      finalBytes.set(commentBlock, pdfBytes.length);

      const blob = new Blob([finalBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      addLog(`Payload hidden (${payload.length} chars encoded).`);
      addLog('Steganographic injection complete.');

      setTimeout(() => {
        setHideResultUrl(url);
        setProcessing(false);
      }, 800);
    } catch (err) {
      console.error(err);
      addLog(`ERROR: ${err instanceof Error ? err.message : 'Unknown'}`);
      setProcessing(false);
    }
  };

  // ─── EXTRACT ───
  const handleExtract = async () => {
    if (!extractFile) return;
    setProcessing(true);
    setLogs([]);
    setExtractedMessage(null);

    try {
      addLog('Scanning document for hidden payloads...');
      const arrayBuffer = await extractFile.arrayBuffer();
      const text = new TextDecoder('latin1').decode(new Uint8Array(arrayBuffer));

      let payload: string | null = null;

      // Method 1: Check for our comment block marker
      const startIdx = text.indexOf(STEG_MARKER_START);
      const endIdx = text.indexOf(STEG_MARKER_END);
      if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
        const block = text.slice(startIdx + STEG_MARKER_START.length, endIdx).trim();
        // Remove the leading "% "
        payload = block.startsWith('% ') ? block.slice(2).trim() : block.trim();
        addLog('Found payload in comment block.');
      }

      // Method 2: Check keywords metadata
      if (!payload) {
        const kwMatch = text.match(/IHPDF_STEG:([A-Za-z0-9+/=]+)/);
        if (kwMatch) {
          payload = kwMatch[1];
          addLog('Found payload in metadata keywords.');
        }
      }

      if (!payload) {
        addLog('ERROR: No hidden payload found in this document.');
        setProcessing(false);
        return;
      }

      addLog('Payload located. Attempting decode...');

      // Try to determine if it's encrypted or not
      // Encrypted payloads are longer (salt+iv+ciphertext) and always base64
      // Unencrypted payloads are just base64 of the plain text
      let decoded: string | null = null;

      if (extractPassword.trim()) {
        // User provided a password — try decrypt
        addLog('Decrypting with provided password...');
        try {
          decoded = await decryptMessage(payload, extractPassword);
          addLog('Decryption successful!');
        } catch {
          addLog('ERROR: Decryption failed. Wrong password or payload is not encrypted.');
          setProcessing(false);
          return;
        }
      } else {
        // No password — try plain base64 decode
        addLog('Attempting unencrypted decode...');
        try {
          decoded = decodeURIComponent(escape(atob(payload)));
          addLog('Decoded successfully (no encryption).');
        } catch {
          addLog('ERROR: Payload appears encrypted. A password is required.');
          setProcessing(false);
          return;
        }
      }

      setTimeout(() => {
        setExtractedMessage(decoded);
        setProcessing(false);
        addLog('Extraction complete.');
      }, 500);
    } catch (err) {
      console.error(err);
      addLog(`ERROR: ${err instanceof Error ? err.message : 'Unknown'}`);
      setProcessing(false);
    }
  };

  const copyToClipboard = () => {
    if (extractedMessage) {
      navigator.clipboard.writeText(extractedMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resetHide = () => {
    setHideFile(null);
    setHideResultUrl(null);
    setMessage('');
    setPassword('');
    setLogs([]);
  };

  const resetExtract = () => {
    setExtractFile(null);
    setExtractedMessage(null);
    setExtractPassword('');
    setLogs([]);
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl border border-white/10 bg-black/40 p-8 lg:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl relative overflow-hidden group">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-brand/20 transition-all duration-700" />

      {/* Tab Switcher */}
      <div className="relative z-10 flex gap-2 mb-8 p-1 rounded-xl bg-white/5 border border-white/5">
        <button
          onClick={() => { setTab('HIDE'); setLogs([]); }}
          className={cn(
            "flex-1 py-3 px-4 rounded-lg font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2",
            tab === 'HIDE'
              ? "bg-brand text-white shadow-[0_0_20px_rgba(230,25,25,0.3)]"
              : "text-zinc-500 hover:text-white hover:bg-white/5"
          )}
        >
          <EyeOff size={16} /> Hide Message
        </button>
        <button
          onClick={() => { setTab('EXTRACT'); setLogs([]); }}
          className={cn(
            "flex-1 py-3 px-4 rounded-lg font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2",
            tab === 'EXTRACT'
              ? "bg-brand text-white shadow-[0_0_20px_rgba(230,25,25,0.3)]"
              : "text-zinc-500 hover:text-white hover:bg-white/5"
          )}
        >
          <Eye size={16} /> Extract Message
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* ═══════════════════ HIDE TAB ═══════════════════ */}
        {tab === 'HIDE' && !hideResultUrl && (
          <motion.div key="hide" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-8 relative z-10">
            <div className="text-center">
              <h2 className="text-3xl font-black text-white mb-2 flex items-center justify-center gap-3 italic">
                <ShieldAlert className="text-brand w-8 h-8" /> SECRET EMBEDDER
              </h2>
              <p className="text-zinc-500">Hide a secret message inside any PDF. Only you can extract it.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left: File + Message */}
              <div className="flex flex-col gap-5">
                <div
                  className={cn(
                    "relative border-2 border-dashed border-white/10 rounded-2xl p-6 text-center cursor-pointer transition-all h-[140px] flex flex-col items-center justify-center",
                    hideIsHovering ? "border-brand bg-brand/5 scale-[1.01]" : "hover:border-white/20 hover:bg-white/5",
                    hideFile ? "border-brand/40 bg-brand/5" : ""
                  )}
                  onDragOver={(e) => { e.preventDefault(); setHideIsHovering(true); }}
                  onDragLeave={() => setHideIsHovering(false)}
                  onDrop={(e) => {
                    e.preventDefault(); setHideIsHovering(false);
                    if (e.dataTransfer.files?.[0]) { setHideFile(e.dataTransfer.files[0]); setHideResultUrl(null); }
                  }}
                  onClick={() => hideInputRef.current?.click()}
                >
                  <input type="file" accept=".pdf" className="hidden" ref={hideInputRef} onChange={(e) => { if (e.target.files?.[0]) { setHideFile(e.target.files[0]); setHideResultUrl(null); } }} />
                  <FileUp className={cn("h-7 w-7 mb-2 text-white/20", hideFile ? "text-brand" : "")} />
                  <p className="text-sm font-bold text-white/80">{hideFile ? hideFile.name : "Drop carrier PDF"}</p>
                  {hideFile && <p className="text-[10px] text-zinc-600 mt-1">{(hideFile.size / 1024).toFixed(1)} KB</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block">Secret Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your secret message here..."
                    rows={5}
                    className="w-full bg-black/60 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-zinc-600 focus:border-brand outline-none transition-all resize-none font-mono"
                  />
                  <p className="text-[9px] text-zinc-600 text-right">{message.length} characters</p>
                </div>

                {/* Kill Log */}
                <div className="bg-black/60 rounded-2xl p-4 border border-white/5 font-mono text-[10px] space-y-1 h-[120px] overflow-hidden">
                  <div className="flex items-center gap-2 text-brand mb-2 border-b border-white/5 pb-1 uppercase font-black tracking-widest text-[9px]">
                    <Terminal size={10} /> Injection Log
                  </div>
                  {logs.length > 0 ? logs.map((log, i) => (
                    <div key={i} className={cn(i === 0 ? "text-white" : "text-zinc-600")}>{`> ${log}`}</div>
                  )) : (
                    <div className="text-zinc-700 italic">Waiting for injection...</div>
                  )}
                </div>
              </div>

              {/* Right: Settings */}
              <div className="bg-white/5 rounded-2xl p-6 space-y-6 border border-white/5 flex flex-col">
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block">Protection Level</label>

                  <button
                    onClick={() => setUsePassword(true)}
                    className={cn(
                      "w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all",
                      usePassword
                        ? "bg-brand/10 border-brand/50 ring-1 ring-brand/30"
                        : "bg-white/5 border-white/10 hover:border-white/20"
                    )}
                  >
                    <div className={cn("p-2 rounded-lg shrink-0", usePassword ? "bg-brand text-white" : "bg-white/10 text-zinc-400")}>
                      <Lock size={14} />
                    </div>
                    <div>
                      <span className={cn("text-xs font-black uppercase block", usePassword ? "text-white" : "text-zinc-500")}>Password Protected</span>
                      <p className="text-[9px] text-zinc-500 leading-tight">AES-256-GCM encryption. Recipient needs the password.</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setUsePassword(false)}
                    className={cn(
                      "w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all",
                      !usePassword
                        ? "bg-brand/10 border-brand/50 ring-1 ring-brand/30"
                        : "bg-white/5 border-white/10 hover:border-white/20"
                    )}
                  >
                    <div className={cn("p-2 rounded-lg shrink-0", !usePassword ? "bg-brand text-white" : "bg-white/10 text-zinc-400")}>
                      <Unlock size={14} />
                    </div>
                    <div>
                      <span className={cn("text-xs font-black uppercase block", !usePassword ? "text-white" : "text-zinc-500")}>No Password</span>
                      <p className="text-[9px] text-zinc-500 leading-tight">Base64 encoded only. Anyone with the tool can extract.</p>
                    </div>
                  </button>
                </div>

                {usePassword && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold flex items-center gap-1.5">
                      <Lock size={10} /> Encryption Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter a strong password..."
                      className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-brand outline-none transition-all"
                    />
                  </motion.div>
                )}

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 mt-auto">
                  <p className="text-[10px] text-zinc-400 leading-relaxed">
                    🔒 The message is embedded as invisible structural data inside the PDF. The file opens and renders normally — no visual difference. Only this tool can extract the hidden payload.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleHide}
              disabled={!hideFile || !message.trim() || processing || (usePassword && !password.trim())}
              className="relative group/btn overflow-hidden w-full rounded-2xl bg-brand py-5 text-xl font-black text-white transition-all hover:bg-brand-hover active:scale-[0.98] disabled:bg-zinc-800 disabled:text-zinc-600 shadow-[0_0_40px_rgba(230,25,25,0.2)] mt-4"
            >
              <div className="flex items-center justify-center gap-3 relative z-10 uppercase tracking-tighter italic">
                {processing ? (
                  <><RefreshCw className="h-6 w-6 animate-spin" /> Injecting payload...</>
                ) : (
                  <><Send className="h-6 w-6" /> Hide Message in PDF</>
                )}
              </div>
            </button>
          </motion.div>
        )}

        {/* Hide success */}
        {tab === 'HIDE' && hideResultUrl && (
          <motion.div key="hide-done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-8 text-center relative z-10">
            <div className="w-20 h-20 bg-brand/20 rounded-2xl rotate-3 flex items-center justify-center mb-8 border border-brand/50 shadow-[0_0_40px_rgba(230,25,25,0.3)]">
              <ShieldAlert size={40} className="text-brand" />
            </div>
            <h3 className="text-4xl font-black text-white mb-4 uppercase italic">Payload Embedded</h3>
            <p className="text-zinc-400 mb-3 max-w-md">
              Your secret message has been injected into the PDF. The document looks and functions identically.
            </p>
            {usePassword && (
              <p className="text-brand/80 text-sm mb-6 flex items-center gap-2">
                <Lock size={14} /> AES-256-GCM encrypted — password required to extract
              </p>
            )}
            {!usePassword && (
              <p className="text-zinc-500 text-sm mb-6 flex items-center gap-2">
                <Unlock size={14} /> No encryption — extract without password
              </p>
            )}
            <div className="flex w-full flex-col sm:flex-row gap-4 max-w-md">
              <a
                href={hideResultUrl}
                download={`steg_${hideFile?.name}`}
                className="flex-[2] py-5 px-8 rounded-2xl bg-white text-black font-black text-xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
              >
                <FileDown className="h-6 w-6" /> Download
              </a>
              <button
                onClick={resetHide}
                className="flex-1 py-5 px-8 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
              >
                Reset
              </button>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════ EXTRACT TAB ═══════════════════ */}
        {tab === 'EXTRACT' && !extractedMessage && (
          <motion.div key="extract" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex flex-col gap-8 relative z-10">
            <div className="text-center">
              <h2 className="text-3xl font-black text-white mb-2 flex items-center justify-center gap-3 italic">
                <Search className="text-brand w-8 h-8" /> EXTRACT
              </h2>
              <p className="text-zinc-500">Scan a PDF for hidden steganographic payloads and decode them.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="flex flex-col gap-5">
                <div
                  className={cn(
                    "relative border-2 border-dashed border-white/10 rounded-2xl p-8 text-center cursor-pointer transition-all h-[200px] flex flex-col items-center justify-center",
                    extractIsHovering ? "border-brand bg-brand/5 scale-[1.01]" : "hover:border-white/20 hover:bg-white/5",
                    extractFile ? "border-brand/40 bg-brand/5" : ""
                  )}
                  onDragOver={(e) => { e.preventDefault(); setExtractIsHovering(true); }}
                  onDragLeave={() => setExtractIsHovering(false)}
                  onDrop={(e) => {
                    e.preventDefault(); setExtractIsHovering(false);
                    if (e.dataTransfer.files?.[0]) { setExtractFile(e.dataTransfer.files[0]); setExtractedMessage(null); }
                  }}
                  onClick={() => extractInputRef.current?.click()}
                >
                  <input type="file" accept=".pdf" className="hidden" ref={extractInputRef} onChange={(e) => { if (e.target.files?.[0]) { setExtractFile(e.target.files[0]); setExtractedMessage(null); } }} />
                  <Search className={cn("h-8 w-8 mb-3 text-white/20", extractFile ? "text-brand" : "")} />
                  <p className="text-lg font-bold text-white/80">{extractFile ? extractFile.name : "Drop suspect PDF"}</p>
                  {extractFile && <p className="text-xs text-zinc-600 mt-1">{(extractFile.size / 1024).toFixed(1)} KB</p>}
                </div>

                {/* Kill Log */}
                <div className="bg-black/60 rounded-2xl p-4 border border-white/5 font-mono text-[10px] space-y-1 h-[160px] overflow-hidden">
                  <div className="flex items-center gap-2 text-brand mb-2 border-b border-white/5 pb-1 uppercase font-black tracking-widest text-[9px]">
                    <Terminal size={10} /> Scan Log
                  </div>
                  {logs.length > 0 ? logs.map((log, i) => (
                    <div key={i} className={cn(i === 0 ? "text-white" : "text-zinc-600")}>{`> ${log}`}</div>
                  )) : (
                    <div className="text-zinc-700 italic">Waiting for scan...</div>
                  )}
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-6 space-y-6 border border-white/5 flex flex-col">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold flex items-center gap-1.5">
                    <Lock size={10} /> Decryption Password (if encrypted)
                  </label>
                  <input
                    type="password"
                    value={extractPassword}
                    onChange={(e) => setExtractPassword(e.target.value)}
                    placeholder="Leave blank if no encryption..."
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-brand outline-none transition-all"
                  />
                  <p className="text-[9px] text-zinc-500">If the payload was hidden without a password, leave this empty.</p>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/5 mt-auto">
                  <p className="text-[10px] text-zinc-400 leading-relaxed">
                    🔍 The extractor scans for hidden payloads in PDF comment blocks and metadata keywords. If a password was used during embedding, you must provide the exact same password to decrypt.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleExtract}
              disabled={!extractFile || processing}
              className="relative group/btn overflow-hidden w-full rounded-2xl bg-brand py-5 text-xl font-black text-white transition-all hover:bg-brand-hover active:scale-[0.98] disabled:bg-zinc-800 disabled:text-zinc-600 shadow-[0_0_40px_rgba(230,25,25,0.2)] mt-4"
            >
              <div className="flex items-center justify-center gap-3 relative z-10 uppercase tracking-tighter italic">
                {processing ? (
                  <><RefreshCw className="h-6 w-6 animate-spin" /> Scanning document...</>
                ) : (
                  <><Search className="h-6 w-6" /> Scan &amp; Extract</>
                )}
              </div>
            </button>
          </motion.div>
        )}

        {/* Extract success */}
        {tab === 'EXTRACT' && extractedMessage && (
          <motion.div key="extract-done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-8 relative z-10">
            <div className="w-20 h-20 bg-brand/20 rounded-2xl rotate-3 flex items-center justify-center mb-8 border border-brand/50 shadow-[0_0_40px_rgba(230,25,25,0.3)]">
              <Eye size={40} className="text-brand" />
            </div>
            <h3 className="text-4xl font-black text-white mb-2 uppercase italic text-center">Message Recovered</h3>
            <p className="text-zinc-500 mb-8 text-sm">Hidden payload successfully extracted and decoded.</p>

            <div className="w-full max-w-lg relative">
              <div className="bg-black/60 border border-brand/30 rounded-2xl p-6 font-mono text-sm text-white leading-relaxed whitespace-pre-wrap break-words max-h-[300px] overflow-y-auto">
                {extractedMessage}
              </div>
              <button
                onClick={copyToClipboard}
                className="absolute top-3 right-3 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
                title="Copy to clipboard"
              >
                {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
              </button>
            </div>

            <button
              onClick={resetExtract}
              className="mt-8 py-4 px-10 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
            >
              Scan Another
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
