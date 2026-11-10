"use client";

import { useState } from "react";
import { Download, RefreshCw, Save, ShieldAlert } from "lucide-react";
import { useDemoStore } from "@/lib/store";
import { useToast } from "@/lib/toast";

export default function AdminSettingsPage() {
  const settings = useDemoStore((s) => s.settings);
  const updateSettings = useDemoStore((s) => s.updateSettings);
  const resetDemo = useDemoStore((s) => s.resetDemo);
  const products = useDemoStore((s) => s.products);
  const showToast = useToast((s) => s.show);

  const [makerName, setMakerName] = useState(settings.makerName);
  const [retailName, setRetailName] = useState(settings.retailName);
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber);
  const [phoneDisplay, setPhoneDisplay] = useState(settings.phoneDisplay);
  const [email, setEmail] = useState(settings.email);
  const [deliveryNote, setDeliveryNote] = useState(settings.deliveryNote);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      makerName: makerName.trim(),
      retailName: retailName.trim(),
      showRetailName: true,
      whatsappNumber: whatsappNumber.replace(/\D/g, ""),
      phoneDisplay: phoneDisplay.trim(),
      email: email.trim(),
      instagramMaker: settings.instagramMaker,
      instagramRetail: settings.instagramRetail,
      deliveryNote: deliveryNote.trim(),
    });
    showToast("Brand and contact settings updated.");
  };

  const handleReset = () => {
    if (confirm("Reset demo data? This will restore the original catalogue, re-seed sample orders, and clear custom changes.")) {
      resetDemo();
      showToast("Demo data successfully reset to initial seed state.");
      setTimeout(() => window.location.reload(), 400);
    }
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `kris-designs-catalogue-${new Date().toISOString().slice(0, 10)}.json`);
    dlAnchor.click();
    showToast("Exported catalogue JSON.");
  };

  return (
    <div className="space-y-10 max-w-4xl">
      <div className="border-b border-espresso/15 pb-6">
        <span className="eyebrow">Studio Configuration</span>
        <h1 className="font-display text-3xl text-espresso mt-1">Settings & Backups</h1>
        <p className="text-xs text-charcoal/70 mt-1">
          Configure maker branding, update WhatsApp contact routing, or reset the local demo database.
        </p>
      </div>

      {/* Brand & Contact Form */}
      <form onSubmit={handleSave} className="border border-espresso/15 bg-ivory p-6 sm:p-8 rounded-xs space-y-6">
        <h2 className="font-display text-xl text-espresso">Brand & Contact Settings</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="field-label">Maker / Artisan Name</label>
            <input
              type="text"
              value={makerName}
              onChange={(e) => setMakerName(e.target.value)}
              className="field-input text-xs"
              required
            />
          </div>

          <div>
            <label className="field-label">Retail Catalogue Name</label>
            <input
              type="text"
              value={retailName}
              onChange={(e) => setRetailName(e.target.value)}
              className="field-input text-xs"
              required
            />
          </div>

          <div>
            <label className="field-label">WhatsApp Number (Digits with country code)</label>
            <input
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="918951989891"
              className="field-input font-mono text-xs"
              required
            />
          </div>

          <div>
            <label className="field-label">Display Phone Number</label>
            <input
              type="text"
              value={phoneDisplay}
              onChange={(e) => setPhoneDisplay(e.target.value)}
              placeholder="+91 89519 89891"
              className="field-input text-xs"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="field-label">Studio Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field-input text-xs"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="field-label">Default Delivery Note</label>
            <input
              type="text"
              value={deliveryNote}
              onChange={(e) => setDeliveryNote(e.target.value)}
              className="field-input text-xs"
              required
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button type="submit" className="btn btn-solid btn-sm inline-flex items-center gap-1.5">
            <Save size={14} />
            <span>Save Settings</span>
          </button>
        </div>
      </form>

      {/* Database Actions */}
      <div className="border border-espresso/15 bg-ivory p-6 sm:p-8 rounded-xs space-y-6">
        <h2 className="font-display text-xl text-espresso">Data Backups & Reset</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Export JSON */}
          <div className="border border-espresso/12 bg-paper p-5 rounded-xs flex flex-col justify-between">
            <div>
              <p className="font-semibold text-espresso text-xs uppercase tracking-wider">Export Catalogue</p>
              <p className="mt-1 text-xs text-charcoal/70 leading-relaxed">
                Download the current 40 pieces including all modifications as a clean JSON file.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportJson}
              className="btn btn-outline btn-sm mt-4 inline-flex items-center gap-1.5 self-start"
            >
              <Download size={14} />
              Export products.json
            </button>
          </div>

          {/* Reset Demo Data */}
          <div className="border border-[#8e2f2a]/20 bg-paper p-5 rounded-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-[#8e2f2a]">
                <ShieldAlert size={16} />
                <p className="font-semibold text-xs uppercase tracking-wider">Reset Store State</p>
              </div>
              <p className="mt-1 text-xs text-charcoal/70 leading-relaxed">
                Restores the original 40 products from seeds, resets demo stock quantities, and clears local order history.
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="btn btn-outline btn-sm mt-4 border-[#8e2f2a]/40 text-[#8e2f2a] hover:bg-[#8e2f2a] hover:text-ivory inline-flex items-center gap-1.5 self-start"
            >
              <RefreshCw size={14} />
              Reset Demo Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
