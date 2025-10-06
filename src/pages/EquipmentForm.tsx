import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { useToast } from "@/components/ui/use-toast";
import { useEquipment, Equipment } from "@/contexts/EquipmentContext";
import { useOptions } from "@/contexts/OptionsContext";

const EquipmentForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { addEquipment, equipments, updateEquipment } = useEquipment();
  const { marcas, locais, addMarca, removeMarca, addLocal, removeLocal } = useOptions();

  const numericId = id ? parseInt(id, 10) : undefined;
  const isEditMode = !!numericId;

  const [formData, setFormData] = useState<Omit<Equipment, "id">>({
    tag: "",
    modelo: "",
    marca: "",
    fluido: "",
    capacidade: "",
    local: "",
    localEvaporadora: "",
    localCondensadora: "",
    corrente: "",
    tensao: "",
    reversao: "",
    trifasico: "",
    modelo_correia: "",
    quantidade_correias: "",
    filtros: [],
  });

  useEffect(() => {
    if (isEditMode && equipments.length > 0) {
      const equipmentToEdit = equipments.find((eq) => eq.id === numericId);
      if (equipmentToEdit) {
        const { id, ...dataToEdit } = equipmentToEdit;
        setFormData(dataToEdit);
      }
    }
  }, [numericId, isEditMode, equipments]);

  useEffect(() => {
    if (!isEditMode) {
        setFormData(currentData => ({
        ...currentData,
        local: "",
        localEvaporadora: "",
        localCondensadora: "",
      }));
    }
  }, [formData.modelo, isEditMode]);

  const [newMarca, setNewMarca] = useState("");
  const [newLocal, setNewLocal] = useState("");
  const [marcaDialogOpen, setMarcaDialogOpen] = useState(false);
  const [localDialogOpen, setLocalDialogOpen] = useState(false);

  const handleAddMarca = async () => {
    if (newMarca.trim() && !marcas.find(m => m.nome.toLowerCase() === newMarca.trim().toLowerCase())) {
      await addMarca(newMarca.trim());
      setNewMarca("");
      toast({
        title: "Marca adicionada!",
        description: `${newMarca} foi adicionada com sucesso.`,
      });
    }
  };

  const handleRemoveMarca = async (id: number) => {
    await removeMarca(id);
    toast({
      title: "Marca removida!",
    });
  };

  const handleAddLocal = async () => {
    if (newLocal.trim() && !locais.find(l => l.nome.toLowerCase() === newLocal.trim().toLowerCase())) {
      await addLocal(newLocal.trim());
      setNewLocal("");
      toast({
        title: "Local adicionado!",
        description: `${newLocal} foi adicionado com sucesso.`,
      });
    }
  };

  const handleRemoveLocal = async (id: number) => {
    await removeLocal(id);
    toast({
      title: "Local removido!",
    });
  };

  const showBeltFields = formData.modelo === "Fancoil" || formData.modelo === "Exaustor" || formData.modelo === "Ventilador";
  const showHvacFields = formData.modelo === "Hiwall" || formData.modelo === "Cassete" || formData.modelo === "Piso Teto";
  const showFilterFields = formData.modelo === "Fancoil" || formData.modelo === "Ventilador";

  const handleFilterChange = (index: number, field: string, value: string) => {
    const newFilters = [...(formData.filtros || [])];
    newFilters[index] = { ...newFilters[index], [field]: value };
    setFormData({ ...formData, filtros: newFilters });
  };

  const addFilter = () => {
    const newFilters = [...(formData.filtros || []), { modelo_filtro: "", tamanho_filtro: "", quantidade_filtro: "" }];
    setFormData({ ...formData, filtros: newFilters });
  };

  const removeFilter = (index: number) => {
    const newFilters = [...(formData.filtros || [])];
    newFilters.splice(index, 1);
    setFormData({ ...formData, filtros: newFilters });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const baseValidation = formData.tag && formData.modelo && formData.marca;
    const hvacValidation = showHvacFields && formData.fluido;

    if (!baseValidation || (showHvacFields && !hvacValidation)) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const tagExists = equipments.some(
      (eq) => eq.tag.toLowerCase() === formData.tag.toLowerCase() && eq.id !== numericId
    );

    if (tagExists) {
      toast({
        title: "Erro!",
        description: "Já existe um equipamento com esta TAG.",
        variant: "destructive",
      });
      return;
    }

    if (isEditMode && numericId) {
      await updateEquipment(numericId, formData);
      toast({
        title: "Equipamento atualizado!",
        description: `Tag ${formData.tag} atualizada com sucesso.`,
      });
      setTimeout(() => navigate(`/equipamento/${numericId}`), 1000);
    } else {
      await addEquipment(formData);
      toast({
        title: "Equipamento cadastrado!",
        description: `Tag ${formData.tag} salvo com sucesso.`,
      });
      setTimeout(() => navigate("/"), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(isEditMode ? `/equipamento/${numericId}` : "/")}
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
              <h1 className="text-4xl font-bold text-foreground">
                {isEditMode ? "Editar Equipamento" : "Novo Equipamento"}
              </h1>
              <p className="text-muted-foreground">
                {isEditMode
                  ? "Atualize os detalhes do equipamento HVAC"
                  : "Cadastre um novo equipamento HVAC"}
              </p>
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
                    onChange={(e) => setNewMarca(e.target.value.toUpperCase())}
                    style={{ textTransform: "uppercase" }}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddMarca())}
                  />
                  <Button onClick={handleAddMarca} type="button">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {marcas.map((marca) => (
                    <div key={marca.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <span>{marca.nome}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveMarca(marca.id)}
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
                    onChange={(e) => setNewLocal(e.target.value.toUpperCase())}
                    style={{ textTransform: "uppercase" }}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLocal())}
                  />
                  <Button onClick={handleAddLocal} type="button">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {locais.map((local) => (
                    <div key={local.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <span>{local.nome}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveLocal(local.id)}
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
                onChange={(e) => setFormData({ ...formData, tag: e.target.value.toUpperCase() })}
                style={{ textTransform: "uppercase" }}
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
                      <SelectItem key={marca.id} value={marca.nome}>
                        {marca.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {showHvacFields && (
                <>
                  {/* Fluido */}
                  <div className="space-y-2">
                    <Label htmlFor="fluido" className="text-foreground font-medium">
                      Fluido Refrigerante *
                    </Label>
                    <Select
                      value={formData.fluido}
                      onValueChange={(value) => setFormData({ ...formData, fluido: value })}
                      required={showHvacFields}
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
                </>
              )}

              {showBeltFields && (
                <>
                  {/* Modelo da Correia */}
                  <div className="space-y-2">
                    <Label htmlFor="modelo_correia" className="text-foreground font-medium">
                      Modelo da Correia
                    </Label>
                    <Input
                      id="modelo_correia"
                      placeholder="Ex: A-30"
                      value={formData.modelo_correia}
                      onChange={(e) => setFormData({ ...formData, modelo_correia: e.target.value.toUpperCase() })}
                      style={{ textTransform: "uppercase" }}
                      className="h-11 bg-background border-border"
                    />
                  </div>

                  {/* Quantidade de Correias */}
                  <div className="space-y-2">
                    <Label htmlFor="quantidade_correias" className="text-foreground font-medium">
                      Quantidade de Correias
                    </Label>
                    <Select
                      value={formData.quantidade_correias}
                      onValueChange={(value) => setFormData({ ...formData, quantidade_correias: value })}
                    >
                      <SelectTrigger className="h-11 bg-background border-border">
                        <SelectValue placeholder="Selecione a quantidade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {showHvacFields ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="localEvaporadora" className="text-foreground font-medium">
                      Local da Evaporadora
                    </Label>
                    <Select
                      value={formData.localEvaporadora}
                      onValueChange={(value) =>
                        setFormData({ ...formData, localEvaporadora: value })
                      }
                    >
                      <SelectTrigger className="h-11 bg-background border-border">
                        <SelectValue placeholder="Selecione o local" />
                      </SelectTrigger>
                      <SelectContent>
                        {locais.map((local) => (
                          <SelectItem key={local.id} value={local.nome}>
                            {local.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="localCondensadora" className="text-foreground font-medium">
                      Local da Condensadora
                    </Label>
                    <Select
                      value={formData.localCondensadora}
                      onValueChange={(value) =>
                        setFormData({ ...formData, localCondensadora: value })
                      }
                    >
                      <SelectTrigger className="h-11 bg-background border-border">
                        <SelectValue placeholder="Selecione o local" />
                      </SelectTrigger>
                      <SelectContent>
                        {locais.map((local) => (
                          <SelectItem key={local.id} value={local.nome}>
                            {local.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              ) : (
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
                        <SelectItem key={local.id} value={local.nome}>
                          {local.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Corrente */}
              <div className="space-y-2">
                <Label htmlFor="corrente" className="text-foreground font-medium">
                  Corrente Nominal (A)
                </Label>
                <Input
                  id="corrente"
                  type="text"
                  placeholder="Ex: 12.5"
                  value={formData.corrente}
                  onChange={(e) => setFormData({ ...formData, corrente: e.target.value.toUpperCase() })}
                  style={{ textTransform: "uppercase" }}
                  className="h-11 bg-background border-border"
                />
              </div>

              {/* Tensão */}
              <div className="space-y-2">
                <Label htmlFor="tensao" className="text-foreground font-medium">
                  Tensão Nominal (V)
                </Label>
                <Select
                  value={formData.tensao}
                  onValueChange={(value) => setFormData({ ...formData, tensao: value })}
                >
                  <SelectTrigger className="h-11 bg-background border-border">
                    <SelectValue placeholder="Selecione a tensão" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="127V">127V</SelectItem>
                    <SelectItem value="220V">220V</SelectItem>
                    <SelectItem value="380V">380V</SelectItem>
                    <SelectItem value="440V">440V</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {showHvacFields && (
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
              )}

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

            {/* Filtros Dinâmicos */}
            {showFilterFields && (
              <div className="space-y-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-foreground">Filtros</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addFilter}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Filtro
                  </Button>
                </div>
                {formData.filtros?.map((filtro, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end p-4 border rounded-lg">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor={`modelo_filtro_${index}`}>Modelo de Filtro</Label>
                      <Select
                        value={filtro.modelo_filtro}
                        onValueChange={(value) => handleFilterChange(index, "modelo_filtro", value)}
                      >
                        <SelectTrigger id={`modelo_filtro_${index}`} className="h-11 bg-background border-border">
                          <SelectValue placeholder="Selecione o modelo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Filtro Manta">Filtro Manta</SelectItem>
                          <SelectItem value="Filtro Cartonado">Filtro Cartonado</SelectItem>
                          <SelectItem value="Filtro Absoluto">Filtro Absoluto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`tamanho_filtro_${index}`}>Tamanho do Filtro</Label>
                      <Input
                        id={`tamanho_filtro_${index}`}
                        placeholder="Ex: 595x595x50"
                        value={filtro.tamanho_filtro}
                        onChange={(e) => handleFilterChange(index, "tamanho_filtro", e.target.value.toUpperCase())}
                        style={{ textTransform: "uppercase" }}
                        className="h-11 bg-background border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`quantidade_filtro_${index}`}>Quantidade</Label>
                      <Input
                        id={`quantidade_filtro_${index}`}
                        type="number"
                        placeholder="Ex: 2"
                        value={filtro.quantidade_filtro}
                        onChange={(e) => handleFilterChange(index, "quantidade_filtro", e.target.value.toUpperCase())}
                        style={{ textTransform: "uppercase" }}
                        className="h-11 bg-background border-border"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFilter(index)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(isEditMode ? `/equipamento/${numericId}` : "/")}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
              >
                <Save className="h-4 w-4 mr-2" />
                {isEditMode ? "Salvar Alterações" : "Salvar Equipamento"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default EquipmentForm;