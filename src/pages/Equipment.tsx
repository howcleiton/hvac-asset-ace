import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, Search, Wind } from "lucide-react";
import { useEquipment } from "@/contexts/EquipmentContext";

const Equipment = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { equipments } = useEquipment();

  const filteredEquipments = equipments.filter(
    (eq) =>
      eq.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.local.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-lg bg-gradient-to-br from-primary to-accent">
              <Wind className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Equipamentos HVAC</h1>
              <p className="text-muted-foreground">Gerenciamento de equipamentos de climatização</p>
            </div>
          </div>
        </div>

        {/* Search and Add */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Buscar por Tag, Modelo ou Local..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 bg-card border-border"
            />
          </div>
          <Button
            onClick={() => navigate("/cadastro")}
            size="lg"
            className="h-12 gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
          >
            <Plus className="h-5 w-5" />
            Novo Equipamento
          </Button>
        </div>

        {/* Equipment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEquipments.map((equipment) => (
            <Card
              key={equipment.id}
              className="p-6 hover:shadow-lg transition-all duration-300 border-border bg-card"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-primary/10">
                    <Wind className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground">{equipment.tag}</h3>
                    <p className="text-sm text-muted-foreground">{equipment.modelo}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Local:</span>
                  <span className="font-medium text-foreground">{equipment.local}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Capacidade:</span>
                  <span className="font-medium text-foreground">{equipment.capacidade} BTU/h</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fluido:</span>
                  <span className="font-medium text-foreground">{equipment.fluido}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tensão:</span>
                  <span className="font-medium text-foreground">{equipment.tensao}V</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border flex gap-2">
                {equipment.reversao === "Sim" && (
                  <span className="px-2 py-1 text-xs rounded-full bg-accent/10 text-accent font-medium">
                    Reversão
                  </span>
                )}
                {equipment.trifasico === "Sim" && (
                  <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary font-medium">
                    Trifásico
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>

        {filteredEquipments.length === 0 && (
          <div className="text-center py-12">
            <Wind className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground text-lg">
              {searchTerm ? "Nenhum equipamento encontrado" : "Nenhum equipamento cadastrado"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Equipment;
