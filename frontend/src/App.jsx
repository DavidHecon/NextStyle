import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ClientesTab } from './components/clientes/ClientesTab';
import { CitasTab } from './components/citas/CitasTab';
import { BarberosTab } from './components/barberos/BarberosTab';
import { getClientes, getCitas, getBarberos } from './api';

function App() {
  const [activeTab, setActiveTab] = useState('clientes');
  const [clientes, setClientes] = useState([]);
  const [citas, setCitas] = useState([]);
  const [barberos, setBarberos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [clientesRes, citasRes, barberosRes] = await Promise.all([
          getClientes(),
          getCitas(),
          getBarberos()
        ]);
        setClientes(clientesRes.data);
        setCitas(citasRes.data);
        setBarberos(barberosRes.data);
      } catch (err) {
        setError("Error al cargar los datos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpdate = async () => {
    try {
      const [clientesRes, citasRes, barberosRes] = await Promise.all([
        getClientes(),
        getCitas(),
        getBarberos()
      ]);
      setClientes(clientesRes.data);
      setCitas(citasRes.data);
      setBarberos(barberosRes.data);
    } catch (err) {
      console.error("Error al actualizar:", err);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-red-500">
      <h2 className="text-2xl font-bold mb-4">Error</h2>
      <p>{error}</p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Reintentar
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <h1 className="text-4xl font-bold text-center text-[#093F6C] mb-8">Barbería NextStyle - Gestión</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-7xl mx-auto">
        <TabsList className="flex justify-center gap-4 mb-6">
          <TabsTrigger value="clientes">Clientes</TabsTrigger>
          <TabsTrigger value="citas">Citas</TabsTrigger>
          <TabsTrigger value="barberos">Barberos</TabsTrigger>
        </TabsList>

        <TabsContent value="clientes">
          <ClientesTab data={clientes} onUpdate={handleUpdate} />
        </TabsContent>

        <TabsContent value="citas">
          <CitasTab data={citas} barberos={barberos} clientes={clientes} onUpdate={handleUpdate} />
        </TabsContent>

        <TabsContent value="barberos">
          <BarberosTab data={barberos} onUpdate={handleUpdate} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default App;