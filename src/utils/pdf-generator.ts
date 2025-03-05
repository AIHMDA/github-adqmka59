import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

interface Report {
  id: string;
  title: string;
  type: 'incident' | 'daily' | 'maintenance';
  severity?: 'low' | 'medium' | 'high';
  location: string;
  guard: string;
  date: string;
  status: 'pending' | 'reviewed' | 'archived';
  description?: string;
}

interface ReportFilters {
  type: string;
  severity: string;
  status: string;
  dateFrom: string;
  dateTo: string;
  location: string;
  guard: string;
}

export function generatePDF(reports: Report[], filters: ReportFilters) {
  // Create new PDF document
  const doc = new jsPDF();
  
  // Add header
  doc.setFontSize(20);
  doc.text('Security Reports', 14, 20);
  
  // Add filters section
  doc.setFontSize(12);
  doc.text('Filters:', 14, 35);
  let yPos = 40;
  
  if (filters.type) {
    doc.text(`Type: ${filters.type}`, 20, yPos);
    yPos += 5;
  }
  if (filters.severity) {
    doc.text(`Severity: ${filters.severity}`, 20, yPos);
    yPos += 5;
  }
  if (filters.status) {
    doc.text(`Status: ${filters.status}`, 20, yPos);
    yPos += 5;
  }
  if (filters.dateFrom || filters.dateTo) {
    doc.text(
      `Date Range: ${filters.dateFrom || 'Any'} to ${filters.dateTo || 'Any'}`,
      20,
      yPos
    );
    yPos += 5;
  }
  if (filters.location) {
    doc.text(`Location: ${filters.location}`, 20, yPos);
    yPos += 5;
  }
  if (filters.guard) {
    doc.text(`Guard: ${filters.guard}`, 20, yPos);
    yPos += 5;
  }

  yPos += 10;

  // Add timestamp
  doc.setFontSize(10);
  doc.text(
    `Generated on: ${format(new Date(), 'PPpp')}`,
    14,
    yPos
  );

  yPos += 10;

  // Prepare table data
  const tableData = reports.map(report => [
    report.date,
    report.title,
    report.type,
    report.severity || 'N/A',
    report.location,
    report.guard,
    report.status,
    report.description || ''
  ]);

  // Add table
  autoTable(doc, {
    startY: yPos,
    head: [['Date', 'Title', 'Type', 'Severity', 'Location', 'Guard', 'Status', 'Description']],
    body: tableData,
    headStyles: {
      fillColor: [41, 50, 65],
      textColor: [255, 255, 255]
    },
    styles: {
      overflow: 'linebreak',
      cellWidth: 'wrap'
    },
    columnStyles: {
      0: { cellWidth: 20 }, // Date
      1: { cellWidth: 30 }, // Title
      2: { cellWidth: 20 }, // Type
      3: { cellWidth: 20 }, // Severity
      4: { cellWidth: 25 }, // Location
      5: { cellWidth: 25 }, // Guard
      6: { cellWidth: 20 }, // Status
      7: { cellWidth: 'auto' }  // Description
    },
    didDrawPage: (data) => {
      // Add page number at the bottom
      doc.setFontSize(10);
      doc.text(
        `Page ${doc.getNumberOfPages()}`,
        data.settings.margin.left,
        doc.internal.pageSize.height - 10
      );
    }
  });

  // Save the PDF
  doc.save(`security-reports-${format(new Date(), 'yyyy-MM-dd-HHmm')}.pdf`);
}