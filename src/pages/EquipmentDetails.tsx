import { useParams, useNavigate } from "react-router-dom";
import { useEquipment } from "@/contexts/EquipmentContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wind, Trash2, Pencil, Loader2 } from "lucide-react";

const EquipmentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { equipments, deleteEquipment, loading } = useEquipment();

  const numericId = id ? parseInt(id, 10) : undefined;
  const equipment = equipments.find((eq) => eq.id === numericId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-16 w-16 text-primary animate-spin" />
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Wind className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h1 className="text-2xl font-bold">Equipamento não encontrado</h1>
          <Button onClick={() => navigate("/")} className="mt-4">
            Voltar para a lista
          </Button>
        </div>
      </div>
    );
  }

  const showBeltFields = equipment.modelo === "Fancoil" || equipment.modelo === "Exaustor" || equipment.modelo === "Ventilador";
  const showHvacFields = equipment.modelo === "Hiwall" || equipment.modelo === "Cassete" || equipment.modelo === "Piso Teto";
  const showFilterFields = equipment.modelo === "Fancoil" || equipment.modelo === "Ventilador";

  const handleDelete = async () => {
    if (window.confirm("Tem certeza que deseja excluir este equipamento?")) {
      await deleteEquipment(equipment.id);
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-lg bg-gradient-to-br from-primary to-accent">
              <Wind className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">{equipment.tag}</h1>
              <p className="text-muted-foreground">{equipment.modelo}</p>
            </div>
          </div>
        </div>

        <Card className="p-6 border-border bg-card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Marca:</span>
                <span className="font-medium text-foreground">{equipment.marca}</span>
              </div>
              {showHvacFields && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Fluido Refrigerante:</span>
                    <span className="font-medium text-foreground">{equipment.fluido}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Capacidade:</span>
                    <span className="font-medium text-foreground">{equipment.capacidade} BTU/h</span>
                  </div>
                </>
              )}
              {showBeltFields && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Modelo da Correia:</span>
                    <span className="font-medium text-foreground">{equipment.modelo_correia}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Quantidade de Correias:</span>
                    <span className="font-medium text-foreground">{equipment.quantidade_correias}</span>
                  </div>
                </>
              )}
              {equipment.localEvaporadora ? (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Local Evaporadora:</span>
                    <span className="font-medium text-foreground">{equipment.localEvaporadora}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Local Condensadora:</span>
                    <span className="font-medium text-foreground">{equipment.localCondensadora}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Local:</span>
                  <span className="font-medium text-foreground">{equipment.local}</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Corrente Nominal (A):</span>
                <span className="font-medium text-foreground">{equipment.corrente}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tensão Nominal (V):</span>
                <span className="font-medium text-foreground">{equipment.tensao}</span>
              </div>
              {showHvacFields && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Reversão:</span>
                  <span className="font-medium text-foreground">{equipment.reversao}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Trifásico:</span>
                <span className="font-medium text-foreground">{equipment.trifasico}</span>
              </div>
            </div>
          </div>
        </Card>

        {showFilterFields && equipment.filtros && equipment.filtros.length > 0 && (
          <Card className="p-6 border-border bg-card mb-6">
            <h3 className="text-lg font-medium text-foreground mb-4">Filtros</h3>
            <div className="space-y-2">
              {equipment.filtros.map((filtro, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 text-sm p-2 border-b">
                  <div>
                    <span className="text-muted-foreground">Modelo: </span>
                    <span className="font-medium text-foreground">{filtro.modelo_filtro}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tamanho: </span>
                    <span className="font-medium text-foreground">{filtro.tamanho_filtro}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Quantidade: </span>
                    <span className="font-medium text-foreground">{filtro.quantidade_filtro}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        <div className="flex gap-4">
          <Button onClick={() => navigate("/")} size="lg" variant="outline" className="flex-1 gap-2">
            Voltar
          </Button>
          <Button onClick={() => navigate(`/editar-equipamento/${equipment.id}`)} size="lg" className="flex-1 gap-2">
            <Pencil className="h-5 w-5" />
            Editar
          </Button>
          <Button onClick={handleDelete} size="lg" variant="destructive" className="flex-1 gap-2">
            <Trash2 className="h-5 w-5" />
            Excluir
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetails;
