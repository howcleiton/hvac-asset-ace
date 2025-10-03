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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowLeft, Save, Wind, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EquipmentForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    tag: "",
    modelo: "",
    marca: "",
    fluido: "",
    capacidade: "",
    local: "",
    corrente: "",
    tensao: "",
    reversao: "",
    trifasico: "",
  });

  const [marcas, setMarcas] = useState<string[]>(["Carrier", "Daikin", "Midea", "Springer"]);
  const [locais, setLocais] = useState<string[]>(["Sala 101", "Sala 102", "Recepção", "Almoxarifado"]);
  const [newMarca, setNewMarca] = useState("");
  const [newLocal, setNewLocal] = useState("");
  const [marcaDialogOpen, setMarcaDialogOpen] = useState(false);
  const [localDialogOpen, setLocalDialogOpen] = useState(false);

  const handleAddMarca = () => {
    if (newMarca.trim() && !marcas.includes(newMarca.trim())) {
      setMarcas([...marcas, newMarca.trim()]);
      setNewMarca("");
      toast({
        title: "Marca adicionada!",
        description: `${newMarca} foi adicionada com sucesso.`,
      });
    }
  };

  const handleRemoveMarca = (marca: string) => {
    setMarcas(marcas.filter(m => m !== marca));
    toast({
      title: "Marca removida!",
      description: `${marca} foi removida com sucesso.`,
    });
  };

  const handleAddLocal = () => {
    if (newLocal.trim() && !locais.includes(newLocal.trim())) {
      setLocais([...locais, newLocal.trim()]);
      setNewLocal("");
      toast({
        title: "Local adicionado!",
        description: `${newLocal} foi adicionado com sucesso.`,
      });
    }
  };

  const handleRemoveLocal = (local: string) => {
    setLocais(locais.filter(l => l !== local));
    toast({
      title: "Local removido!",
      description: `${local} foi removido com sucesso.`,
    });
  };

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

        {/* Management Buttons */}
        <div className="flex gap-3 mb-6">
          <Dialog open={marcaDialogOpen} onOpenChange={setMarcaDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1">
                <Plus className="h-4 w-4 mr-2" />
                Gerenciar Marcas
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Gerenciar Marcas</DialogTitle>
                <DialogDescription>
                  Adicione ou remova marcas de equipamentos
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Nome da marca"
                    value={newMarca}
                    onChange={(e) => setNewMarca(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddMarca())}
                  />
                  <Button onClick={handleAddMarca} type="button">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {marcas.map((marca) => (
                    <div key={marca} className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <span>{marca}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveMarca(marca)}
                        type="button"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={localDialogOpen} onOpenChange={setLocalDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1">
                <Plus className="h-4 w-4 mr-2" />
                Gerenciar Locais
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Gerenciar Locais</DialogTitle>
                <DialogDescription>
                  Adicione ou remova locais de instalação
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Nome do local"
                    value={newLocal}
                    onChange={(e) => setNewLocal(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLocal())}
                  />
                  <Button onClick={handleAddLocal} type="button">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {locais.map((local) => (
                    <div key={local} className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <span>{local}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveLocal(local)}
                        type="button"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
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

              {/* Marca */}
              <div className="space-y-2">
                <Label htmlFor="marca" className="text-foreground font-medium">
                  Marca *
                </Label>
                <Select
                  value={formData.marca}
                  onValueChange={(value) => setFormData({ ...formData, marca: value })}
                  required
                >
                  <SelectTrigger className="h-11 bg-background border-border">
                    <SelectValue placeholder="Selecione a marca" />
                  </SelectTrigger>
                  <SelectContent>
                    {marcas.map((marca) => (
                      <SelectItem key={marca} value={marca}>
                        {marca}
                      </SelectItem>
                    ))}
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
                <Select
                  value={formData.local}
                  onValueChange={(value) => setFormData({ ...formData, local: value })}
                >
                  <SelectTrigger className="h-11 bg-background border-border">
                    <SelectValue placeholder="Selecione o local" />
                  </SelectTrigger>
                  <SelectContent>
                    {locais.map((local) => (
                      <SelectItem key={local} value={local}>
                        {local}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
