import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export interface Marca {
  id: number;
  nome: string;
}

export interface Local {
  id: number;
  nome: string;
}

interface OptionsContextType {
  marcas: Marca[];
  locais: Local[];
  loading: boolean;
  addMarca: (nome: string) => Promise<void>;
  removeMarca: (id: number) => Promise<void>;
  addLocal: (nome: string) => Promise<void>;
  removeLocal: (id: number) => Promise<void>;
}

const OptionsContext = createContext<OptionsContextType | undefined>(undefined);

export const useOptions = () => {
  const context = useContext(OptionsContext);
  if (!context) {
    throw new Error("useOptions must be used within an OptionsProvider");
  }
  return context;
};

export const OptionsProvider = ({ children }: { children: ReactNode }) => {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [locais, setLocais] = useState<Local[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOptions = useCallback(async () => {
    setLoading(true);
    const { data: marcasData, error: marcasError } = await supabase.from("marcas").select("*");
    const { data: locaisData, error: locaisError } = await supabase.from("locais").select("*");

    if (marcasError) console.error("Error fetching marcas:", marcasError);
    else setMarcas(marcasData || []);

    if (locaisError) console.error("Error fetching locais:", locaisError);
    else setLocais(locaisData || []);

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  const addMarca = async (nome: string) => {
    const { error } = await supabase.from("marcas").insert([{ nome }]);
    if (error) console.error("Error adding marca:", error);
    else await fetchOptions();
  };

  const removeMarca = async (id: number) => {
    const { error } = await supabase.from("marcas").delete().eq("id", id);
    if (error) console.error("Error removing marca:", error);
    else setMarcas(prev => prev.filter(m => m.id !== id));
  };

  const addLocal = async (nome: string) => {
    const { error } = await supabase.from("locais").insert([{ nome }]);
    if (error) console.error("Error adding local:", error);
    else await fetchOptions();
  };

  const removeLocal = async (id: number) => {
    const { error } = await supabase.from("locais").delete().eq("id", id);
    if (error) console.error("Error removing local:", error);
    else setLocais(prev => prev.filter(l => l.id !== id));
  };

  return (
    <OptionsContext.Provider value={{ marcas, locais, loading, addMarca, removeMarca, addLocal, removeLocal }}>
      {children}
    </OptionsContext.Provider>
  );
};
