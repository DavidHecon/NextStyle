import React, { useState, useRef, useEffect } from 'react';  
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCliente } from "../../api";

export const ClienteForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    nombre_cliente: '',
    correo: '',
    telefono_cliente: '',
    notas: ''
  });

const notasOptions = ['Cliente nuevo', 'Cliente frecuente'];
  const [notasInput, setNotasInput] = useState('');
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const sugerenciasRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sugerenciasRef.current && !sugerenciasRef.current.contains(event.target)) {
        setMostrarSugerencias(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotasChange = (e) => {
    setNotasInput(e.target.value);
    setFormData({ ...formData, notas: e.target.value });
    setMostrarSugerencias(true);
  };

  const handleNotasClick = (option) => {
    setNotasInput(option);
    setFormData({ ...formData, notas: option });
    setMostrarSugerencias(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCliente(formData);
      onSuccess();
      setFormData({
        nombre_cliente: '',
        correo: '',
        telefono_cliente: '',
        notas: ''
      });
      setNotasInput('');
    } catch (error) {
      console.error("Error creando cliente:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Nombre</Label>
          <Input
            value={formData.nombre_cliente}
            onChange={(e) => setFormData({...formData, nombre_cliente: e.target.value})}
            required
          />
        </div>
        <div>
          <Label>Correo</Label>
          <Input
            type="email"
            value={formData.correo}
            onChange={(e) => setFormData({...formData, correo: e.target.value})}
            required
          />
        </div>
        <div>
          <Label>Teléfono</Label>
          <Input
            type="tel"
            value={formData.telefono_cliente}
            onChange={(e) => setFormData({...formData, telefono_cliente: e.target.value})}
            required
          />
        </div>

        {/* Campo texto con sugerencias */}
        <div className="relative" ref={sugerenciasRef}>
          <Label>Notas</Label>
          <Input
            type="text"
            value={notasInput}
            onChange={handleNotasChange}
            onFocus={() => setMostrarSugerencias(true)}
            autoComplete="off"
            placeholder="Escribe o selecciona"
            required
          />
          {mostrarSugerencias && (
            <ul className="absolute z-10 bg-white border border-gray-300 rounded-md w-64 max-h-48 overflow-auto">
              {notasOptions
                .filter(option => option.toLowerCase().includes(notasInput.toLowerCase()))
                .map((option, i) => (
                <li
                  key={i}
                  onClick={() => handleNotasClick(option)}
                  className="cursor-pointer px-2 py-1 hover:bg-blue-100"
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <Button type="submit">Crear Cliente</Button>
    </form>
  );
};
