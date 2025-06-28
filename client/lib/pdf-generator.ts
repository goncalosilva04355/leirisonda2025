import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export interface PDFOptions {
  title: string;
  filename: string;
  orientation?: "portrait" | "landscape";
  format?: "a4" | "letter";
}

export class PDFGenerator {
  private static readonly LEIRISONDA_BLUE = "#007784";
  private static readonly LEIRISONDA_RED = "#B3022A";
  private static readonly LEIRISONDA_BLUE_LIGHT = "#EFF5F6";

  static async generatePDFFromHTML(
    htmlContent: string,
    options: PDFOptions,
  ): Promise<Blob> {
    try {
      // Create simple container
      const tempContainer = document.createElement("div");
      tempContainer.innerHTML = htmlContent;
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.width = "170mm"; // A4 width minus 40mm margins
      tempContainer.style.maxHeight = "257mm"; // A4 height minus 40mm margins
      tempContainer.style.fontFamily = "Arial, sans-serif";
      tempContainer.style.fontSize = "12px";
      tempContainer.style.lineHeight = "1.4";
      tempContainer.style.color = "#333";
      tempContainer.style.background = "#fff";
      tempContainer.style.overflow = "hidden";

      document.body.appendChild(tempContainer);

      // Wait for content to load
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Generate canvas
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        height: Math.min(tempContainer.scrollHeight, 970), // Limit height for A4
        width: tempContainer.scrollWidth,
      });

      document.body.removeChild(tempContainer);

      // Create PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Add metadata
      pdf.setProperties({
        title: options.title,
        author: "Leirisonda",
      });

      // Calculate to fit A4 exactly with margins
      const pdfWidth = 210;
      const pdfHeight = 297;
      const margin = 20;
      const maxWidth = pdfWidth - margin * 2; // 170mm
      const maxHeight = pdfHeight - margin * 2; // 257mm

      // Calculate actual dimensions
      const aspectRatio = canvas.width / canvas.height;
      let width = maxWidth;
      let height = width / aspectRatio;

      // If too tall, scale down
      if (height > maxHeight) {
        height = maxHeight;
        width = height * aspectRatio;
      }

      // Center on page
      const x = margin + (maxWidth - width) / 2;
      const y = margin;

      // Add image to PDF
      pdf.addImage(
        canvas.toDataURL("image/png", 0.9),
        "PNG",
        x,
        y,
        width,
        height,
      );

      return pdf.output("blob");
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw new Error("Erro ao gerar PDF. Tente novamente.");
    }
  }

  static async downloadPDF(
    htmlContent: string,
    options: PDFOptions,
  ): Promise<void> {
    try {
      const pdfBlob = await this.generatePDFFromHTML(htmlContent, options);

      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = options.filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      throw new Error("Erro ao fazer download do PDF.");
    }
  }

  static createModernReportHTML(data: {
    type: "work" | "maintenance";
    title: string;
    subtitle?: string;
    date: string;
    content: string;
    additionalInfo?: string;
  }): string {
    const reportDate = new Date().toLocaleDateString("pt-PT");
    const primaryColor =
      data.type === "work" ? this.LEIRISONDA_RED : this.LEIRISONDA_BLUE;

    return `
      <!DOCTYPE html>
      <html lang="pt">
      <head>
        <meta charset="UTF-8">
        <title>${data.title}</title>
        <style>
          @page {
            size: A4;
            margin: 20mm;
          }

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
            background: white;
            width: 170mm;
            max-height: 257mm;
          }

          .report-container {
            width: 100%;
            max-height: 257mm;
            overflow: hidden;
          }

          /* Modern Header */
          .header {
            background: linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%);
            color: white;
            padding: 25px;
            margin-bottom: 25px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          }

          .header-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }

          .logo-section {
            display: flex;
            align-items: center;
            gap: 20px;
          }

          .logo {
            background: white;
            width: 70px;
            height: 70px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 3px 10px rgba(0,0,0,0.2);
          }

          .logo img {
            width: 55px;
            height: 55px;
            object-fit: contain;
          }

          .company-info h1 {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
          }

          .company-info .tagline {
            font-size: 14px;
          }

          .header-meta {
            text-align: right;
            font-size: 12px;
          }

          .report-title h2 {
            font-size: 18px;
            font-weight: bold;
            border-top: 1px solid rgba(255,255,255,0.3);
            padding-top: 15px;
          }

          .report-title .subtitle {
            font-size: 14px;
            margin-top: 5px;
          }

          /* Content */
          .content {
            max-height: 160mm;
            overflow: hidden;
          }

          .info-header {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
          }

          .info-card {
            flex: 1;
            background: #f5f5f5;
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 10px;
            border-left: 4px solid ${primaryColor};
          }

          .info-card .label {
            font-size: 10px;
            font-weight: bold;
            color: ${primaryColor};
            margin-bottom: 3px;
            text-transform: uppercase;
          }

          .info-card .value {
            font-size: 12px;
            font-weight: bold;
            color: #333;
          }

          .section {
            margin-bottom: 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
            overflow: hidden;
          }

          .section-header {
            background: #f5f5f5;
            padding: 10px;
            border-bottom: 1px solid #ddd;
          }

          .section-title {
            font-size: 14px;
            font-weight: bold;
            color: #333;
          }

          .section-content {
            padding: 10px;
          }

          .highlight-box {
            background: #f0f8ff;
            border: 1px solid ${primaryColor};
            border-radius: 5px;
            padding: 10px;
            margin: 10px 0;
          }

          .data-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
          }

          .data-table th {
            background: ${primaryColor};
            color: white;
            padding: 5px;
            text-align: left;
            font-weight: bold;
          }

          .data-table td {
            padding: 5px;
            border-bottom: 1px solid #ddd;
          }

          .data-table tr:nth-child(even) {
            background: #f9f9f9;
          }

          .enhanced-list {
            list-style: none;
            padding: 0;
          }

          .enhanced-list li {
            background: #f9f9f9;
            border: 1px solid #eee;
            border-radius: 3px;
            padding: 5px 8px;
            margin-bottom: 3px;
            font-size: 11px;
          }

          .enhanced-list li::before {
            content: '✓ ';
            color: ${primaryColor};
            font-weight: bold;
          }

          /* Footer */
          .footer {
            background: #333;
            color: white;
            padding: 15px;
            margin-top: 20px;
          }

          .footer-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          }

          .footer-logo {
            font-size: 16px;
            font-weight: bold;
          }

          .footer-contact {
            text-align: right;
            font-size: 10px;
          }

          .footer-bottom {
            border-top: 1px solid #555;
            padding-top: 10px;
            text-align: center;
            font-size: 9px;
          }
        </style>
      </head>
      <body>
        <div class="report-container">
          <div class="header">
            <div class="header-top">
              <div class="logo-section">
                <div class="logo">
                  <img src="https://cdn.builder.io/api/v1/image/assets%2F24b5ff5dbb9f4bb493659e90291d92bc%2F9862202d056a426996e6178b9981c1c7?format=webp&width=200" alt="Leirisonda Logo" />
                </div>
                <div class="company-info">
                  <h1>Leirisonda</h1>
                  <div class="tagline">Gestão de Obras e Manutenção</div>
                </div>
              </div>
              <div class="header-meta">
                <div><strong>Data:</strong> ${reportDate}</div>
                <div><strong>REL:</strong> ${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}</div>
              </div>
            </div>

            <div class="report-title">
              <h2>${data.title}</h2>
              ${data.subtitle ? `<div class="subtitle">${data.subtitle}</div>` : ""}
            </div>
          </div>

          <div class="content">
            <div class="info-header">
              <div class="info-card">
                <div class="label">Data Relatório</div>
                <div class="value">${reportDate}</div>
              </div>
              <div class="info-card">
                <div class="label">Data Referência</div>
                <div class="value">${data.date}</div>
              </div>
              <div class="info-card">
                <div class="label">Estado</div>
                <div class="value">${data.additionalInfo || "Concluído"}</div>
              </div>
            </div>

            <div>${data.content}</div>
          </div>

          <div class="footer">
            <div class="footer-content">
              <div class="footer-logo">Leirisonda</div>
              <div class="footer-contact">
                <div>info@leirisonda.pt</div>
                <div>www.leirisonda.pt</div>
              </div>
            </div>
            <div class="footer-bottom">
              © ${new Date().getFullYear()} Leirisonda - Sistema de Gestão
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
