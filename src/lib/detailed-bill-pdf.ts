import { jsPDF } from "jspdf";
import { type ApiAdminBooking, type ApiDetailedBillItem } from "@/lib/api";

type BillTotals = {
  base: number;
  additionalTotal: number;
  discountAmount: number;
  taxAmount: number;
  finalPayable: number;
};

function toMoney(value: number) {
  return `INR ${value.toFixed(2)}`;
}

function addWrappedText(doc: jsPDF, text: string, x: number, y: number, maxWidth: number, lineHeight = 6) {
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

export function downloadDetailedBillPdf(
  booking: ApiAdminBooking,
  items: ApiDetailedBillItem[],
  note: string,
  totals: BillTotals,
) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  let y = 18;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Royal Mechanic Detailed Bill", margin, y);

  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Customer: ${booking.userId?.name || "-"}`, margin, y);
  y += 6;
  doc.text(`Bike: ${booking.bikeName}`, margin, y);
  y += 6;
  doc.text(`Service Date: ${booking.scheduledDate} ${booking.scheduledTime}`, margin, y);

  y += 10;
  doc.setFont("helvetica", "bold");
  doc.text("Additional Work / Charges", margin, y);
  y += 7;

  doc.setFont("helvetica", "normal");
  if (!items.length) {
    doc.text("No additional items.", margin, y);
    y += 6;
  } else {
    items.forEach((item, index) => {
      const line = `${index + 1}. ${item.name || "(Unnamed item)"} - ${toMoney(Number(item.price) || 0)}`;
      y = addWrappedText(doc, line, margin, y, contentWidth);
      y += 1;
      if (item.description) {
        doc.setTextColor(90, 90, 90);
        y = addWrappedText(doc, `Note: ${item.description}`, margin + 4, y, contentWidth - 4);
        doc.setTextColor(0, 0, 0);
        y += 1;
      }

      if (y > 265) {
        doc.addPage();
        y = 20;
      }
    });
  }

  y += 6;
  doc.setFont("helvetica", "bold");
  doc.text("Summary", margin, y);
  y += 7;
  doc.setFont("helvetica", "normal");

  const summaryLines = [
    `Base Service Charge: ${toMoney(totals.base)}`,
    `Additional Charges: ${toMoney(totals.additionalTotal)}`,
    `Discount: -${toMoney(totals.discountAmount)}`,
    `Tax: ${toMoney(totals.taxAmount)}`,
    `Final Payable Amount: ${toMoney(totals.finalPayable)}`,
  ];

  summaryLines.forEach((line) => {
    doc.text(line, margin, y);
    y += 6;
  });

  if (note.trim()) {
    y += 2;
    doc.setFont("helvetica", "bold");
    doc.text("Bill Note", margin, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    addWrappedText(doc, note.trim(), margin, y, contentWidth);
  }

  const fileName = `detailed-bill-${booking._id}.pdf`;
  doc.save(fileName);
}
