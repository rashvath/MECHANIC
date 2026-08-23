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

function round2(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

async function loadImageDataUrl(src: string): Promise<string | null> {
  return new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext("2d");
      if (!context) {
        resolve(null);
        return;
      }
      context.drawImage(image, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    image.onerror = () => resolve(null);
    image.src = src;
  });
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

export async function downloadStyledInvoicePdf(booking: ApiAdminBooking) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 12;
  const contentWidth = pageWidth - margin * 2;
  const leftWidth = contentWidth * 0.62;
  const rightX = margin + leftWidth + 4;
  const rightWidth = contentWidth - leftWidth - 4;

  const bill = booking.detailedBill;
  const services = booking.serviceIds || [];
  const baseFromServices = services.reduce((sum, item) => sum + (item.startingPrice || 0), 0);
  const base = bill?.baseServiceCharge ?? baseFromServices;
  const additionalItems = Array.isArray(bill?.additionalItems) ? bill.additionalItems : [];
  const additionalTotal = bill?.additionalTotal ?? round2(additionalItems.reduce((sum, item) => sum + (item.price || 0), 0));
  const subtotal = bill?.subtotal ?? round2(base + additionalTotal);
  const discount = bill?.discountAmount ?? 0;
  const tax = bill?.taxAmount ?? 0;
  const total = bill?.finalPayableAmount ?? booking.payment?.amount ?? round2(subtotal - discount + tax);

  const customerName = booking.userId?.name || "Unknown";
  const customerEmail = booking.userId?.email || "-";
  const customerMobile = booking.mobileNumber || booking.userId?.mobile || "-";
  const invoiceNo = booking.payment?.invoiceNumber || `INV-${booking._id.slice(-6).toUpperCase()}`;
  const dateText = new Date().toLocaleDateString();
  const dueText = booking.scheduledDate || "-";
  const displayInvoiceNo = invoiceNo.length > 20
    ? `${invoiceNo.slice(0, 12)}...${invoiceNo.slice(-4)}`
    : invoiceNo;
  const invoiceText = `Invoice #: ${displayInvoiceNo}`;

  const logoDataUrl = await loadImageDataUrl("/images/logo.png");

  doc.setFillColor(255, 252, 246);
  doc.roundedRect(margin, margin, contentWidth, 28, 2, 2, "F");
  doc.setDrawColor(212, 184, 132);
  doc.roundedRect(margin, margin, contentWidth, 28, 2, 2, "S");

  if (logoDataUrl) {
    doc.addImage(logoDataUrl, "PNG", margin + 3, margin + 3, 18, 18);
  }

  doc.setTextColor(92, 58, 18);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("ROYAL MECHANIC", margin + 24, margin + 10);
  doc.setTextColor(125, 96, 54);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Doorstep Bike Care Services", margin + 24, margin + 16);
  doc.text("Phone: +91 90000 00000", margin + 24, margin + 21);

  doc.setTextColor(183, 134, 39);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("INVOICE", margin + contentWidth - 4, margin + 12, { align: "right" });

  const metaY = margin + 34;
  doc.setDrawColor(212, 184, 132);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(rightX, metaY, rightWidth, 30, 1.5, 1.5, "FD");
  doc.setFontSize(8.5);
  doc.setTextColor(92, 58, 18);
  doc.text(`Date: ${dateText}`, rightX + 3, metaY + 6);
  doc.text(doc.splitTextToSize(invoiceText, rightWidth - 6), rightX + 3, metaY + 12);
  doc.text(`Booking ID: ${String(booking._id).slice(-8).toUpperCase()}`, rightX + 3, metaY + 18);
  doc.text(`Due Date: ${dueText}`, rightX + 3, metaY + 24);

  const billToY = margin + 34;
  doc.setFillColor(240, 218, 172);
  doc.rect(margin, billToY, leftWidth, 6, "F");
  doc.setTextColor(66, 44, 17);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("BILL TO", margin + 3, billToY + 4.2);

  doc.setDrawColor(212, 184, 132);
  doc.setFillColor(255, 255, 255);
  doc.rect(margin, billToY + 6, leftWidth, 24, "FD");
  doc.setTextColor(55, 36, 12);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(customerName, margin + 3, billToY + 12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(customerEmail, margin + 3, billToY + 17);
  doc.text(`Mobile: ${customerMobile}`, margin + 3, billToY + 22);
  doc.text(`Bike: ${booking.bikeName}`, margin + 3, billToY + 27);

  let y = billToY + 36;
  doc.setFillColor(240, 218, 172);
  doc.rect(margin, y, contentWidth, 7, "F");
  doc.setTextColor(66, 44, 17);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("#", margin + 3, y + 4.8);
  doc.text("DESCRIPTION", margin + 14, y + 4.8);
  doc.text("AMOUNT", margin + contentWidth - 3, y + 4.8, { align: "right" });

  y += 7;
  doc.setDrawColor(236, 221, 191);
  doc.setFillColor(255, 255, 255);

  const rows: Array<{ label: string; amount: number }> = [
    ...services.map((service) => ({ label: service.name || "Service", amount: Number(service.startingPrice || 0) })),
    ...additionalItems.map((item) => ({ label: item.name || "Additional Work", amount: Number(item.price || 0) })),
  ];

  if (!rows.length) {
    rows.push({ label: "No service items", amount: 0 });
  }

  rows.forEach((row, index) => {
    if (y > 234) {
      doc.addPage();
      y = margin;
    }
    doc.rect(margin, y, contentWidth, 8, "FD");
    doc.setTextColor(55, 36, 12);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(String(index + 1), margin + 3, y + 5.2);
    doc.text(row.label, margin + 14, y + 5.2);
    doc.text(toMoney(row.amount), margin + contentWidth - 3, y + 5.2, { align: "right" });
    y += 8;
  });

  y += 4;
  const totalsX = margin;
  const totalsW = contentWidth;
  const totalsH = 24;
  doc.setDrawColor(212, 184, 132);
  doc.setFillColor(255, 251, 243);
  doc.roundedRect(totalsX, y, totalsW, totalsH, 1.5, 1.5, "FD");

  doc.setTextColor(75, 49, 15);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  const colGap = 4;
  const colW = (totalsW - 16) / 5;
  const labels = ["Base", "Additional", "Subtotal", "Discount", "Tax"];
  const values = [toMoney(base), toMoney(additionalTotal), toMoney(subtotal), `-${toMoney(discount)}`, toMoney(tax)];

  for (let i = 0; i < labels.length; i += 1) {
    const x = totalsX + 4 + i * (colW + colGap);
    doc.text(labels[i], x, y + 8);
    doc.text(values[i], x, y + 16);
  }

  doc.setFillColor(183, 134, 39);
  doc.rect(totalsX, y + totalsH, totalsW, 10, "F");
  doc.setTextColor(255, 250, 240);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("TOTAL", totalsX + 4, y + totalsH + 6.8);
  doc.text(toMoney(total), totalsX + totalsW - 4, y + totalsH + 6.8, { align: "right" });

  doc.setTextColor(135, 103, 56);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("This is a system-generated invoice.", margin, 286);

  doc.save(`invoice-${invoiceNo}.pdf`);
}
