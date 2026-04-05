"use client";

import { useCallback } from "react";

export type ExportRow = Record<string, string | number>;

export function useExport(filename: string, rows: ExportRow[], columns: string[]) {
  const exportCSV = useCallback(() => {
    const header = columns.join(",");
    const body = rows.map((r) => columns.map((c) => `"${r[c] ?? ""}"`).join(",")).join("\n");
    const blob = new Blob([`${header}\n${body}`], { type: "text/csv" });
    trigger(blob, `${filename}.csv`);
  }, [filename, rows, columns]);

  const exportExcel = useCallback(async () => {
    const XLSX = await import("xlsx");
    const ws = XLSX.utils.json_to_sheet(rows.map((r) => Object.fromEntries(columns.map((c) => [c, r[c] ?? ""]))));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, `${filename}.xlsx`);
  }, [filename, rows, columns]);

  const exportPDF = useCallback(async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ orientation: "landscape" });

    doc.setFontSize(14);
    doc.setTextColor(28, 37, 54);
    doc.text(filename, 14, 18);

    doc.setFontSize(8);
    doc.setTextColor(99, 115, 129);

    const colWidth = Math.min(38, (doc.internal.pageSize.getWidth() - 28) / columns.length);
    let x = 14;
    let y = 30;

    // Header
    columns.forEach((col) => {
      doc.text(col.toUpperCase(), x, y);
      x += colWidth;
    });

    // Rows
    doc.setTextColor(28, 37, 54);
    doc.setFontSize(8);
    rows.forEach((row) => {
      x = 14;
      y += 8;
      if (y > doc.internal.pageSize.getHeight() - 14) {
        doc.addPage();
        y = 20;
      }
      columns.forEach((col) => {
        doc.text(String(row[col] ?? ""), x, y);
        x += colWidth;
      });
    });

    doc.save(`${filename}.pdf`);
  }, [filename, rows, columns]);

  return { exportCSV, exportExcel, exportPDF };
}

function trigger(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
