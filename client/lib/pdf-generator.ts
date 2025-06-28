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
  ): Promise<void> {
    try {
      // Create a temporary container with better styling
      const tempContainer = document.createElement("div");
      tempContainer.innerHTML = htmlContent;
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.width = "794px"; // A4 width in pixels (210mm @ 96dpi)
      tempContainer.style.minHeight = "1123px"; // A4 height in pixels (297mm @ 96dpi)
      tempContainer.style.fontFamily =
        '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      tempContainer.style.fontSize = "14px";
      tempContainer.style.lineHeight = "1.5";
      tempContainer.style.color = "#1f2937";
      tempContainer.style.background = "#ffffff";
      tempContainer.style.padding = "0";
      tempContainer.style.margin = "0";
      tempContainer.style.boxSizing = "border-box";

      document.body.appendChild(tempContainer);

      // Wait for any fonts or images to load
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Generate high-quality canvas
      const canvas = await html2canvas(tempContainer, {
        scale: 3, // Higher scale for better quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        height: tempContainer.scrollHeight,
        width: tempContainer.scrollWidth,
        logging: false,
        imageTimeout: 15000,
        removeContainer: false,
      });

      // Remove temporary container
      document.body.removeChild(tempContainer);

      // Create PDF with metadata
      const pdf = new jsPDF({
        orientation: options.orientation || "portrait",
        unit: "mm",
        format: options.format || "a4",
        compress: true,
      });

      // Add metadata
      pdf.setProperties({
        title: options.title,
        subject: "Relatório Leirisonda",
        author: "Leirisonda - Sistema de Gestão",
        creator: "Leirisonda App",
        producer: "Leirisonda PDF Generator",
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add first page with high quality
      pdf.addImage(
        canvas.toDataURL("image/jpeg", 0.95),
        "JPEG",
        0,
        position,
        imgWidth,
        imgHeight,
        undefined,
        "FAST",
      );
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(
          canvas.toDataURL("image/jpeg", 0.95),
          "JPEG",
          0,
          position,
          imgWidth,
          imgHeight,
          undefined,
          "FAST",
        );
        heightLeft -= pageHeight;
      }

      // Save PDF
      pdf.save(options.filename);
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw new Error("Erro ao gerar PDF. Tente novamente.");
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
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          html, body {
            width: 794px;
            margin: 0;
            padding: 0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            font-size: 14px;
            line-height: 1.5;
            color: #111827;
            background: #ffffff;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }

          .report-container {
            width: 794px;
            background: #ffffff;
            position: relative;
          }

          /* Enhanced Header */
          .header {
            background: linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%);
            color: white;
            padding: 40px 50px;
            position: relative;
            overflow: hidden;
            min-height: 200px;
          }

          .header::before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 300px;
            height: 300px;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 2px, transparent 2px);
            background-size: 20px 20px;
            animation: drift 30s infinite linear;
          }

          .header::after {
            content: '';
            position: absolute;
            bottom: -100px;
            right: -100px;
            width: 200px;
            height: 200px;
            background: rgba(255,255,255,0.05);
            border-radius: 50%;
          }

          @keyframes drift {
            0% { transform: translate(0, 0) rotate(0deg); }
            100% { transform: translate(-20px, -20px) rotate(360deg); }
          }

          .header-content {
            position: relative;
            z-index: 2;
          }

          .header-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
          }

          .logo-section {
            display: flex;
            align-items: center;
          }

          .logo {
            background: white;
            width: 70px;
            height: 70px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 20px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            border: 3px solid rgba(255,255,255,0.2);
          }

          .logo svg {
            width: 35px;
            height: 35px;
            fill: ${primaryColor};
          }

          .company-info h1 {
            font-size: 32px;
            font-weight: 800;
            margin-bottom: 4px;
            letter-spacing: -0.025em;
          }

          .company-info .tagline {
            font-size: 16px;
            opacity: 0.9;
            font-weight: 500;
          }

          .report-meta {
            text-align: right;
            font-size: 13px;
            opacity: 0.8;
          }

          .report-title {
            border-top: 1px solid rgba(255,255,255,0.2);
            padding-top: 25px;
          }

          .report-title h2 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 12px;
            letter-spacing: -0.025em;
          }

          .report-title .subtitle {
            font-size: 16px;
            opacity: 0.85;
            font-weight: 400;
          }

          /* Content Area */
          .content {
            padding: 50px;
            background: #ffffff;
          }

          /* Enhanced Info Grid */
          .info-header {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-bottom: 40px;
          }

          .info-card {
            background: ${lightBg};
            border: 1px solid ${primaryColor}30;
            border-radius: 12px;
            padding: 20px;
            position: relative;
            transition: all 0.2s ease;
          }

          .info-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, ${primaryColor}, ${accentColor});
            border-radius: 12px 12px 0 0;
          }

          .info-card .label {
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            color: ${primaryColor};
            margin-bottom: 8px;
            opacity: 0.8;
          }

          .info-card .value {
            font-size: 16px;
            font-weight: 600;
            color: #111827;
            line-height: 1.2;
          }

          /* Enhanced Sections */
          .section {
            margin-bottom: 35px;
            background: #ffffff;
            border-radius: 12px;
            border: 1px solid #e5e7eb;
            overflow: hidden;
          }

          .section-header {
            background: linear-gradient(90deg, ${lightBg}, #ffffff);
            padding: 20px 25px;
            border-bottom: 1px solid #e5e7eb;
          }

          .section-title {
            font-size: 18px;
            font-weight: 700;
            color: #111827;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .section-content {
            padding: 25px;
          }

          /* Enhanced Data Display */
          .data-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 15px 0;
          }

          .data-item {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 15px;
            border-left: 3px solid ${primaryColor};
          }

          .data-item .label {
            font-size: 12px;
            font-weight: 600;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
          }

          .data-item .value {
            font-size: 15px;
            font-weight: 600;
            color: #111827;
          }

          /* Lists */
          .enhanced-list {
            list-style: none;
            padding: 0;
            margin: 15px 0;
          }

          .enhanced-list li {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 12px 15px;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 500;
          }

          .enhanced-list li::before {
            content: '✓';
            background: ${primaryColor};
            color: white;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
          }

          /* Highlight Boxes */
          .highlight-box {
            background: linear-gradient(135deg, ${lightBg} 0%, #ffffff 100%);
            border: 2px solid ${primaryColor}30;
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
            position: relative;
          }

          .highlight-box::before {
            content: '';
            position: absolute;
            top: -1px;
            left: -1px;
            right: -1px;
            height: 4px;
            background: linear-gradient(90deg, ${primaryColor}, ${accentColor});
            border-radius: 12px 12px 0 0;
          }

          /* Tables */
          .data-table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }

          .data-table th {
            background: ${primaryColor};
            color: white;
            padding: 12px 15px;
            text-align: left;
            font-weight: 600;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .data-table td {
            padding: 12px 15px;
            border-bottom: 1px solid #e5e7eb;
            font-weight: 500;
          }

          .data-table tr:nth-child(even) {
            background: #f8fafc;
          }

          /* Footer */
          .footer {
            background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
            color: white;
            padding: 40px 50px 30px;
            margin-top: 40px;
          }

          .footer-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
          }

          .footer-logo {
            font-size: 24px;
            font-weight: 800;
            color: white;
          }

          .footer-contact {
            text-align: right;
            font-size: 13px;
            opacity: 0.9;
          }

          .footer-contact p {
            margin-bottom: 4px;
          }

          .footer-bottom {
            border-top: 1px solid rgba(255,255,255,0.1);
            padding-top: 20px;
            text-align: center;
            font-size: 12px;
            opacity: 0.7;
          }

          /* Status Indicators */
          .status-indicator {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
          }

          .status-active {
            background: #dcfce7;
            color: #16a34a;
          }

          .status-pending {
            background: #fef3c7;
            color: #d97706;
          }

          .status-completed {
            background: #dbeafe;
            color: #2563eb;
          }

          /* Print Optimizations */
          @media print {
            .header::before,
            .header::after {
              animation: none;
            }

            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
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
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                      <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" fill="none"/>
                    </svg>
                  </div>
                  <div class="company-info">
                    <h1>Leirisonda</h1>
                    <div class="tagline">Gestão Profissional de Obras e Manutenção</div>
                  </div>
                </div>
                <div class="report-meta">
                  <div><strong>Gerado em:</strong> ${reportDate}</div>
                  <div><strong>Hora:</strong> ${reportTime}</div>
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
