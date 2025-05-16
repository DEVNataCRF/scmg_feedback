import 'jspdf';
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (...args: any[]) => void;
  }
}

declare module 'jspdf-autotable' {
  import jsPDF from 'jspdf';

  export interface AutoTableOptions {
    startY?: number;
    margin?: { top: number, right: number, bottom: number, left: number };
    head?: any[];
    body?: any[];
    headStyles?: any;
    bodyStyles?: any;
    footStyles?: any;
    styles?: any;
    theme?: 'striped' | 'grid' | 'plain';
    columnStyles?: any;
    didParseCell?: (data: any) => void;
    willDrawCell?: (data: any) => void;
    didDrawCell?: (data: any) => void;
    didDrawPage?: (data: any) => void;
  }

  export default function autoTable(doc: jsPDF, options: AutoTableOptions): void;
}
