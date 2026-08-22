"use client";

import { useEffect, useMemo, useState } from "react";
import { MinusCircle, Plus } from "lucide-react";
import { type ApiAdminBooking, type ApiDetailedBillItem } from "@/lib/api";
import { downloadDetailedBillPdf } from "@/lib/detailed-bill-pdf";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type AdjustmentType = "none" | "fixed" | "percentage";

type DraftItem = ApiDetailedBillItem;

export type DetailedBillPayload = {
  baseServiceCharge: number;
  additionalItems: DraftItem[];
  discountType: AdjustmentType;
  discountValue: number;
  taxType: AdjustmentType;
  taxValue: number;
  note: string;
};

interface DetailedBillEditorProps {
  booking: ApiAdminBooking;
  saving: boolean;
  onBack: () => void;
  onSave: (payload: DetailedBillPayload) => Promise<void>;
}

function toMoney(value: number) {
  return `INR ${value.toFixed(2)}`;
}

function round2(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function defaultBaseCharge(booking: ApiAdminBooking) {
  return round2(booking.serviceIds.reduce((sum, service) => sum + (service.startingPrice || 0), 0));
}

function createBlankItem(): DraftItem {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: "",
    description: "",
    price: 0,
  };
}

export function DetailedBillEditor({ booking, saving, onBack, onSave }: DetailedBillEditorProps) {
  const [baseServiceCharge, setBaseServiceCharge] = useState("0");
  const [items, setItems] = useState<DraftItem[]>([createBlankItem()]);
  const [discountType, setDiscountType] = useState<AdjustmentType>("none");
  const [discountValue, setDiscountValue] = useState("0");
  const [taxType, setTaxType] = useState<AdjustmentType>("none");
  const [taxValue, setTaxValue] = useState("0");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const bill = booking.detailedBill;
      const initialBase = bill?.baseServiceCharge ?? defaultBaseCharge(booking);
      setBaseServiceCharge(String(initialBase));
      setItems(bill?.additionalItems?.length ? bill.additionalItems : [createBlankItem()]);
      setDiscountType(bill?.discountType ?? "none");
      setDiscountValue(String(bill?.discountValue ?? 0));
      setTaxType(bill?.taxType ?? "none");
      setTaxValue(String(bill?.taxValue ?? 0));
      setNote(bill?.note ?? "");
      setError("");
      setSuccess("");
      setShowPreview(false);
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [booking]);

  const calculations = useMemo(() => {
    const base = Number(baseServiceCharge) || 0;
    const additionalTotal = round2(items.reduce((sum, item) => sum + (Number(item.price) || 0), 0));
    const subtotal = round2(base + additionalTotal);

    const discountNumeric = Number(discountValue) || 0;
    const discountAmount = discountType === "none"
      ? 0
      : discountType === "fixed"
        ? round2(discountNumeric)
        : round2((subtotal * discountNumeric) / 100);

    const clampedDiscount = round2(Math.min(Math.max(discountAmount, 0), subtotal));
    const afterDiscount = round2(subtotal - clampedDiscount);

    const taxNumeric = Number(taxValue) || 0;
    const taxAmount = taxType === "none"
      ? 0
      : taxType === "fixed"
        ? round2(taxNumeric)
        : round2((afterDiscount * taxNumeric) / 100);

    const finalPayable = round2(Math.max(afterDiscount + taxAmount, 0));

    return {
      base,
      additionalTotal,
      subtotal,
      discountAmount: clampedDiscount,
      taxAmount,
      finalPayable,
    };
  }, [baseServiceCharge, discountType, discountValue, items, taxType, taxValue]);

  function updateItem(id: string, key: keyof DraftItem, value: string | number) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, [key]: value } : item)));
  }

  function addItem() {
    setSuccess("");
    setItems((current) => [...current, createBlankItem()]);
  }

  function removeItem(id: string) {
    setItems((current) => {
      if (current.length === 1) {
        return [createBlankItem()];
      }
      return current.filter((item) => item.id !== id);
    });
  }

  function validate(): DraftItem[] | null {
    const base = Number(baseServiceCharge);
    if (!Number.isFinite(base) || base < 0) {
      setError("Base service charge must be a non-negative number.");
      return null;
    }

    const normalized = items.map((item) => ({
      ...item,
      name: item.name.trim(),
      description: item.description.trim(),
      price: Number(item.price),
    }));

    const nonEmptyItems = normalized.filter((item) => {
      const hasText = Boolean(item.name || item.description);
      const hasPrice = Number.isFinite(item.price) && item.price > 0;
      return hasText || hasPrice;
    });

    for (let index = 0; index < nonEmptyItems.length; index += 1) {
      const item = nonEmptyItems[index];
      if (!item.name) {
        setError(`Item name is required for row ${index + 1}.`);
        return null;
      }

      if (!Number.isFinite(item.price) || item.price < 0) {
        setError(`Price must be a non-negative number for row ${index + 1}.`);
        return null;
      }
    }

    setError("");
    return nonEmptyItems.map((item) => ({
      ...item,
      price: round2(Number(item.price) || 0),
    }));
  }

  async function handleSave() {
    const validItems = validate();
    if (!validItems) return;

    setSuccess("");

    try {
      await onSave({
        baseServiceCharge: round2(Number(baseServiceCharge) || 0),
        additionalItems: validItems,
        discountType,
        discountValue: Number(discountValue) || 0,
        taxType,
        taxValue: Number(taxValue) || 0,
        note,
      });
      setSuccess("Detailed bill saved successfully.");
      setError("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unable to save detailed bill";
      setError(message);
      setSuccess("");
    }
  }

  function handleShare() {
    const summary = [
      "Royal Mechanic - Detailed Bill",
      `Customer: ${booking.userId?.name || "-"}`,
      `Bike: ${booking.bikeName}`,
      `Base Service: ${toMoney(calculations.base)}`,
      `Additional Charges: ${toMoney(calculations.additionalTotal)}`,
      `Final Amount: ${toMoney(calculations.finalPayable)}`,
    ].join("\n");

    if (navigator.share) {
      navigator.share({ title: "Detailed Bill", text: summary }).catch(() => {});
      return;
    }

    navigator.clipboard.writeText(summary).catch(() => {});
  }

  function renderPrintableMarkup() {
    const rows = items
      .map((item, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${item.name}</td>
          <td>${item.description || "-"}</td>
          <td style="text-align:right;">${toMoney(Number(item.price) || 0)}</td>
        </tr>
      `)
      .join("");

    return `
      <html>
        <head>
          <title>Royal Mechanic - Detailed Bill</title>
          <style>
            body { font-family: Arial, sans-serif; background:#121212; color:#f5efe4; padding:20px; }
            .wrap { max-width: 900px; margin: 0 auto; border:1px solid #4f3b24; border-radius: 12px; padding: 20px; background:#1a2029; }
            .title { color:#dfae60; margin:0 0 8px 0; }
            .muted { color:#cabba4; }
            table { width:100%; border-collapse: collapse; margin-top: 14px; }
            th,td { border-bottom:1px solid #3a2d1d; padding:8px; }
            .summary { margin-top:18px; line-height:1.8; }
            .final { font-size:20px; font-weight:700; color:#f4c778; }
          </style>
        </head>
        <body>
          <div class="wrap">
            <h1 class="title">Royal Mechanic Detailed Bill</h1>
            <div class="muted">Customer: ${booking.userId?.name || "-"} | Bike: ${booking.bikeName}</div>
            <div class="muted">Service Date: ${booking.scheduledDate} ${booking.scheduledTime}</div>
            <table>
              <thead>
                <tr><th>#</th><th>Item / Charge Name</th><th>Description</th><th style="text-align:right;">Price</th></tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
            <div class="summary">
              <div>Base Service Charge: ${toMoney(calculations.base)}</div>
              <div>Additional Charges: ${toMoney(calculations.additionalTotal)}</div>
              <div>Discount: -${toMoney(calculations.discountAmount)}</div>
              <div>Tax: ${toMoney(calculations.taxAmount)}</div>
              <div class="final">Final Payable Amount: ${toMoney(calculations.finalPayable)}</div>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  function handlePrint() {
    const html = renderPrintableMarkup();
    const printWindow = window.open("", "_blank", "width=980,height=760");
    if (!printWindow) return;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  function handleDownloadPdf() {
    const validItems = validate();
    if (!validItems) return;

    downloadDetailedBillPdf(booking, validItems, note, {
      base: calculations.base,
      additionalTotal: calculations.additionalTotal,
      discountAmount: calculations.discountAmount,
      taxAmount: calculations.taxAmount,
      finalPayable: calculations.finalPayable,
    });
  }

  return (
    <Card className="border-[#5b4424] bg-[#121821] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.55)] sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl font-semibold text-[var(--foreground)]">Create Detailed Bill</h2>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">Add dynamic additional expenses and calculate final payable amount automatically.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setShowPreview((v) => !v)}>{showPreview ? "Hide Bill" : "View Bill"}</Button>
          <Button variant="ghost" onClick={onBack}>Back</Button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 rounded-xl border border-[var(--border)] bg-[var(--muted)] p-4 text-sm sm:grid-cols-2">
        <p><strong>Customer:</strong> {booking.userId?.name || "Unknown"}</p>
        <p><strong>Bike:</strong> {booking.bikeName}</p>
        <p><strong>Service Date:</strong> {booking.scheduledDate}</p>
        <p><strong>Base Service:</strong> {booking.serviceIds.map((service) => service.name).join(", ") || "-"}</p>
      </div>

      <div className="mt-5">
        <label className="mb-1 block text-sm font-medium">Base Service Charge</label>
        <Input type="number" min={0} value={baseServiceCharge} onChange={(event) => setBaseServiceCharge(event.target.value)} />
      </div>

      <div className="mt-5 rounded-xl border border-[var(--border)] p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-heading text-lg font-semibold">Additional Expenses / Additional Work</h3>
          <Button size="sm" variant="secondary" onClick={addItem}><Plus className="mr-1 h-4 w-4" /> Add Item</Button>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="grid gap-2 rounded-lg border border-[var(--border)] p-3 sm:grid-cols-[1.3fr_1.6fr_0.8fr_auto]">
              <Input placeholder="Item / Charge Name" value={item.name} onChange={(event) => updateItem(item.id, "name", event.target.value)} />
              <Input placeholder="Description (optional)" value={item.description} onChange={(event) => updateItem(item.id, "description", event.target.value)} />
              <Input type="number" min={0} placeholder="Price" value={item.price} onChange={(event) => updateItem(item.id, "price", Number(event.target.value))} />
              <Button type="button" variant="ghost" onClick={() => removeItem(item.id)} className="self-center"><MinusCircle className="h-4 w-4" /></Button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm">Discount Type</label>
          <select value={discountType} onChange={(event) => setDiscountType(event.target.value as AdjustmentType)} className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3 text-sm">
            <option value="none">None</option>
            <option value="fixed">Fixed</option>
            <option value="percentage">Percentage</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm">Discount Value</label>
          <Input type="number" min={0} value={discountValue} onChange={(event) => setDiscountValue(event.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-sm">Tax Type</label>
          <select value={taxType} onChange={(event) => setTaxType(event.target.value as AdjustmentType)} className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3 text-sm">
            <option value="none">None</option>
            <option value="fixed">Fixed</option>
            <option value="percentage">Percentage</option>
          </select>
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm">Tax Value</label>
          <Input type="number" min={0} value={taxValue} onChange={(event) => setTaxValue(event.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-sm">Bill Note (optional)</label>
          <Input value={note} onChange={(event) => setNote(event.target.value)} placeholder="Any additional note for the customer" />
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-[#5b4424] bg-[#1b1f28] p-4">
        <h3 className="font-heading text-lg font-semibold text-[#f0c778]">Bill Summary</h3>
        <div className="mt-3 space-y-2 text-sm">
          <p className="flex items-center justify-between"><span>Base Service Charge</span><span>{toMoney(calculations.base)}</span></p>
          <p className="flex items-center justify-between"><span>Additional Charges</span><span>{toMoney(calculations.additionalTotal)}</span></p>
          <p className="flex items-center justify-between"><span>Subtotal</span><span>{toMoney(calculations.subtotal)}</span></p>
          <p className="flex items-center justify-between"><span>Discount</span><span>- {toMoney(calculations.discountAmount)}</span></p>
          <p className="flex items-center justify-between"><span>Tax</span><span>{toMoney(calculations.taxAmount)}</span></p>
          <p className="mt-2 flex items-center justify-between border-t border-[#4c3a25] pt-2 text-base font-semibold text-[#f6d49c]"><span>Final Payable Amount</span><span>{toMoney(calculations.finalPayable)}</span></p>
        </div>
      </div>

      {error ? <p className="mt-3 text-sm text-[var(--danger)]">{error}</p> : null}
      {success ? <p className="mt-3 text-sm text-[var(--success)]">{success}</p> : null}

      <div className="mt-5 flex flex-wrap justify-end gap-2">
        <Button variant="secondary" onClick={onBack} disabled={saving}>Back</Button>
        <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Detailed Bill"}</Button>
      </div>

      {showPreview ? (
        <div className="mt-6 rounded-xl border border-[var(--border)] bg-[#11161e] p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-heading text-xl font-semibold text-[#f0c778]">Royal Mechanic Bill Preview</h3>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" onClick={handleDownloadPdf}>Download PDF</Button>
              <Button size="sm" variant="secondary" onClick={handlePrint}>Print Bill</Button>
              <Button size="sm" variant="secondary" onClick={handleShare}>Share Bill</Button>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <p><strong>Customer:</strong> {booking.userId?.name || "Unknown"}</p>
            <p><strong>Bike:</strong> {booking.bikeName}</p>
            <p><strong>Service:</strong> {booking.serviceIds.map((service) => service.name).join(", ")}</p>
            <p><strong>Original Service:</strong> {toMoney(calculations.base)}</p>
            <div>
              <p className="mb-1"><strong>Additional Work & Parts</strong></p>
              <div className="space-y-1 text-[var(--muted-foreground)]">
                {items.map((item) => (
                  <p key={`preview-${item.id}`} className="flex items-center justify-between">
                    <span>{item.name || "(Unnamed item)"}</span>
                    <span>{toMoney(Number(item.price) || 0)}</span>
                  </p>
                ))}
              </div>
            </div>
            <p className="pt-2 text-base font-semibold text-[#f6d49c]">Final Amount: {toMoney(calculations.finalPayable)}</p>
          </div>
        </div>
      ) : null}
    </Card>
  );
}
