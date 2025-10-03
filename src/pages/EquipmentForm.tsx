import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Wind } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EquipmentForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    tag: "",
    modelo: "",
    fluido: "",
    capacidade: "",
    local: "",
    corrente: "",
    tensao: "",
    reversao: "",
    trifasico: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica
    if (!formData.tag || !formData.modelo || !formData.fluido) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    // Aqui será integrado com Supabase
    toast({
      title: "Equipamento cadastrado!",
      description: `Tag ${formData.tag} salvo com sucesso.`,
    });

    setTimeout(() => navigate("/"), 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-gradient-to-br from-primary to-accent">
              <Wind className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Novo Equipamento</h1>
              <p className="text-muted-foreground">Cadastre um novo equipamento HVAC</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <Card className="p-8 bg-card border-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tag */}
            <div className="space-y-2">
              <Label htmlFor="tag" className="text-foreground font-medium">
                Tag do Equipamento *
              </Label>
              <Input
                id="tag"
                placeholder="Ex: FC-001"
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                className="h-11 bg-background border-border"
                required
              />
              <p className="text-xs text-muted-foreground">
                Identificação única do equipamento
              </p>
            </div>

            {/* Grid 2 colunas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Modelo */}
              <div className="space-y-2">
                <Label htmlFor="modelo" className="text-foreground font-medium">
                  Modelo *
                </Label>
                <Select
                  value={formData.modelo}
                  onValueChange={(value) => setFormData({ ...formData, modelo: value })}
                  required
                >
                  <SelectTrigger className="h-11 bg-background border-border">
                    <SelectValue placeholder="Selecione o modelo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fancoil">Fancoil</SelectItem>
                    <SelectItem value="Hiwall">Hiwall</SelectItem>
                    <SelectItem value="Cassete">Cassete</SelectItem>
                    <SelectItem value="Piso Teto">Piso Teto</SelectItem>
                    <SelectItem value="Exaustor">Exaustor</SelectItem>
                    <SelectItem value="Ventilador">Ventilador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Fluido */}
              <div className="space-y-2">
                <Label htmlFor="fluido" className="text-foreground font-medium">
                  Fluido Refrigerante *
                </Label>
                <Select
                  value={formData.fluido}
                  onValueChange={(value) => setFormData({ ...formData, fluido: value })}
                  required
                >
                  <SelectTrigger className="h-11 bg-background border-border">
                    <SelectValue placeholder="Selecione o fluido" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="R22">R22</SelectItem>
                    <SelectItem value="R32">R32</SelectItem>
                    <SelectItem value="R410A">R410A</SelectItem>
                    <SelectItem value="R404A">R404A</SelectItem>
                    <SelectItem value="N/A">N/A</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Capacidade */}
              <div className="space-y-2">
                <Label htmlFor="capacidade" className="text-foreground font-medium">
                  Capacidade BTU/h
                </Label>
                <Select
                  value={formData.capacidade}
                  onValueChange={(value) => setFormData({ ...formData, capacidade: value })}
                >
                  <SelectTrigger className="h-11 bg-background border-border">
                    <SelectValue placeholder="Selecione a capacidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9.000">9.000</SelectItem>
                    <SelectItem value="12.000">12.000</SelectItem>
                    <SelectItem value="18.000">18.000</SelectItem>
                    <SelectItem value="24.000">24.000</SelectItem>
                    <SelectItem value="30.000">30.000</SelectItem>
                    <SelectItem value="36.000">36.000</SelectItem>
                    <SelectItem value="42.000">42.000</SelectItem>
                    <SelectItem value="48.000">48.000</SelectItem>
                    <SelectItem value="58.000">58.000</SelectItem>
                    <SelectItem value="60.000">60.000</SelectItem>
                    <SelectItem value="N/A">N/A</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Local */}
              <div className="space-y-2">
                <Label htmlFor="local" className="text-foreground font-medium">
                  Local de Instalação
                </Label>
                <Input
                  id="local"
                  placeholder="Ex: Sala 101"
                  value={formData.local}
                  onChange={(e) => setFormData({ ...formData, local: e.target.value })}
                  className="h-11 bg-background border-border"
                />
              </div>

              {/* Corrente */}
              <div className="space-y-2">
                <Label htmlFor="corrente" className="text-foreground font-medium">
                  Corrente (A)
                </Label>
                <Input
                  id="corrente"
                  type="text"
                  placeholder="Ex: 12.5"
                  value={formData.corrente}
                  onChange={(e) => setFormData({ ...formData, corrente: e.target.value })}
                  className="h-11 bg-background border-border"
                />
              </div>

              {/* Tensão */}
              <div className="space-y-2">
                <Label htmlFor="tensao" className="text-foreground font-medium">
                  Tensão (V)
                </Label>
                <Input
                  id="tensao"
                  type="text"
                  placeholder="Ex: 220"
                  value={formData.tensao}
                  onChange={(e) => setFormData({ ...formData, tensao: e.target.value })}
                  className="h-11 bg-background border-border"
                />
              </div>

              {/* Reversão */}
              <div className="space-y-2">
                <Label htmlFor="reversao" className="text-foreground font-medium">
                  Reversão de Ciclo
                </Label>
                <Select
                  value={formData.reversao}
                  onValueChange={(value) => setFormData({ ...formData, reversao: value })}
                >
                  <SelectTrigger className="h-11 bg-background border-border">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sim">Sim</SelectItem>
                    <SelectItem value="Não">Não</SelectItem>
                    <SelectItem value="N/A">N/A</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Trifásico */}
              <div className="space-y-2">
                <Label htmlFor="trifasico" className="text-foreground font-medium">
                  Trifásico
                </Label>
                <Select
                  value={formData.trifasico}
                  onValueChange={(value) => setFormData({ ...formData, trifasico: value })}
                >
                  <SelectTrigger className="h-11 bg-background border-border">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sim">Sim</SelectItem>
                    <SelectItem value="Não">Não</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/")}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar Equipamento
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default EquipmentForm;
