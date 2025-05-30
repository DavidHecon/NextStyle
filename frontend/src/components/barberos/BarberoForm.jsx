import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBarbero, updateBarbero } from "../../api";

export const BarberoForm = ({ onSuccess, initialData = null, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre_barbero: '',
    telefono_barbero: '',
    especialidad: '',
    turno: '',
    activo: true,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre_barbero: initialData.nombre_barbero || '',
        telefono_barbero: initialData.telefono_barbero || '',
        especialidad: initialData.especialidad || '',
        turno: initialData.turno || '',
        activo: initialData.activo ?? true,
      });
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (initialData && initialData.id_barbero) {
        await updateBarbero(initialData.id_barbero, formData);
      } else {
        await createBarbero(formData);
      }
      onSuccess();
      setFormData({
        nombre_barbero: '',
        telefono_barbero: '',
        especialidad: '',
        turno: '',
        activo: true,
      });
      if (onCancel) onCancel();
    } catch (error) {
      console.error("Error guardando barbero:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Nombre</Label>
          <Input
            value={formData.nombre_barbero}
            onChange={(e) => setFormData({ ...formData, nombre_barbero: e.target.value })}
            required
          />
        </div>
        <div>
          <Label>Teléfono</Label>
          <Input
            type="tel"
            value={formData.telefono_barbero}
            onChange={(e) => setFormData({ ...formData, telefono_barbero: e.target.value })}
            required
          />
        </div>
        <div>
          <Label>Especialidad</Label>
          <Input
            value={formData.especialidad}
            onChange={(e) => setFormData({ ...formData, especialidad: e.target.value })}
            required
          />
        </div>
        <div>
          <Label>Turno</Label>
          <select
            value={formData.turno}
            onChange={(e) => setFormData({ ...formData, turno: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="">Selecciona un turno</option>
            <option value="mañana">Mañana</option>
            <option value="tarde">Tarde</option>
            <option value="noche">Noche</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="activo"
            checked={formData.activo}
            onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
            className="h-4 w-4"
          />
          <Label htmlFor="activo">Activo</Label>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button type="submit" variant="default">
          {initialData ? 'Actualizar' : 'Crear'} Barbero
        </Button>
        {onCancel && (
          <Button type="button" variant="cancel" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
};
