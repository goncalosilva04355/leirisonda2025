import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Waves } from "lucide-react";
import { PoolMaintenance } from "@shared/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useFirebaseSync } from "@/hooks/use-firebase-sync";
import { useAuth } from "@/components/AuthProvider";

export function EditMaintenance() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { maintenances, updateMaintenance } = useFirebaseSync();

  const [formData, setFormData] = useState({
    poolName: "",
    location: "",
    poolType: "",
    status: "",
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    waterCubicage: "",
    observations: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadMaintenance();
  }, [id, maintenances]);

  const loadMaintenance = () => {
    if (!id) {
      setError("ID da piscina não fornecido");
      setLoading(false);
      return;
    }

    const maintenance = maintenances.find((m) => m.id === id);
    if (!maintenance) {
      setError("Piscina não encontrada");
      setLoading(false);
      return;
    }

    setFormData({
      poolName: maintenance.poolName || "",
      location: maintenance.location || "",
      poolType: maintenance.poolType || "",
      status: maintenance.status || "active",
      clientName: maintenance.clientName || "",
      clientPhone: maintenance.clientPhone || "",
      clientEmail: maintenance.clientEmail || "",
      waterCubicage: maintenance.waterCubicage || "",
      observations: maintenance.observations || "",
    });

    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.permissions?.canEditMaintenance) {
      alert("Erro: Não tem permissão para editar piscinas");
      return;
    }

    if (!formData.poolName || !formData.location || !formData.clientName) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const maintenance = maintenances.find((m) => m.id === id);
      if (!maintenance) {
        throw new Error("Piscina não encontrada");
      }

      const updatedMaintenance: PoolMaintenance = {
        ...maintenance,
        poolName: formData.poolName,
        location: formData.location,
        poolType: formData.poolType,
        status: formData.status as "active" | "inactive" | "seasonal",
        clientName: formData.clientName,
        clientPhone: formData.clientPhone,
        clientEmail: formData.clientEmail,
        waterCubicage: formData.waterCubicage,
        observations: formData.observations,
        updatedAt: new Date().toISOString(),
      };

      await updateMaintenance(updatedMaintenance);

      console.log("✅ Piscina atualizada com sucesso");
      navigate(`/maintenance/${id}`);
    } catch (error) {
      console.error("❌ Erro ao atualizar piscina:", error);
      setError("Erro ao atualizar piscina. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">A carregar...</span>
      </div>
    );
  }

  if (error && !formData.poolName) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Erro ao carregar
        </h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <Button onClick={() => navigate("/pool-maintenance")}>
          Voltar à Lista
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => navigate("/pool-maintenance")}
          className="p-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center">
            <Waves className="mr-3 h-6 lg:h-8 w-6 lg:w-8 text-blue-600" />
            Editar Piscina
          </h1>
          <p className="text-gray-600 mt-1">
            Atualize as informações da piscina {formData.poolName}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Informações da Piscina
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="poolName">Nome da Piscina *</Label>
              <Input
                id="poolName"
                value={formData.poolName}
                onChange={(e) => handleInputChange("poolName", e.target.value)}
                placeholder="Ex: Piscina Principal"
                required
              />
            </div>

            <div>
              <Label htmlFor="location">Localização *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="Ex: Jardim, Quintal, Terraço"
                required
              />
            </div>

            <div>
              <Label htmlFor="poolType">Tipo de Piscina</Label>
              <Select
                value={formData.poolType}
                onValueChange={(value) => handleInputChange("poolType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="outdoor">🏊 Exterior</SelectItem>
                  <SelectItem value="indoor">🏠 Interior</SelectItem>
                  <SelectItem value="spa">💆 Spa</SelectItem>
                  <SelectItem value="olympic">🏅 Olímpica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Estado</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">✅ Ativa</SelectItem>
                  <SelectItem value="inactive">❌ Inativa</SelectItem>
                  <SelectItem value="seasonal">🌤️ Sazonal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="waterCubicage">Cubicagem de Água</Label>
              <Input
                id="waterCubicage"
                value={formData.waterCubicage}
                onChange={(e) =>
                  handleInputChange("waterCubicage", e.target.value)
                }
                placeholder="Ex: 50m³"
              />
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Informações do Cliente
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Label htmlFor="clientName">Nome do Cliente *</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) =>
                  handleInputChange("clientName", e.target.value)
                }
                placeholder="Nome completo do cliente"
                required
              />
            </div>

            <div>
              <Label htmlFor="clientPhone">Telefone</Label>
              <Input
                id="clientPhone"
                type="tel"
                value={formData.clientPhone}
                onChange={(e) =>
                  handleInputChange("clientPhone", e.target.value)
                }
                placeholder="Ex: +351 123 456 789"
              />
            </div>

            <div>
              <Label htmlFor="clientEmail">Email</Label>
              <Input
                id="clientEmail"
                type="email"
                value={formData.clientEmail}
                onChange={(e) =>
                  handleInputChange("clientEmail", e.target.value)
                }
                placeholder="cliente@example.com"
              />
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Observações
          </h2>

          <div>
            <Label htmlFor="observations">Observações Gerais</Label>
            <Textarea
              id="observations"
              value={formData.observations}
              onChange={(e) =>
                handleInputChange("observations", e.target.value)
              }
              placeholder="Observações sobre a piscina, equipamentos, etc."
              rows={4}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/maintenance/${id}`)}
            className="sm:w-auto"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="btn-primary sm:w-auto"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                A guardar...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Guardar Alterações
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
