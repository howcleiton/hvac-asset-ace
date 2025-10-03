import { createContext, useContext, useState, ReactNode } from "react";

export interface Equipment {
  id: string;
  tag: string;
  modelo: string;
  marca: string;
  fluido: string;
  capacidade: string;
  local: string;
  corrente: string;
  tensao: string;
  reversao: string;
  trifasico: string;
}

interface EquipmentContextType {
  equipments: Equipment[];
  addEquipment: (equipment: Omit<Equipment, "id">) => void;
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
  const [equipments, setEquipments] = useState<Equipment[]>([
    {
      id: "1",
      tag: "FC-001",
      modelo: "Fancoil",
      marca: "Carrier",
      fluido: "R410A",
      capacidade: "24.000",
      local: "Sala 101",
      corrente: "12.5",
      tensao: "220",
      reversao: "Sim",
      trifasico: "Não",
    },
    {
      id: "2",
      tag: "HW-002",
      modelo: "Hiwall",
      marca: "Daikin",
      fluido: "R32",
      capacidade: "18.000",
      local: "Escritório Central",
      corrente: "8.3",
      tensao: "220",
      reversao: "Sim",
      trifasico: "Não",
    },
  ]);

  const addEquipment = (equipment: Omit<Equipment, "id">) => {
    const newEquipment = {
      ...equipment,
      id: Date.now().toString(),
    };
    setEquipments((prev) => [...prev, newEquipment]);
  };

  return (
    <EquipmentContext.Provider value={{ equipments, addEquipment }}>
      {children}
    </EquipmentContext.Provider>
  );
};
