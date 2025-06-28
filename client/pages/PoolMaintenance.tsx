import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import {
  Waves,
  Plus,
  Thermometer,
  Droplets,
  Calendar,
  User,
  MapPin,
  Save,
  Eye,
  AlertCircle,
} from "lucide-react";
import { PoolMaintenance } from "@shared/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function PoolMaintenancePage() {
  const [maintenances, setMaintenances] = useState<PoolMaintenance[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    poolName: "",
    location: "",
    date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    waterValues: {
      ph: 0,
      salt: 0,
      temperature: 0,
      chlorine: 0,
      bromine: 0,
      alkalinity: 0,
      hardness: 0,
      stabilizer: 0,
    },
    technicians: [] as string[],
    vehicles: [] as string[],
    maintenanceWork: {
      filtros: false,
      preFiltero: false,
      filtroAreiaVidro: false,
      alimenta: false,
      enchimentoAutomatico: false,
      linhaAgua: false,
      outros: "",
    },
    observations: "",
  });

  const [technicianInput, setTechnicianInput] = useState("");
  const [vehicleInput, setVehicleInput] = useState("");

  useEffect(() => {
    loadMaintenances();
  }, []);

  const loadMaintenances = () => {
    // Force demo data for debugging
    const demoData = createDemoMaintenances();
    console.log("Created demo data:", demoData);
    setMaintenances(demoData);
    localStorage.setItem(
      "leirisonda_pool_maintenances",
      JSON.stringify(demoData),
    );
  };

  const createDemoMaintenances = (): PoolMaintenance[] => {
    return [
      {
        id: "1",
        poolName: "Piscina Hotel Azul",
        location: "Leiria",
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        waterValues: {
          ph: 7.2,
          salt: 3200,
          temperature: 26,
          chlorine: 1.2,
          bromine: 0,
          alkalinity: 120,
          hardness: 250,
          stabilizer: 35,
        },
        technicians: ["João Santos", "Pedro Silva"],
        vehicles: ["Carrinha Leirisonda 1"],
        maintenanceWork: {
          filtros: true,
          preFiltero: true,
          filtroAreiaVidro: false,
          alimenta: false,
          enchimentoAutomatico: true,
          linhaAgua: true,
          outros: "Verificação do sistema de aquecimento",
        },
        observations: "Valores dentro dos parâmetros normais",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        poolName: "Jacuzzi Spa Relax",
        location: "Marinha Grande",
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        waterValues: {
          ph: 7.8,
          salt: 0,
          temperature: 38,
          chlorine: 0,
          bromine: 3.5,
          alkalinity: 100,
          hardness: 180,
          stabilizer: 0,
        },
        technicians: ["António Costa"],
        vehicles: ["Carrinha Leirisonda 2"],
        maintenanceWork: {
          filtros: false,
          preFiltero: false,
          filtroAreiaVidro: true,
          alimenta: true,
          enchimentoAutomatico: false,
          linhaAgua: false,
          outros: "Substituição de sonda pH",
        },
        observations: "pH ligeiramente elevado, ajustado com redutor",
        createdAt: new Date().toISOString(),
      },
    ];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Validation
    if (!formData.poolName.trim()) {
      setError("Por favor, introduza o nome da piscina.");
      setIsSubmitting(false);
      return;
    }

    if (formData.technicians.length === 0) {
      setError("Por favor, adicione pelo menos um técnico.");
      setIsSubmitting(false);
      return;
    }

    try {
      const newMaintenance: PoolMaintenance = {
        id: Date.now().toString(),
        poolName: formData.poolName.trim(),
        location: formData.location.trim(),
        date: new Date(formData.date).toISOString(),
        waterValues: formData.waterValues,
        technicians: formData.technicians,
        vehicles: formData.vehicles,
        maintenanceWork: formData.maintenanceWork,
        observations: formData.observations.trim(),
        createdAt: new Date().toISOString(),
      };

      const updatedMaintenances = [...maintenances, newMaintenance];
      setMaintenances(updatedMaintenances);
      localStorage.setItem(
        "leirisonda_pool_maintenances",
        JSON.stringify(updatedMaintenances),
      );

      // Reset form
      setFormData({
        poolName: "",
        location: "",
        date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        waterValues: {
          ph: 0,
          salt: 0,
          temperature: 0,
          chlorine: 0,
          bromine: 0,
          alkalinity: 0,
          hardness: 0,
          stabilizer: 0,
        },
        technicians: [],
        vehicles: [],
        maintenanceWork: {
          filtros: false,
          preFiltero: false,
          filtroAreiaVidro: false,
          alimenta: false,
          enchimentoAutomatico: false,
          linhaAgua: false,
          outros: "",
        },
        observations: "",
      });
      setTechnicianInput("");
      setVehicleInput("");

      setIsDialogOpen(false);
    } catch (err) {
      setError("Erro ao registar manutenção. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    if (field.startsWith("waterValues.")) {
      const waterField = field.replace("waterValues.", "");
      setFormData((prev) => ({
        ...prev,
        waterValues: {
          ...prev.waterValues,
          [waterField]: parseFloat(value) || 0,
        },
      }));
    } else if (field.startsWith("maintenanceWork.")) {
      const workField = field.replace("maintenanceWork.", "");
      setFormData((prev) => ({
        ...prev,
        maintenanceWork: {
          ...prev.maintenanceWork,
          [workField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const addTechnician = () => {
    if (
      technicianInput.trim() &&
      !formData.technicians.includes(technicianInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        technicians: [...prev.technicians, technicianInput.trim()],
      }));
      setTechnicianInput("");
    }
  };

  const removeTechnician = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      technicians: prev.technicians.filter((_, i) => i !== index),
    }));
  };

  const addVehicle = () => {
    if (
      vehicleInput.trim() &&
      !formData.vehicles.includes(vehicleInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        vehicles: [...prev.vehicles, vehicleInput.trim()],
      }));
      setVehicleInput("");
    }
  };

  const removeVehicle = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      vehicles: prev.vehicles.filter((_, i) => i !== index),
    }));
  };

  const getValueStatus = (parameter: string, value: number) => {
    const ranges: { [key: string]: { min: number; max: number } } = {
      ph: { min: 7.0, max: 7.6 },
      chlorine: { min: 1.0, max: 3.0 },
      bromine: { min: 2.0, max: 4.0 },
      alkalinity: { min: 80, max: 120 },
      temperature: { min: 24, max: 28 },
    };

    const range = ranges[parameter];
    if (!range) return "normal";

    if (value < range.min || value > range.max) return "warning";
    return "normal";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "warning":
        return "text-orange-600 bg-orange-100";
      default:
        return "text-green-600 bg-green-100";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Manutenção de Piscinas
          </h1>
          <p className="mt-2 text-gray-600">
            Registar e monitorizar valores da água
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Manutenção
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Registar Nova Manutenção</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="poolName">Nome da Piscina/Jacuzzi *</Label>
                  <Input
                    id="poolName"
                    value={formData.poolName}
                    onChange={(e) => updateFormData("poolName", e.target.value)}
                    placeholder="Ex: Piscina Hotel Azul"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="location">Localização</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => updateFormData("location", e.target.value)}
                    placeholder="Ex: Leiria"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="date">Data e Hora *</Label>
                  <Input
                    id="date"
                    type="datetime-local"
                    value={formData.date}
                    onChange={(e) => updateFormData("date", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Technicians */}
              <div>
                <Label>Técnicos *</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex space-x-2">
                    <Input
                      value={technicianInput}
                      onChange={(e) => setTechnicianInput(e.target.value)}
                      placeholder="Ex: João Santos"
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), addTechnician())
                      }
                    />
                    <Button
                      type="button"
                      onClick={addTechnician}
                      variant="outline"
                    >
                      Adicionar
                    </Button>
                  </div>
                  {formData.technicians.map((technician, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded"
                    >
                      <span>{technician}</span>
                      <Button
                        type="button"
                        onClick={() => removeTechnician(index)}
                        variant="ghost"
                        size="sm"
                      >
                        Remover
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vehicles */}
              <div>
                <Label>Viaturas Utilizadas</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex space-x-2">
                    <Input
                      value={vehicleInput}
                      onChange={(e) => setVehicleInput(e.target.value)}
                      placeholder="Ex: Carrinha Leirisonda 1"
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addVehicle())
                      }
                    />
                    <Button
                      type="button"
                      onClick={addVehicle}
                      variant="outline"
                    >
                      Adicionar
                    </Button>
                  </div>
                  {formData.vehicles.map((vehicle, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded"
                    >
                      <span>{vehicle}</span>
                      <Button
                        type="button"
                        onClick={() => removeVehicle(index)}
                        variant="ghost"
                        size="sm"
                      >
                        Remover
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Water Values */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Valores da Água
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="ph">pH</Label>
                    <Input
                      id="ph"
                      type="number"
                      step="0.1"
                      value={formData.waterValues.ph || ""}
                      onChange={(e) =>
                        updateFormData("waterValues.ph", e.target.value)
                      }
                      placeholder="7.2"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="temperature">Temperatura (°C)</Label>
                    <Input
                      id="temperature"
                      type="number"
                      step="0.1"
                      value={formData.waterValues.temperature || ""}
                      onChange={(e) =>
                        updateFormData(
                          "waterValues.temperature",
                          e.target.value,
                        )
                      }
                      placeholder="26"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="chlorine">Cloro (ppm)</Label>
                    <Input
                      id="chlorine"
                      type="number"
                      step="0.1"
                      value={formData.waterValues.chlorine || ""}
                      onChange={(e) =>
                        updateFormData("waterValues.chlorine", e.target.value)
                      }
                      placeholder="1.2"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="bromine">Bromo (ppm)</Label>
                    <Input
                      id="bromine"
                      type="number"
                      step="0.1"
                      value={formData.waterValues.bromine || ""}
                      onChange={(e) =>
                        updateFormData("waterValues.bromine", e.target.value)
                      }
                      placeholder="3.0"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="salt">Sal (ppm)</Label>
                    <Input
                      id="salt"
                      type="number"
                      value={formData.waterValues.salt || ""}
                      onChange={(e) =>
                        updateFormData("waterValues.salt", e.target.value)
                      }
                      placeholder="3200"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="alkalinity">Alcalinidade (ppm)</Label>
                    <Input
                      id="alkalinity"
                      type="number"
                      value={formData.waterValues.alkalinity || ""}
                      onChange={(e) =>
                        updateFormData("waterValues.alkalinity", e.target.value)
                      }
                      placeholder="120"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="hardness">Dureza Cálcica (ppm)</Label>
                    <Input
                      id="hardness"
                      type="number"
                      value={formData.waterValues.hardness || ""}
                      onChange={(e) =>
                        updateFormData("waterValues.hardness", e.target.value)
                      }
                      placeholder="250"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="stabilizer">Estabilizador (ppm)</Label>
                    <Input
                      id="stabilizer"
                      type="number"
                      value={formData.waterValues.stabilizer || ""}
                      onChange={(e) =>
                        updateFormData("waterValues.stabilizer", e.target.value)
                      }
                      placeholder="35"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Maintenance Work */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Trabalhos de Manutenção Realizados
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="filtros"
                      checked={formData.maintenanceWork.filtros}
                      onCheckedChange={(checked) =>
                        updateFormData("maintenanceWork.filtros", checked)
                      }
                    />
                    <Label htmlFor="filtros" className="text-sm">
                      Pré-filtro
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="preFiltero"
                      checked={formData.maintenanceWork.preFiltero}
                      onCheckedChange={(checked) =>
                        updateFormData("maintenanceWork.preFiltero", checked)
                      }
                    />
                    <Label htmlFor="preFiltero" className="text-sm">
                      Pré-filtro
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="filtroAreiaVidro"
                      checked={formData.maintenanceWork.filtroAreiaVidro}
                      onCheckedChange={(checked) =>
                        updateFormData(
                          "maintenanceWork.filtroAreiaVidro",
                          checked,
                        )
                      }
                    />
                    <Label htmlFor="filtroAreiaVidro" className="text-sm">
                      Filtro Areia/Vidro
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="alimenta"
                      checked={formData.maintenanceWork.alimenta}
                      onCheckedChange={(checked) =>
                        updateFormData("maintenanceWork.alimenta", checked)
                      }
                    />
                    <Label htmlFor="alimenta" className="text-sm">
                      Alimenta
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="enchimentoAutomatico"
                      checked={formData.maintenanceWork.enchimentoAutomatico}
                      onCheckedChange={(checked) =>
                        updateFormData(
                          "maintenanceWork.enchimentoAutomatico",
                          checked,
                        )
                      }
                    />
                    <Label htmlFor="enchimentoAutomatico" className="text-sm">
                      Enchimento Automático
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="linhaAgua"
                      checked={formData.maintenanceWork.linhaAgua}
                      onCheckedChange={(checked) =>
                        updateFormData("maintenanceWork.linhaAgua", checked)
                      }
                    />
                    <Label htmlFor="linhaAgua" className="text-sm">
                      Linha Água
                    </Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="outros">Outros Trabalhos</Label>
                  <Input
                    id="outros"
                    value={formData.maintenanceWork.outros}
                    onChange={(e) =>
                      updateFormData("maintenanceWork.outros", e.target.value)
                    }
                    placeholder="Ex: Verificação do sistema de aquecimento"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="observations">Observações</Label>
                <Textarea
                  id="observations"
                  value={formData.observations}
                  onChange={(e) =>
                    updateFormData("observations", e.target.value)
                  }
                  placeholder="Observações sobre a manutenção..."
                  className="mt-1"
                  rows={3}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    "A guardar..."
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Guardar Manutenção
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Maintenance Records */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Registos de Manutenção ({maintenances.length})
          </h3>
        </div>

        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded mb-4">
          <p className="text-sm text-yellow-800">
            Debug: Total de manutenções carregadas: {maintenances.length}
          </p>
        </div>

        {maintenances.length === 0 ? (
          <div className="text-center py-12">
            <Waves className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma manutenção registada
            </h3>
            <p className="text-gray-600 mb-4">
              Comece por registar a primeira manutenção de piscina.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {maintenances.map((maintenance) => (
              <div key={maintenance.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {maintenance.poolName}
                    </h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {maintenance.location}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {format(
                          new Date(maintenance.date),
                          "dd/MM/yyyy HH:mm",
                          {
                            locale: pt,
                          },
                        )}
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {maintenance.technicians.join(", ")}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-4">
                  {Object.entries(maintenance.waterValues).map(
                    ([key, value]) => {
                      if (value === 0) return null;
                      const status = getValueStatus(key, value);
                      const statusColor = getStatusColor(status);

                      const labels: { [key: string]: string } = {
                        ph: "pH",
                        salt: "Sal",
                        temperature: "Temp.",
                        chlorine: "Cloro",
                        bromine: "Bromo",
                        alkalinity: "Alcal.",
                        hardness: "Dureza",
                        stabilizer: "Estab.",
                      };

                      const units: { [key: string]: string } = {
                        ph: "",
                        salt: "ppm",
                        temperature: "°C",
                        chlorine: "ppm",
                        bromine: "ppm",
                        alkalinity: "ppm",
                        hardness: "ppm",
                        stabilizer: "ppm",
                      };

                      return (
                        <div key={key} className="text-center">
                          <div
                            className={`px-3 py-2 rounded-lg ${statusColor}`}
                          >
                            <div className="text-sm font-medium">
                              {labels[key]}
                            </div>
                            <div className="text-lg font-bold">
                              {value}
                              {units[key] && (
                                <span className="text-xs ml-1">
                                  {units[key]}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>

                {/* Maintenance Work Done */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-900 mb-2">
                    Trabalhos Realizados:
                  </h5>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                    {maintenance.maintenanceWork.filtros && (
                      <span className="text-blue-700">✓ Filtros</span>
                    )}
                    {maintenance.maintenanceWork.preFiltero && (
                      <span className="text-blue-700">✓ Pré-filtro</span>
                    )}
                    {maintenance.maintenanceWork.filtroAreiaVidro && (
                      <span className="text-blue-700">
                        ✓ Filtro Areia/Vidro
                      </span>
                    )}
                    {maintenance.maintenanceWork.alimenta && (
                      <span className="text-blue-700">✓ Alimenta</span>
                    )}
                    {maintenance.maintenanceWork.enchimentoAutomatico && (
                      <span className="text-blue-700">
                        ✓ Enchimento Automático
                      </span>
                    )}
                    {maintenance.maintenanceWork.linhaAgua && (
                      <span className="text-blue-700">✓ Linha Água</span>
                    )}
                  </div>
                  {maintenance.maintenanceWork.outros && (
                    <p className="text-sm text-blue-700 mt-2">
                      <span className="font-medium">Outros:</span>{" "}
                      {maintenance.maintenanceWork.outros}
                    </p>
                  )}
                </div>

                {/* Vehicles */}
                {maintenance.vehicles.length > 0 && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700">
                      <span className="font-medium">Viaturas utilizadas:</span>{" "}
                      {maintenance.vehicles.join(", ")}
                    </p>
                  </div>
                )}

                {maintenance.observations && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Observações:</span>{" "}
                      {maintenance.observations}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
