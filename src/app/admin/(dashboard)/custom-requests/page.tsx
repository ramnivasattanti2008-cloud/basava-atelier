"use client";

import { useMemo, useState } from "react";
import { Check, ChevronRight, MessageCircle, Sparkles, X } from "lucide-react";
import type { CustomEnquiry, EnquiryStatus } from "@/lib/types";
import { formatDate, enquiryStatusLabel } from "@/lib/format";
import { useDemoStore } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { whatsappLink } from "@/lib/whatsapp";
import { Overlay } from "@/components/ui/Overlay";

const statuses: EnquiryStatus[] = [
  "new",
  "reviewing",
  "quoted",
  "in_progress",
  "completed",
  "declined",
];

export default function AdminCustomRequestsPage() {
  const enquiries = useDemoStore((s) => s.enquiries);
  const updateEnquiry = useDemoStore((s) => s.updateEnquiry);
  const showToast = useToast((s) => s.show);

  const [filter, setFilter] = useState<string>("all");
  const [selectedEnquiry, setSelectedEnquiry] = useState<CustomEnquiry | null>(null);
  const [internalNote, setInternalNote] = useState("");

  const filtered = useMemo(() => {
    if (filter === "all") return enquiries;
    return enquiries.filter((e) => e.status === filter);
  }, [enquiries, filter]);

  const openDrawer = (enq: CustomEnquiry) => {
    setSelectedEnquiry(enq);
    setInternalNote(enq.internalNote || "");
  };

  const handleStatusChange = (newStatus: EnquiryStatus) => {
    if (!selectedEnquiry) return;
    updateEnquiry(selectedEnquiry.id, { status: newStatus });
    showToast(`Brief #${selectedEnquiry.id} status changed to ${enquiryStatusLabel[newStatus]}.`);
    setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
  };

  const handleSaveNotes = () => {
    if (!selectedEnquiry) return;
    updateEnquiry(selectedEnquiry.id, { internalNote: internalNote.trim() });
    showToast(`Saved notes for #${selectedEnquiry.id}.`);
    setSelectedEnquiry({ ...selectedEnquiry, internalNote: internalNote.trim() });
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-espresso/15 pb-6">
        <div>
          <span className="eyebrow">Bespoke Workshop Queue</span>
          <h1 className="font-display text-3xl text-espresso mt-1">Custom Requests ({enquiries.length})</h1>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap border border-espresso/15 bg-ivory">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
            filter === "all" ? "bg-espresso text-ivory" : "text-charcoal/70 hover:text-espresso"
          }`}
        >
          All ({enquiries.length})
        </button>
        {statuses.map((st) => {
          const count = enquiries.filter((e) => e.status === st).length;
          return (
            <button
              key={st}
              type="button"
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                filter === st ? "bg-espresso text-ivory" : "text-charcoal/70 hover:text-espresso"
              }`}
            >
              {enquiryStatusLabel[st]} ({count})
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="border border-espresso/15 bg-ivory rounded-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-espresso/12 bg-linen/40 text-walnut/70 uppercase tracking-wider text-[0.625rem]">
                <th className="py-3 px-4">Ref ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Piece & Leather</th>
                <th className="py-3 px-4">Monogram</th>
                <th className="py-3 px-4">Target Budget</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-espresso/8">
              {filtered.map((enq) => (
                <tr
                  key={enq.id}
                  onClick={() => openDrawer(enq)}
                  className="hover:bg-paper cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-bold text-espresso">
                    {enq.id}
                    {enq.sample && (
                      <span className="ml-2 font-sans font-normal text-[0.55rem] uppercase text-walnut/60 border border-espresso/20 px-1 py-0.5 rounded-xs">
                        Sample
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-charcoal/70 whitespace-nowrap">
                    {formatDate(enq.createdAt)}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-espresso">{enq.customer.name}</p>
                    <p className="text-[0.6875rem] text-charcoal/60">{enq.customer.phone}</p>
                  </td>
                  <td className="py-3 px-4 text-charcoal/80">
                    <p className="font-medium text-espresso">{enq.productType}</p>
                    <p className="text-[0.6875rem] text-walnut/70">{enq.colour}</p>
                  </td>
                  <td className="py-3 px-4">
                    {enq.engraving && enq.engraving !== "None" ? (
                      <span className="font-mono bg-linen px-2 py-0.5 rounded-xs text-saddle-deep font-bold">
                        {enq.engraving}
                      </span>
                    ) : (
                      <span className="text-charcoal/40">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-medium text-espresso">
                    {enq.budget}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2.5 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wider rounded-xs bg-linen text-espresso">
                      {enquiryStatusLabel[enq.status]}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-xs font-semibold uppercase text-saddle-deep inline-flex items-center gap-1">
                      Manage <ChevronRight size={12} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer */}
      <Overlay
        open={Boolean(selectedEnquiry)}
        onClose={() => setSelectedEnquiry(null)}
        label="Custom Brief Details"
        side="right"
        className="p-6 sm:p-8"
      >
        {selectedEnquiry && (
          <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-6rem)] pr-1 text-xs">
            <div className="flex items-center justify-between border-b border-espresso/15 pb-4">
              <div>
                <span className="eyebrow">Bespoke Request</span>
                <h2 className="font-display text-2xl text-espresso mt-0.5">#{selectedEnquiry.id}</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="flex h-8 w-8 items-center justify-center text-espresso/70 hover:text-espresso"
              >
                <X size={18} />
              </button>
            </div>

            {/* Status Change */}
            <div className="border border-espresso/15 bg-paper p-4 rounded-xs space-y-2">
              <label className="field-label">Update Status</label>
              <select
                value={selectedEnquiry.status}
                onChange={(e) => handleStatusChange(e.target.value as EnquiryStatus)}
                className="field-input font-semibold text-xs"
              >
                {statuses.map((st) => (
                  <option key={st} value={st}>
                    {enquiryStatusLabel[st]}
                  </option>
                ))}
              </select>
            </div>

            {/* WhatsApp to customer */}
            <a
              href={whatsappLink(
                selectedEnquiry.customer.phone,
                `Hello ${selectedEnquiry.customer.name}, regarding your bespoke request #${selectedEnquiry.id} (${selectedEnquiry.productType}) at Kris Designs:`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-solid btn-sm w-full flex items-center justify-center gap-2"
            >
              <MessageCircle size={14} />
              Chat with Customer on WhatsApp
            </a>

            {/* Specification Brief */}
            <div className="border-t border-espresso/12 pt-4 space-y-2 text-charcoal/80">
              <p className="field-label">Custom Specifications</p>
              <div className="grid grid-cols-2 gap-2 bg-paper p-3.5 rounded-xs">
                <div>
                  <span className="text-walnut/70">Silhouette:</span>
                  <p className="font-semibold text-espresso">{selectedEnquiry.productType}</p>
                </div>
                <div>
                  <span className="text-walnut/70">Target Budget:</span>
                  <p className="font-semibold text-espresso">{selectedEnquiry.budget}</p>
                </div>
                <div>
                  <span className="text-walnut/70">Leather & Colour:</span>
                  <p className="font-semibold text-espresso">{selectedEnquiry.colour}</p>
                </div>
                <div>
                  <span className="text-walnut/70">Monogram Tag:</span>
                  <p className="font-semibold text-espresso">{selectedEnquiry.engraving}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-walnut/70">Materials & Details:</span>
                  <p className="text-espresso">{selectedEnquiry.material}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-walnut/70">Dimensions:</span>
                  <p className="text-espresso">{selectedEnquiry.dimensions}</p>
                </div>
              </div>
            </div>

            {/* Customer Requirements */}
            {selectedEnquiry.requirements && (
              <div className="border-t border-espresso/12 pt-4 space-y-1">
                <p className="field-label">Customer Instructions</p>
                <p className="p-3 bg-paper border border-espresso/10 rounded-xs text-charcoal/80 leading-relaxed">
                  {selectedEnquiry.requirements}
                </p>
              </div>
            )}

            {/* Uploaded Reference Images */}
            {selectedEnquiry.images.length > 0 && (
              <div className="border-t border-espresso/12 pt-4 space-y-2">
                <p className="field-label">Reference Attachments ({selectedEnquiry.images.length})</p>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {selectedEnquiry.images.map((img, i) => (
                    <div key={i} className="h-24 w-24 border border-espresso/20 rounded-xs overflow-hidden shrink-0">
                      <img src={img} alt="Reference" className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Internal Studio Notes */}
            <div className="border-t border-espresso/12 pt-4 space-y-2">
              <p className="field-label">Artisan Workshop Notes</p>
              <textarea
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                placeholder="Log hide inventory allocation, thread numbers, or customer preferences..."
                className="field-input text-xs"
                rows={3}
              />
              <button
                type="button"
                onClick={handleSaveNotes}
                className="btn btn-outline btn-sm w-full"
              >
                Save Notes
              </button>
            </div>
          </div>
        )}
      </Overlay>
    </div>
  );
}
