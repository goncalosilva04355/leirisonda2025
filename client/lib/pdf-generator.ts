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

  // Check if device is mobile for optimized settings
  private static isMobileDevice(): boolean {
    return (
      window.innerWidth < 768 ||
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      )
    );
  }

  // Wait for images to load completely
  private static async waitForImages(container: HTMLElement): Promise<void> {
    const images = container.querySelectorAll("img");
    const imagePromises = Array.from(images).map((img) => {
      if (img.complete) return Promise.resolve();

      return new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          console.warn("Image timeout:", img.src);
          resolve(); // Continue even if image fails
        }, 5000);

        img.onload = () => {
          clearTimeout(timeout);
          resolve();
        };
        img.onerror = () => {
          clearTimeout(timeout);
          console.warn("Image failed to load:", img.src);
          resolve(); // Continue even if image fails
        };
      });
    });

    await Promise.all(imagePromises);
  }

  static async generatePDFFromHTML(
    htmlContent: string,
    options: PDFOptions,
  ): Promise<Blob> {
    let tempContainer: HTMLElement | null = null;

    try {
      // Clear any cached styles to force refresh
      const cacheBuster = Date.now();
      console.log(`🔄 Iniciando geração PDF (${cacheBuster})`);

      // Detect mobile device for optimized settings
      const isMobile = this.isMobileDevice();

      // Create container preserving custom styles
      tempContainer = document.createElement("div");
      // Add cache buster to force content refresh
      const enhancedContent = htmlContent.replace(
        /(<style[^>]*>)/g,
        `$1/* Cache-Buster: ${cacheBuster} */`,
      );
      tempContainer.innerHTML = enhancedContent;
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.top = "-9999px";
      tempContainer.style.width = "210mm"; // Full A4 width for modern layout
      tempContainer.style.overflow = "visible"; // Allow content to expand
      tempContainer.style.zIndex = "-1000";

      document.body.appendChild(tempContainer);

      // Wait for content and images to load
      await new Promise((resolve) =>
        setTimeout(resolve, isMobile ? 1000 : 500),
      );
      await this.waitForImages(tempContainer);

      // Mobile-optimized canvas settings
      const canvasOptions = {
        scale: isMobile ? 1.5 : 2, // Lower scale on mobile to prevent memory issues
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        height: tempContainer.scrollHeight,
        width: tempContainer.scrollWidth,
        removeContainer: true,
        imageTimeout: 5000,
        onclone: (clonedDoc: Document) => {
          // Ensure all styles are properly cloned
          const clonedContainer = clonedDoc.body.firstChild as HTMLElement;
          if (clonedContainer) {
            clonedContainer.style.width = "210mm";
            clonedContainer.style.overflow = "visible";
          }
        },
      };

      // Generate canvas with error handling
      let canvas: HTMLCanvasElement;
      try {
        canvas = await html2canvas(tempContainer, canvasOptions);
      } catch (canvasError) {
        console.error("Canvas generation error:", canvasError);
        // Retry with even more conservative settings
        const retryOptions = {
          ...canvasOptions,
          scale: 1,
          height: Math.min(tempContainer.scrollHeight, 3000), // Limit height
          width: Math.min(tempContainer.scrollWidth, 800), // Limit width
        };
        canvas = await html2canvas(tempContainer, retryOptions);
      }

      // Clean up container as soon as possible
      if (tempContainer && tempContainer.parentNode) {
        document.body.removeChild(tempContainer);
        tempContainer = null;
      }

      // Validate canvas
      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        throw new Error("Falha na geração do conteúdo visual");
      }

      // Create PDF with mobile-optimized settings
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true, // Enable compression
        precision: 2, // Reduce precision for smaller file size
      });

      // Add metadata
      pdf.setProperties({
        title: options.title,
        author: "Leirisonda",
        creator: "Leirisonda PDF Generator",
      });

      // Calculate for A4 with proper scaling
      const pdfWidth = 210;
      const pdfHeight = 297;
      const margin = 10;
      const maxWidth = pdfWidth - margin * 2;
      const maxHeight = pdfHeight - margin * 2;

      // Calculate scaling to fit width
      const usedScale = isMobile ? 1.5 : 2;
      const scaleToFitWidth = maxWidth / (canvas.width / usedScale);
      const scaledHeight = (canvas.height / usedScale) * scaleToFitWidth;

      let currentY = margin;

      // Convert canvas to image with quality optimization
      let canvasData: string;
      try {
        canvasData = canvas.toDataURL("image/jpeg", isMobile ? 0.7 : 0.8); // Lower quality on mobile
      } catch (toDataURLError) {
        console.error("Canvas toDataURL error:", toDataURLError);
        // Fallback to PNG with lower quality
        canvasData = canvas.toDataURL("image/png");
      }

      // If content fits in one page
      if (scaledHeight <= maxHeight) {
        pdf.addImage(
          canvasData,
          "JPEG",
          margin,
          currentY,
          maxWidth,
          scaledHeight,
          undefined,
          "MEDIUM", // Medium compression
        );
      } else {
        // Multi-page support with memory optimization
        const pageHeight = maxHeight;
        const totalPages = Math.ceil(scaledHeight / pageHeight);
        const maxPages = isMobile ? 10 : 20; // Limit pages on mobile

        const actualPages = Math.min(totalPages, maxPages);

        for (let i = 0; i < actualPages; i++) {
          if (i > 0) {
            pdf.addPage();
            currentY = margin;
          }

          const sourceY = (i * pageHeight * canvas.height) / scaledHeight;
          const sourceHeight = Math.min(
            (pageHeight * canvas.height) / scaledHeight,
            canvas.height - sourceY,
          );

          // Create a cropped canvas for this page
          const pageCanvas = document.createElement("canvas");
          const pageCtx = pageCanvas.getContext("2d");

          if (!pageCtx) {
            throw new Error("Não foi possível criar contexto do canvas");
          }

          pageCanvas.width = canvas.width;
          pageCanvas.height = sourceHeight;

          pageCtx.drawImage(
            canvas,
            0,
            sourceY,
            canvas.width,
            sourceHeight,
            0,
            0,
            canvas.width,
            sourceHeight,
          );

          const actualPageHeight =
            (sourceHeight / canvas.height) * scaledHeight;

          try {
            const pageImageData = pageCanvas.toDataURL(
              "image/jpeg",
              isMobile ? 0.7 : 0.8,
            );
            pdf.addImage(
              pageImageData,
              "JPEG",
              margin,
              currentY,
              maxWidth,
              actualPageHeight,
              undefined,
              "MEDIUM",
            );
          } catch (pageError) {
            console.error(`Error adding page ${i + 1}:`, pageError);
            // Continue with next page
          }
        }

        if (totalPages > actualPages) {
          console.warn(
            `PDF truncated: ${actualPages}/${totalPages} pages due to mobile limitations`,
          );
        }
      }

      // Force garbage collection if available
      if ((window as any).gc) {
        (window as any).gc();
      }

      return pdf.output("blob");
    } catch (error) {
      console.error("Error generating PDF:", error);

      // Clean up on error
      if (tempContainer && tempContainer.parentNode) {
        try {
          document.body.removeChild(tempContainer);
        } catch (cleanupError) {
          console.error("Cleanup error:", cleanupError);
        }
      }

      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes("canvas")) {
          throw new Error(
            "Erro na geração do PDF: problema com imagens. Tente novamente.",
          );
        } else if (
          error.message.includes("memory") ||
          error.message.includes("limit")
        ) {
          throw new Error(
            "Erro na geração do PDF: documento muito grande. Tente reduzir o conteúdo.",
          );
        } else if (
          error.message.includes("network") ||
          error.message.includes("cors")
        ) {
          throw new Error(
            "Erro na geração do PDF: problema de conectividade. Verifique a internet.",
          );
        }
      }

      throw new Error("Erro ao gerar PDF. Tente novamente em alguns segundos.");
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
          /* Design moderno atualizado - ${Date.now()} - v2.0 */
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
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 8px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }

          .company-info .tagline {
            font-size: 16px;
            opacity: 0.9;
          }

          .header-meta {
            text-align: right;
            font-size: 13px;
            background: rgba(255,255,255,0.1);
            padding: 10px;
            border-radius: 8px;
          }

          .report-title h2 {
            font-size: 22px;
            font-weight: bold;
            border-top: 2px solid rgba(255,255,255,0.4);
            padding-top: 18px;
            margin-top: 10px;
          }

          .report-title .subtitle {
            font-size: 16px;
            margin-top: 8px;
            opacity: 0.95;
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
            background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 15px;
            border-left: 5px solid ${primaryColor};
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          }

          .info-card .label {
            font-size: 11px;
            font-weight: bold;
            color: ${primaryColor};
            margin-bottom: 5px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .info-card .value {
            font-size: 14px;
            font-weight: bold;
            color: #1a202c;
          }

          .section {
            margin-bottom: 20px;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          }

          .section-header {
            background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
            padding: 15px;
            border-bottom: 1px solid #e2e8f0;
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

          /* Modern Footer */
          .footer {
            background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
            color: white;
            padding: 20px;
            margin-top: 25px;
            border-radius: 10px;
            box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
          }

          .footer-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
          }

          .footer-logo {
            font-size: 20px;
            font-weight: bold;
            text-shadow: 0 1px 2px rgba(0,0,0,0.2);
          }

          .footer-contact {
            text-align: right;
            font-size: 12px;
            opacity: 0.9;
          }

          .footer-bottom {
            border-top: 1px solid rgba(255,255,255,0.2);
            padding-top: 12px;
            text-align: center;
            font-size: 11px;
            opacity: 0.8;
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
                  <h1>🏗️ LEIRISONDA - NOVO DESIGN</h1>
                  <div class="tagline">Gestão Avançada de Obras e Manutenção 2025</div>
                </div>
              </div>
              <div class="header-meta">
                <div><strong>📅 Data:</strong> ${reportDate}</div>
                <div><strong>🔢 REL:</strong> ${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}</div>
                <div><strong>⏰ Gerado:</strong> ${new Date().toLocaleTimeString("pt-PT")}</div>
              </div>
            </div>

            <div class="report-title">
              <h2>📋 ${data.title} - VERSÃO ATUALIZADA</h2>
              ${data.subtitle ? `<div class="subtitle">✨ ${data.subtitle}</div>` : ""}
              <div class="update-info" style="font-size: 14px; margin-top: 10px; opacity: 0.9;">
                🆕 Relatório completamente atualizado em ${new Date().toLocaleString("pt-PT")}
              </div>
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
