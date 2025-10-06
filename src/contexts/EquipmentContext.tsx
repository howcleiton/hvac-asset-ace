import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export interface Equipment {
  id: number;
  tag: string;
  modelo: string;
  marca: string;
  fluido: string;
  capacidade: string;
  local?: string;
  localEvaporadora?: string;
  localCondensadora?: string;
  corrente: string;
  tensao: string;
  reversao: string;
  trifasico: string;
  modelo_correia?: string;
  quantidade_correias?: string;
  filtros?: { modelo_filtro: string; tamanho_filtro: string; quantidade_filtro: string; }[];
}

interface EquipmentContextType {
  equipments: Equipment[];
  loading: boolean;
  addEquipment: (equipment: Omit<Equipment, "id">) => Promise<void>;
  updateEquipment: (id: number, equipment: Omit<Equipment, "id">) => Promise<void>;
  deleteEquipment: (id: number) => Promise<void>;
}

const EquipmentContext = createContext<EquipmentContextType | undefined>(undefined);

export const useEquipment = () => {
  const context = useContext(EquipmentContext);
  if (!context) {
    throw new Error("useEquipment must be used within EquipmentProvider");
  }
  return context;
};

export const EquipmentProvider = ({ children }: { children: ReactNode }) => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEquipments = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("equipamentos").select("*").order('id', { ascending: true });

    if (error) {
      console.error("Error fetching equipments:", error);
    } else {
      setEquipments(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEquipments();
  }, [fetchEquipments]);

  const addEquipment = async (equipment: Omit<Equipment, "id">) => {
    const { data, error } = await supabase.from("equipamentos").insert([equipment]).select();
    if (error) {
      console.error("Error adding equipment:", error);
    } else if (data) {
      await fetchEquipments();
    } else {
      console.error("Error adding equipment: No data returned after insert.");
    }
  };

  const updateEquipment = async (id: number, updatedEquipment: Omit<Equipment, "id">) => {
    const { data, error } = await supabase.from("equipamentos").update(updatedEquipment).eq("id", id).select();
    if (error) {
      console.error("Error updating equipment:", error);
    } else if (data) {
      await fetchEquipments();
    } else {
      console.error("Error updating equipment: No data returned after update.");
    }
  };

  const deleteEquipment = async (id: number) => {
    const { error } = await supabase.from("equipamentos").delete().eq("id", id);
    if (error) {
      console.error("Error deleting equipment:", error);
    } else {
      setEquipments((prev) => prev.filter((eq) => eq.id !== id));
    }
  };

  return (
    <EquipmentContext.Provider value={{ equipments, loading, addEquipment, updateEquipment, deleteEquipment }}>
      {children}
    </EquipmentContext.Provider>
  );
};