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
      tempContainer.style.width = "800px";
      tempContainer.style.padding = "20px";
      tempContainer.style.fontFamily = "Arial, sans-serif";
      tempContainer.style.fontSize = "14px";
      tempContainer.style.lineHeight = "1.4";
      tempContainer.style.color = "#333";
      tempContainer.style.background = "#fff";

      document.body.appendChild(tempContainer);

      // Simple wait
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Generate canvas with basic settings
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      document.body.removeChild(tempContainer);

      // Create simple PDF
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

      // Add image to fill A4
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(
        canvas.toDataURL("image/jpeg", 0.9),
        "JPEG",
        0,
        0,
        imgWidth,
        imgHeight,
      );

      // Add more pages if needed
      if (imgHeight > 297) {
        let currentHeight = 297;
        while (currentHeight < imgHeight) {
          pdf.addPage();
          pdf.addImage(
            canvas.toDataURL("image/jpeg", 0.9),
            "JPEG",
            0,
            -currentHeight,
            imgWidth,
            imgHeight,
          );
          currentHeight += 297;
        }
      }

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
    const reportDate = new Date().toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const reportTime = new Date().toLocaleTimeString("pt-PT", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const icon = data.type === "work" ? "🏗️" : "💧";
    const primaryColor =
      data.type === "work" ? this.LEIRISONDA_RED : this.LEIRISONDA_BLUE;
    const accentColor = data.type === "work" ? "#dc2626" : "#0891b2";
    const lightBg =
      data.type === "work" ? "#fef2f2" : this.LEIRISONDA_BLUE_LIGHT;

    return `
      <!DOCTYPE html>
      <html lang="pt">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=794, initial-scale=1.0">
        <title>${data.title}</title>
        <style>
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
            background: #fff;
          }

          .report-container {
            max-width: 800px;
            margin: 0;
            padding: 20px;
            background: #fff;
          }

          .header {
            background: ${primaryColor};
            color: white;
            padding: 30px;
            margin-bottom: 20px;
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
            gap: 15px;
          }

          .logo {
            background: white;
            width: 50px;
            height: 50px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .logo img {
            width: 35px;
            height: 35px;
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
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 5px;
          }

          .report-title .subtitle {
            font-size: 14px;
          }

          .content {
            padding: 20px 0;
          }

          .info-header {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin-bottom: 30px;
          }

          .info-card {
            background: #f5f5f5;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            border-left: 4px solid ${primaryColor};
          }

          .info-card .label {
            font-size: 11px;
            font-weight: bold;
            color: ${primaryColor};
            margin-bottom: 5px;
            text-transform: uppercase;
          }

          .info-card .value {
            font-size: 14px;
            font-weight: bold;
            color: #333;
          }

          .section {
            margin-bottom: 30px;
            border: 1px solid #ddd;
            border-radius: 8px;
          }

          .section-header {
            background: #f5f5f5;
            padding: 15px;
            border-bottom: 1px solid #ddd;
          }

          .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #333;
            margin: 0;
          }

          .section-content {
            padding: 15px;
          }

          .data-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 10px;
            margin: 10px 0;
          }

          .data-item {
            background: #f9f9f9;
            border: 1px solid #eee;
            border-radius: 6px;
            padding: 10px;
            border-left: 3px solid ${primaryColor};
          }

          .data-item .label {
            font-size: 11px;
            font-weight: bold;
            color: #666;
            margin-bottom: 3px;
          }

          .data-item .value {
            font-size: 13px;
            font-weight: bold;
            color: #333;
          }

          .enhanced-list {
            list-style: none;
            padding: 0;
            margin: 10px 0;
          }

          .enhanced-list li {
            background: #f9f9f9;
            border: 1px solid #eee;
            border-radius: 6px;
            padding: 8px 12px;
            margin-bottom: 5px;
          }

          .enhanced-list li::before {
            content: '✓ ';
            color: ${primaryColor};
            font-weight: bold;
          }

          .highlight-box {
            background: #f0f8ff;
            border: 1px solid ${primaryColor};
            border-radius: 8px;
            padding: 15px;
            margin: 15px 0;
          }

          .data-table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
          }

          .data-table th {
            background: ${primaryColor};
            color: white;
            padding: 8px 10px;
            text-align: left;
            font-weight: bold;
            font-size: 12px;
          }

          .data-table td {
            padding: 8px 10px;
            border-bottom: 1px solid #ddd;
          }

          .data-table tr:nth-child(even) {
            background: #f9f9f9;
          }

          .footer {
            background: #333;
            color: white;
            padding: 20px;
            margin-top: 30px;
          }

          .footer-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
          }

          .footer-logo {
            font-size: 18px;
            font-weight: bold;
          }

          .footer-contact {
            text-align: right;
            font-size: 12px;
          }

          .footer-bottom {
            border-top: 1px solid #555;
            padding-top: 15px;
            text-align: center;
            font-size: 11px;
          }
        </style>
      </head>
      <body>
        <div class="report-container">
          <div class="header">
            <div class="header-content">
              <div class="header-top">
                <div class="logo-section">
                  <div class="logo">
                    <img src="https://cdn.builder.io/api/v1/image/assets%2F24b5ff5dbb9f4bb493659e90291d92bc%2F9862202d056a426996e6178b9981c1c7?format=webp&width=800" alt="Leirisonda Logo" />
                  </div>
                  <div class="company-info">
                    <h1>Leirisonda</h1>
                    <div class="tagline">Gestão Profissional de Obras e Manutenção</div>
                  </div>
                </div>
                <div class="header-meta">
                  <div><strong>Data:</strong> ${reportDate}</div>
                  <div><strong>Hora:</strong> ${reportTime}</div>
                  <div class="doc-id">DOC-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}</div>
                </div>
              </div>

              <div class="report-title">
                <h2>${icon} ${data.title}</h2>
                ${data.subtitle ? `<div class="subtitle">${data.subtitle}</div>` : ""}
              </div>
            </div>
          </div>

          <div class="content">
            <div class="info-header">
              <div class="info-card">
                <div class="label">Data do Relatório</div>
                <div class="value">${reportDate}</div>
              </div>
              <div class="info-card">
                <div class="label">Data de Referência</div>
                <div class="value">${data.date}</div>
              </div>
              <div class="info-card">
                <div class="label">Documento</div>
                <div class="value">REL-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}</div>
              </div>
            </div>

            ${
              data.additionalInfo
                ? `
              <div class="highlight-box">
                <strong>Informação Adicional:</strong> ${data.additionalInfo}
              </div>
            `
                : ""
            }

            <div>${data.content}</div>
          </div>

          <div class="footer">
            <div class="footer-content">
              <div class="footer-logo">Leirisonda</div>
              <div class="footer-contact">
                <p><strong>Email:</strong> info@leirisonda.pt</p>
                <p><strong>Telefone:</strong> (+351) 000 000 000</p>
                <p><strong>Website:</strong> www.leirisonda.pt</p>
              </div>
            </div>
            <div class="footer-bottom">
              <p>© ${new Date().getFullYear()} Leirisonda - Todos os direitos reservados.</p>
              <p>Documento confidencial gerado automaticamente pelo Sistema de Gestão Leirisonda</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
