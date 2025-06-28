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
    const reportDate = new Date().toLocaleDateString("pt-PT");
    const icon = data.type === "work" ? "🏗️" : "💧";
    const primaryColor =
      data.type === "work" ? this.LEIRISONDA_RED : this.LEIRISONDA_BLUE;

    return `
      <!DOCTYPE html>
      <html lang="pt">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${data.title}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: #ffffff;
            padding: 0;
            margin: 0;
          }

          .report-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            min-height: 100vh;
          }

          .header {
            background: linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}cc 100%);
            color: white;
            padding: 30px;
            position: relative;
            overflow: hidden;
          }

          .header::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 200%;
            height: 200%;
            background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="2" fill="white" opacity="0.1"/></svg>') repeat;
            animation: float 20s infinite linear;
          }

          @keyframes float {
            0% { transform: translateX(0) translateY(0); }
            100% { transform: translateX(-40px) translateY(-40px); }
          }

          .header-content {
            position: relative;
            z-index: 2;
          }

          .logo-section {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
          }

          .logo {
            background: white;
            width: 60px;
            height: 60px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          }

          .logo-text {
            font-size: 24px;
            font-weight: 700;
            color: ${primaryColor};
          }

          .company-info h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 5px;
          }

          .company-info p {
            font-size: 16px;
            opacity: 0.9;
          }

          .report-title {
            margin-top: 30px;
          }

          .report-title h2 {
            font-size: 36px;
            font-weight: 600;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .report-title p {
            font-size: 18px;
            opacity: 0.9;
          }

          .content {
            padding: 40px;
          }

          .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
          }

          .info-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            border-left: 4px solid ${primaryColor};
          }

          .info-card h3 {
            color: ${primaryColor};
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
          }

          .info-card p {
            font-size: 16px;
            font-weight: 500;
            color: #374151;
          }

          .report-content {
            background: white;
            border-radius: 12px;
            border: 1px solid #e5e7eb;
            padding: 30px;
            margin: 20px 0;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }

          .report-content h3 {
            color: #1f2937;
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid ${primaryColor};
          }

          .report-content p {
            margin-bottom: 15px;
            line-height: 1.7;
          }

          .section {
            margin-bottom: 30px;
          }

          .section-title {
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 1px solid #e5e7eb;
          }

          .highlight-box {
            background: linear-gradient(135deg, ${primaryColor}10 0%, ${primaryColor}05 100%);
            border: 1px solid ${primaryColor}30;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }

          .footer {
            background: #f8fafc;
            padding: 30px 40px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
          }

          .footer-logo {
            font-size: 20px;
            font-weight: 700;
            color: ${primaryColor};
            margin-bottom: 10px;
          }

          .footer p {
            color: #6b7280;
            font-size: 14px;
            margin-bottom: 5px;
          }

          .generated-info {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 12px;
            color: #9ca3af;
          }

          @media print {
            .header::before {
              animation: none;
            }

            .report-container {
              box-shadow: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="report-container">
          <div class="header">
            <div class="header-content">
              <div class="logo-section">
                <div class="logo">
                  <div class="logo-text">${icon}</div>
                </div>
                <div class="company-info">
                  <h1>Leirisonda</h1>
                  <p>Gestão de Obras e Manutenção</p>
                </div>
              </div>

              <div class="report-title">
                <h2>${icon} ${data.title}</h2>
                ${data.subtitle ? `<p>${data.subtitle}</p>` : ""}
              </div>
            </div>
          </div>

          <div class="content">
            <div class="info-grid">
              <div class="info-card">
                <h3>Data do Relatório</h3>
                <p>${reportDate}</p>
              </div>
              <div class="info-card">
                <h3>Data de Referência</h3>
                <p>${data.date}</p>
              </div>
              ${
                data.additionalInfo
                  ? `
                <div class="info-card">
                  <h3>Informação Adicional</h3>
                  <p>${data.additionalInfo}</p>
                </div>
              `
                  : ""
              }
            </div>

            <div class="report-content">
              <h3>Detalhes do Relatório</h3>
              <div>${data.content}</div>
            </div>
          </div>

          <div class="footer">
            <div class="footer-logo">Leirisonda</div>
            <p>Sistema de Gestão de Obras e Manutenção de Piscinas</p>
            <p>Email: info@leirisonda.pt</p>
            <p>© ${new Date().getFullYear()} Leirisonda - Todos os direitos reservados</p>

            <div class="generated-info">
              <p>Relatório gerado automaticamente em ${reportDate}</p>
              <p>Documento confidencial - Use apenas para fins profissionais</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
