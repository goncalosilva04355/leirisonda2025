// This is a temporary file to rebuild the intervention content
export const createInterventionContent = (
  intervention: any,
  maintenance: any,
  workLabels: any,
  createPhotoGallery: any,
  getProductPurpose: any,
  getWaterQualityStatus: any,
  calculateDuration: any,
  getPoolTypeLabel: any,
  format: any,
  pt: any,
) => {
  if (!intervention) return "";

  // Get water quality status with color coding
  const getWaterQualityColor = (waterValues: any) => {
    const ph = waterValues.ph;
    const chlorine = waterValues.chlorine;
    if (ph >= 7.0 && ph <= 7.4 && chlorine >= 1.0 && chlorine <= 2.5) {
      return "success";
    } else if (ph >= 6.8 && ph <= 7.6 && chlorine >= 0.8 && chlorine <= 3.0) {
      return "warning";
    }
    return "danger";
  };

  const waterQualityColor = getWaterQualityColor(intervention.waterValues);
  const waterQualityClass =
    waterQualityColor === "success"
      ? "quality-excellent"
      : waterQualityColor === "warning"
        ? "quality-acceptable"
        : "quality-poor";

  // Get ideal water values for comparison
  const idealValues = {
    ph: "7.0 - 7.4",
    chlorine: "1.0 - 2.5 ppm",
    alkalinity: "80 - 120 ppm",
    temperature: "24 - 28°C",
    salt: "3.0 - 4.0 gr/lt",
  };

  return `
    <!-- Pool Information Section -->
    <div class="section">
      <div class="section-header">
        <div class="section-title">🏊‍♂️ Informações da Piscina</div>
      </div>
      <div class="section-content">
        <table class="data-table">
          <tr>
            <td class="table-label">Nome:</td>
            <td class="table-value">${maintenance.poolName}</td>
          </tr>
          <tr>
            <td class="table-label">Cliente:</td>
            <td class="table-value">${maintenance.clientName}</td>
          </tr>
          <tr>
            <td class="table-label">Morada:</td>
            <td class="table-value">${maintenance.address}</td>
          </tr>
          <tr>
            <td class="table-label">Tipo:</td>
            <td class="table-value">${getPoolTypeLabel(maintenance.poolType)}</td>
          </tr>
          <tr>
            <td class="table-label">Estado:</td>
            <td class="table-value">${maintenance.status === "ativa" ? "Ativa" : "Inativa"}</td>
          </tr>
        </table>
      </div>
    </div>

    <!-- Intervention Details Section -->
    <div class="section">
      <div class="section-header">
        <div class="section-title">📅 Detalhes da Intervenção</div>
      </div>
      <div class="section-content">
        <table class="data-table">
          <tr>
            <td class="table-label">Data:</td>
            <td class="table-value">${format(new Date(intervention.date), "dd 'de' MMMM 'de' yyyy", { locale: pt })}</td>
          </tr>
          <tr>
            <td class="table-label">Horário:</td>
            <td class="table-value">${intervention.timeStart} - ${intervention.timeEnd}</td>
          </tr>
          <tr>
            <td class="table-label">Duração:</td>
            <td class="table-value">${calculateDuration(intervention.timeStart, intervention.timeEnd)}</td>
          </tr>
          <tr>
            <td class="table-label">Técnicos:</td>
            <td class="table-value">${intervention.technicians.join(", ")}</td>
          </tr>
          ${
            intervention.vehicles && intervention.vehicles.length > 0
              ? `
          <tr>
            <td class="table-label">Viaturas:</td>
            <td class="table-value">${intervention.vehicles.join(", ")}</td>
          </tr>`
              : ""
          }
        </table>
      </div>
    </div>

    <!-- Water Analysis Section -->
    <div class="section">
      <div class="section-header">
        <div class="section-title">🧪 Análise Completa da Água</div>
      </div>
      <div class="section-content">
        <table class="data-table">
          <thead>
            <tr>
              <th>Parâmetro</th>
              <th>Valor Medido</th>
              <th>Valor Ideal</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr class="${getWaterQualityColor(intervention.waterValues) === "success" ? "water-excellent" : getWaterQualityColor(intervention.waterValues) === "warning" ? "water-warning" : "water-danger"}">
              <td><strong>pH</strong></td>
              <td>${intervention.waterValues.ph || "N/A"}</td>
              <td>${idealValues.ph}</td>
              <td>${getWaterQualityColor(intervention.waterValues) === "success" ? "✅ Excelente" : getWaterQualityColor(intervention.waterValues) === "warning" ? "⚠️ Aceitável" : "❌ Ajustar"}</td>
            </tr>
            <tr class="${intervention.waterValues.chlorine >= 1.0 && intervention.waterValues.chlorine <= 2.5 ? "water-excellent" : intervention.waterValues.chlorine >= 0.8 && intervention.waterValues.chlorine <= 3.0 ? "water-warning" : "water-danger"}">
              <td><strong>Cloro</strong></td>
              <td>${intervention.waterValues.chlorine || "N/A"} ppm</td>
              <td>${idealValues.chlorine}</td>
              <td>${intervention.waterValues.chlorine >= 1.0 && intervention.waterValues.chlorine <= 2.5 ? "✅ Excelente" : intervention.waterValues.chlorine >= 0.8 && intervention.waterValues.chlorine <= 3.0 ? "⚠️ Aceitável" : "❌ Ajustar"}</td>
            </tr>
            ${
              intervention.waterValues.alkalinity
                ? `
            <tr>
              <td><strong>Alcalinidade</strong></td>
              <td>${intervention.waterValues.alkalinity} ppm</td>
              <td>${idealValues.alkalinity}</td>
              <td>${intervention.waterValues.alkalinity >= 80 && intervention.waterValues.alkalinity <= 120 ? "✅ Excelente" : "⚠️ Monitorizar"}</td>
            </tr>`
                : ""
            }
            <tr>
              <td><strong>Temperatura</strong></td>
              <td>${intervention.waterValues.temperature || "N/A"}°C</td>
              <td>${idealValues.temperature}</td>
              <td>${intervention.waterValues.temperature >= 24 && intervention.waterValues.temperature <= 28 ? "✅ Confortável" : "📊 Informativo"}</td>
            </tr>
            ${
              intervention.waterValues.salt
                ? `
            <tr>
              <td><strong>Sal</strong></td>
              <td>${intervention.waterValues.salt} gr/lt</td>
              <td>${idealValues.salt}</td>
              <td>${intervention.waterValues.salt >= 3.0 && intervention.waterValues.salt <= 4.0 ? "✅ Excelente" : "⚠️ Ajustar"}</td>
            </tr>`
                : ""
            }
          </tbody>
        </table>
      </div>
    </div>
      
    <!-- Work Performed Section -->
    ${
      Object.values(intervention.workPerformed).some((v) => v)
        ? `
    <div class="section">
      <div class="section-header">
        <div class="section-title">🔧 Trabalho Realizado</div>
      </div>
      <div class="section-content">
        <div class="work-categories">
          <!-- Sistema de Filtração -->
          <div class="work-category">
            <h4 class="category-title">💧 Sistema de Filtração</h4>
            <div class="work-items">
              ${Object.entries(intervention.workPerformed)
                .filter(
                  ([key, value]) =>
                    value &&
                    ["filtros", "preFiltero", "filtroAreiaVidro"].includes(key),
                )
                .map(
                  ([key]) => `
                  <div class="work-item">
                    <span class="work-check">✅</span>
                    <span class="work-text">${workLabels[key] || key}</span>
                  </div>
                `,
                )
                .join("")}
            </div>
          </div>
          
          <!-- Sistemas da Piscina -->
          <div class="work-category">
            <h4 class="category-title">🏊‍♂️ Sistemas da Piscina</h4>
            <div class="work-items">
              ${Object.entries(intervention.workPerformed)
                .filter(
                  ([key, value]) =>
                    value &&
                    [
                      "enchimentoAutomatico",
                      "linhaAgua",
                      "limpezaFundo",
                      "limpezaParedes",
                      "limpezaSkimmers",
                      "verificacaoEquipamentos",
                      "aspiracao",
                      "escovagem",
                      "limpezaFiltros",
                      "tratamentoAlgas",
                    ].includes(key),
                )
                .map(
                  ([key]) => `
                  <div class="work-item">
                    <span class="work-check">✅</span>
                    <span class="work-text">${workLabels[key] || key}</span>
                  </div>
                `,
                )
                .join("")}
            </div>
          </div>
          
          ${
            intervention.workPerformed.outros
              ? `
          <div class="work-category">
            <h4 class="category-title">📋 Trabalho Adicional</h4>
            <div class="work-items">
              <div class="work-item-note">
                <span class="work-check">📝</span>
                <span class="work-text">${intervention.workPerformed.outros}</span>
              </div>
            </div>
          </div>`
              : ""
          }
        </div>
      </div>
    </div>`
        : ""
    }

    <!-- Chemical Products Section -->
    ${
      intervention.chemicalProducts && intervention.chemicalProducts.length > 0
        ? `
    <div class="section">
      <div class="section-header">
        <div class="section-title">🧴 Produtos Químicos Aplicados</div>
      </div>
      <div class="section-content">
        <table class="data-table">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Quantidade</th>
              <th>Finalidade</th>
              <th>Observações</th>
            </tr>
          </thead>
          <tbody>
            ${intervention.chemicalProducts
              .map(
                (product) => `
              <tr>
                <td class="product-name">${product.productName}</td>
                <td class="product-quantity">${product.quantity} ${product.unit}</td>
                <td class="product-purpose">${getProductPurpose(product.productName)}</td>
                <td class="product-notes">${product.observations || "N/A"}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </div>`
        : ""
    }

    <!-- Problems Identified Section -->
    ${
      intervention.problems && intervention.problems.length > 0
        ? `
    <div class="section">
      <div class="section-header">
        <div class="section-title">⚠️ Problemas Identificados</div>
      </div>
      <div class="section-content">
        ${intervention.problems
          .map(
            (problem) => `
          <div class="problem-item ${problem.severity}">
            <div class="problem-header">
              <span class="problem-icon">${problem.severity === "urgent" ? "🚨" : problem.severity === "medium" ? "⚠️" : "📝"}</span>
              <span class="problem-title">${problem.description}</span>
              <span class="problem-status ${problem.status}">${problem.status === "resolved" ? "Resolvido" : problem.status === "pending" ? "Pendente" : "Em progresso"}</span>
            </div>
            ${problem.solution ? `<div class="problem-solution">💡 <strong>Solução:</strong> ${problem.solution}</div>` : ""}
            ${problem.estimatedCost ? `<div class="problem-cost">💰 <strong>Custo estimado:</strong> ${problem.estimatedCost}€</div>` : ""}
          </div>
        `,
          )
          .join("")}
      </div>
    </div>`
        : ""
    }

    <!-- Pool Photos Section -->
    ${maintenance.photos && maintenance.photos.length > 0 ? createPhotoGallery(maintenance.photos, "Fotos da Piscina") : ""}

    <!-- Intervention Photos Section -->
    ${intervention.photos && intervention.photos.length > 0 ? createPhotoGallery(intervention.photos, "Fotos da Intervenção") : ""}

    <!-- Observations Section -->
    ${
      intervention.observations
        ? `
    <div class="section">
      <div class="section-header">
        <div class="section-title">📝 Observações</div>
      </div>
      <div class="section-content">
        <div class="observations-content">
          ${intervention.observations}
        </div>
      </div>
    </div>`
        : ""
    }

    <!-- Summary Section -->
    <div class="section">
      <div class="section-header">
        <div class="section-title">📊 Resumo da Intervenção</div>
      </div>
      <div class="section-content">
        <div class="summary-grid">
          <div class="summary-item">
            <div class="summary-label">Estado da Água</div>
            <div class="summary-value ${waterQualityClass}">${getWaterQualityStatus(intervention.waterValues)}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Produtos Aplicados</div>
            <div class="summary-value">${intervention.chemicalProducts ? intervention.chemicalProducts.length : 0} produto${intervention.chemicalProducts && intervention.chemicalProducts.length !== 1 ? "s" : ""}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Trabalhos Realizados</div>
            <div class="summary-value">${Object.values(intervention.workPerformed).filter((v) => v).length} atividade${Object.values(intervention.workPerformed).filter((v) => v).length !== 1 ? "s" : ""}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Próxima Visita</div>
            <div class="summary-value">${intervention.nextVisit ? format(new Date(intervention.nextVisit), "dd/MM/yyyy", { locale: pt }) : "A definir"}</div>
          </div>
        </div>
      </div>
    </div>
  `;
};
