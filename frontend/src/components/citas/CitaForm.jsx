import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const serviciosDisponibles = [
  "Corte de cabello",
  "Afeitado",
  "Corte + Afeitado",
  "Coloración",
  "Tratamiento capilar",
];

export const CitaForm = ({ barberos, clientes, onSuccess, initialData = null, createCita, updateCita }) => {
  const [formData, setFormData] = useState({
    fecha: '',
    hora: '',
    servicio: '',
    id_cliente: '',
    nombre_cliente: '',
    id_barbero: ''
  });

  // Estado para servicio con sugerencias
  const [servicioInput, setServicioInput] = useState('');
  const [mostrarSugerenciasServicio, setMostrarSugerenciasServicio] = useState(false);
  const sugerenciasServicioRef = useRef(null);

  // Para clientes
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredClientes, setFilteredClientes] = useState([]);
  const suggestionsRef = useRef(null);

  // Para barberos
  const [barberoInput, setBarberoInput] = useState('');
  const [barberosFiltrados, setBarberosFiltrados] = useState([]);
  const [mostrarSugerenciasBarbero, setMostrarSugerenciasBarbero] = useState(false);
  const sugerenciasBarberoRef = useRef(null);

  // Carga inicial con datos (si hay)
  useEffect(() => {
    if (initialData) {
      const clienteSeleccionado = clientes.find(c => c.id_cliente === initialData.id_cliente);
      const barberoSeleccionado = barberos.find(b => b.id_barbero === initialData.id_barbero);

      setFormData({
        fecha: initialData.fecha || '',
        hora: initialData.hora || '',
        servicio: initialData.servicio || '',
        id_cliente: initialData.id_cliente || '',
        nombre_cliente: clienteSeleccionado ? clienteSeleccionado.nombre_cliente : '',
        id_barbero: initialData.id_barbero || ''
      });

      setServicioInput(initialData.servicio || '');
      setBarberoInput(barberoSeleccionado ? barberoSeleccionado.nombre_barbero : '');
    }
  }, [initialData, clientes, barberos]);

  // Manejo clientes
  const handleClienteChange = (e) => {
    const input = e.target.value;
    setFormData({ ...formData, nombre_cliente: input, id_cliente: '' });
    if (input.length > 0) {
      const filtrados = clientes.filter(c =>
        c.nombre_cliente.toLowerCase().includes(input.toLowerCase())
      );
      setFilteredClientes(filtrados);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (cliente) => {
    setFormData({
      ...formData,
      nombre_cliente: cliente.nombre_cliente,
      id_cliente: cliente.id_cliente
    });
    setShowSuggestions(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Manejo barberos
  const handleBarberoFocus = () => {
    setBarberosFiltrados(barberos.filter(b => b.activo === 1 || b.activo === true));
    setMostrarSugerenciasBarbero(true);
  };

  const handleBarberoChange = (e) => {
    const valor = e.target.value;
    setBarberoInput(valor);
    const filtrados = barberos
      .filter(b => (b.activo === 'true' || b.activo === true) && b.nombre_barbero.toLowerCase().includes(valor.toLowerCase()));
    setBarberosFiltrados(filtrados);
    setMostrarSugerenciasBarbero(true);
    setFormData({ ...formData, id_barbero: '' });
  };

  const handleBarberoClick = (barbero) => {
    setBarberoInput(barbero.nombre_barbero);
    setFormData({ ...formData, id_barbero: barbero.id_barbero });
    setMostrarSugerenciasBarbero(false);
  };

  useEffect(() => {
    const handleClickFuera = (e) => {
      if (sugerenciasBarberoRef.current && !sugerenciasBarberoRef.current.contains(e.target)) {
        setMostrarSugerenciasBarbero(false);
      }
    };
    document.addEventListener('mousedown', handleClickFuera);
    return () => document.removeEventListener('mousedown', handleClickFuera);
  }, []);

  // Manejo servicio con sugerencias
  const handleServicioFocus = () => {
    setMostrarSugerenciasServicio(true);
  };

  const handleServicioChange = (e) => {
    setServicioInput(e.target.value);
    setFormData({ ...formData, servicio: e.target.value });
    // No filtramos ni ocultamos la lista mientras escribes
  };

  const handleServicioClick = (servicio) => {
    setServicioInput(servicio);
    setFormData({ ...formData, servicio });
    setMostrarSugerenciasServicio(false);
  };

  useEffect(() => {
    const handleClickFueraServicio = (e) => {
      if (sugerenciasServicioRef.current && !sugerenciasServicioRef.current.contains(e.target)) {
        setMostrarSugerenciasServicio(false);
      }
    };
    document.addEventListener('mousedown', handleClickFueraServicio);
    return () => document.removeEventListener('mousedown', handleClickFueraServicio);
  }, []);

  // Submit con creación o actualización
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.id_cliente) {
        alert("Por favor selecciona un cliente válido de la lista");
        return;
      }
      if (!formData.id_barbero) {
        alert("Por favor selecciona un barbero válido de la lista");
        return;
      }

      if (initialData?.id_cita) {
        await updateCita(initialData.id_cita, {
          ...formData,
          fecha: new Date(formData.fecha).toISOString().split('T')[0]
        });
      } else {
        await createCita({
          ...formData,
          fecha: new Date(formData.fecha).toISOString().split('T')[0]
        });
      }

      onSuccess();

      setFormData({
        fecha: '',
        hora: '',
        servicio: '',
        id_cliente: '',
        nombre_cliente: '',
        id_barbero: ''
      });
      setServicioInput('');
      setBarberoInput('');
    } catch (error) {
      console.error("Error al guardar la cita:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-4 relative">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div>
          <Label>Fecha</Label>
          <Input
            type="date"
            value={formData.fecha}
            onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
            required
          />
        </div>

        <div>
          <Label>Hora</Label>
          <Input
            type="time"
            value={formData.hora}
            onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
            required
          />
        </div>

        {/* Servicio modificado */}
        <div className="relative" ref={sugerenciasServicioRef}>
          <Label>Servicio</Label>
          <Input
            type="text"
            value={servicioInput}
            onChange={handleServicioChange}
            onFocus={handleServicioFocus}
            autoComplete="off"
            placeholder="Escribe o selecciona un servicio"
            required
          />
          {mostrarSugerenciasServicio && (
            <ul className="absolute z-10 bg-white border border-gray-300 rounded-md w-full max-h-48 overflow-auto">
              {serviciosDisponibles.map((servicio, i) => (
                <li
                  key={i}
                  onClick={() => handleServicioClick(servicio)}
                  className="cursor-pointer px-2 py-1 hover:bg-blue-100"
                >
                  {servicio}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Cliente con sugerencias */}
        <div className="relative">
          <Label>Cliente</Label>
          <Input
            type="text"
            value={formData.nombre_cliente}
            onChange={handleClienteChange}
            autoComplete="off"
            required
          />
          {showSuggestions && filteredClientes.length > 0 && (
            <ul
              ref={suggestionsRef}
              className="absolute z-10 bg-white border border-gray-300 rounded-md w-full max-h-48 overflow-auto"
            >
              {filteredClientes.map(cliente => (
                <li
                  key={cliente.id_cliente}
                  onClick={() => handleSuggestionClick(cliente)}
                  className="cursor-pointer px-2 py-1 hover:bg-blue-100"
                >
                  {cliente.nombre_cliente}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Barbero con sugerencias */}
        <div className="relative" ref={sugerenciasBarberoRef}>
          <Label>Barbero</Label>
          <Input
            type="text"
            value={barberoInput}
            onFocus={handleBarberoFocus}
            onChange={handleBarberoChange}
            autoComplete="off"
            placeholder="Seleccione un barbero"
            required
          />
          {mostrarSugerenciasBarbero && barberosFiltrados.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 rounded-md w-full max-h-48 overflow-auto">
              {barberosFiltrados.map(barbero => (
                <li
                  key={barbero.id_barbero}
                  onClick={() => handleBarberoClick(barbero)}
                  className="cursor-pointer px-2 py-1 hover:bg-blue-100"
                >
                  {barbero.nombre_barbero}
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>

      <Button type="submit" disabled={!formData.id_cliente || !formData.id_barbero}>
        {initialData?.id_cita ? 'Actualizar Cita' : 'Crear Cita'}
      </Button>
    </form>
  );
};
