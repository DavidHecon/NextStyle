import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { CitaForm } from './CitaForm';
import { Button } from "@/components/ui/button";
import { deleteCita, updateCita } from '../../api';  // Asumo que tienes updateCita implementado
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"; // Si usas select personalizado

// Función para crear una cita
const createCita = async (data) => {
  const response = await fetch("http://localhost:3001/api/citas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Error al crear cita: ${response.statusText}`);
  }
  return await response.json();
};

export const CitasTab = ({ data, barberos, clientes, onUpdate }) => {
  const [editingCita, setEditingCita] = useState(null);
  const [editFormData, setEditFormData] = useState({
    fecha: '',
    hora: '',
    servicio: '',
    id_cliente: '',
    id_barbero: ''
  });

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta cita?')) {
      try {
        await deleteCita(id);
        onUpdate();
      } catch (error) {
        console.error("Error eliminando cita:", error);
      }
    }
  };

  const getNombreCliente = (id) => {
    const cliente = clientes.find(c => c.id_cliente === id);
    return cliente ? cliente.nombre_cliente : 'N/A';
  };

  const getNombreBarbero = (id) => {
    const barbero = barberos.find(b => b.id_barbero === id);
    return barbero ? barbero.nombre_barbero : 'N/A';
  };

  // Al hacer click en editar, carga los datos de la cita al formulario y abre modal
  const handleEditClick = (cita) => {
    setEditingCita(cita);
    setEditFormData({
      fecha: cita.fecha.slice(0,10), // por si viene en formato ISO completo
      hora: cita.hora,
      servicio: cita.servicio,
      id_cliente: cita.id_cliente,
      id_barbero: cita.id_barbero,
    });
  };

  // Guardar cambios
  const handleEditSave = async () => {
    try {
      await updateCita(editingCita.id_cita, editFormData);
      onUpdate();
      setEditingCita(null);
    } catch (error) {
      console.error("Error actualizando cita:", error);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <CitaForm 
          barberos={barberos} 
          clientes={clientes} 
          onSuccess={onUpdate} 
          createCita={createCita} 
        />
        
        <div className="mt-6 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead>Servicio</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Barbero</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map(cita => (
                <TableRow key={cita.id_cita}>
                  <TableCell>{cita.id_cita}</TableCell>
                  <TableCell>{new Date(cita.fecha).toLocaleDateString()}</TableCell>
                  <TableCell>{cita.hora}</TableCell>
                  <TableCell>{cita.servicio}</TableCell>
                  <TableCell>{getNombreCliente(cita.id_cliente)}</TableCell>
                  <TableCell>{getNombreBarbero(cita.id_barbero)}</TableCell>
                  <TableCell className="space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEditClick(cita)}
                    >
                      Editar
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDelete(cita.id_cita)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Modal para editar cita */}
      {editingCita && (
        <Dialog open={!!editingCita} onOpenChange={() => setEditingCita(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Cita</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleEditSave(); }}>
              <div>
                <Label>Fecha</Label>
                <Input
                  type="date"
                  value={editFormData.fecha}
                  onChange={e => setEditFormData({ ...editFormData, fecha: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Hora</Label>
                <Input
                  type="time"
                  value={editFormData.hora}
                  onChange={e => setEditFormData({ ...editFormData, hora: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Servicio</Label>
                <Input
                  value={editFormData.servicio}
                  onChange={e => setEditFormData({ ...editFormData, servicio: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Cliente</Label>
                <select
                  value={editFormData.id_cliente}
                  onChange={e => setEditFormData({ ...editFormData, id_cliente: e.target.value })}
                  required
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="">Selecciona un cliente</option>
                  {clientes.map(cliente => (
                    <option key={cliente.id_cliente} value={cliente.id_cliente}>
                      {cliente.nombre_cliente}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Barbero</Label>
                <select
                  value={editFormData.id_barbero}
                  onChange={e => setEditFormData({ ...editFormData, id_barbero: e.target.value })}
                  required
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="">Selecciona un barbero</option>
                  {barberos.map(barbero => (
                    <option key={barbero.id_barbero} value={barbero.id_barbero}>
                      {barbero.nombre_barbero}
                    </option>
                  ))}
                </select>
              </div>
            </form>
            <DialogFooter>
              <Button onClick={handleEditSave}>
                Guardar
              </Button>
              <Button variant="cancel" onClick={() => setEditingCita(null)}>
                Cancelar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};
