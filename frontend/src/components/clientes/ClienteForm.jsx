import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCliente } from "../../api";

export const ClienteForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    nombre_cliente: '',
    correo: '',
    telefono_cliente: '',
    frecuente: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCliente(formData);
      onSuccess();
      setFormData({
        nombre_cliente: '',
        correo: '',
        telefono_cliente: '',
        frecuente: false
      });
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
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="frecuente"
            checked={formData.frecuente}
            onChange={(e) => setFormData({...formData, frecuente: e.target.checked})}
            className="h-4 w-4"
          />
          <Label htmlFor="frecuente">Cliente frecuente</Label>
        </div>
      </div>
      <Button type="submit">Crear Cliente</Button>
      
    </form>
  );
};