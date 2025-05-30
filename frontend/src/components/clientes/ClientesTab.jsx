import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ClienteForm } from './ClienteForm';
import { Button } from "@/components/ui/button";
import { deleteCliente, updateCliente } from '../../api';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export const ClientesTab = ({ data, onUpdate }) => {
  const [editingCliente, setEditingCliente] = useState(null);
  const [editFormData, setEditFormData] = useState({
    nombre_cliente: '',
    correo: '',
    telefono_cliente: '',
    frecuente: false,
  });

  const handleEditClick = (cliente) => {
    setEditingCliente(cliente);
    setEditFormData({
      nombre_cliente: cliente.nombre_cliente,
      correo: cliente.correo,
      telefono_cliente: cliente.telefono_cliente,
      frecuente: cliente.frecuente,
    });
  };

  const handleEditSave = async () => {
    try {
      await updateCliente(editingCliente.id_cliente, editFormData);
      onUpdate();
      setEditingCliente(null);
    } catch (error) {
      console.error("Error actualizando cliente:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este cliente?')) {
      try {
        await deleteCliente(id);
        onUpdate();
      } catch (error) {
        console.error("Error eliminando cliente:", error);
      }
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <ClienteForm onSuccess={onUpdate} />

        <div className="mt-6 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Frecuente</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map(cliente => (
                <TableRow key={cliente.id_cliente}>
                  <TableCell>{cliente.id_cliente}</TableCell>
                  <TableCell>{cliente.nombre_cliente}</TableCell>
                  <TableCell>{cliente.correo}</TableCell>
                  <TableCell>{cliente.telefono_cliente}</TableCell>
                  <TableCell>{cliente.frecuente ? 'Sí' : 'No'}</TableCell>
                  <TableCell className="space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEditClick(cliente)}
                    >
                      Editar
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDelete(cliente.id_cliente)}
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

      {/* Modal para editar cliente */}
      {editingCliente && (
        <Dialog open={!!editingCliente} onOpenChange={() => setEditingCliente(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Cliente</DialogTitle>
            </DialogHeader>
            <form className="space-y-4">
              <div>
                <Label>Nombre</Label>
                <Input
                  value={editFormData.nombre_cliente}
                  onChange={(e) => setEditFormData({ ...editFormData, nombre_cliente: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Correo</Label>
                <Input
                  type="email"
                  value={editFormData.correo}
                  onChange={(e) => setEditFormData({ ...editFormData, correo: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Teléfono</Label>
                <Input
                  type="tel"
                  value={editFormData.telefono_cliente}
                  onChange={(e) => setEditFormData({ ...editFormData, telefono_cliente: e.target.value })}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="frecuente"
                  checked={editFormData.frecuente}
                  onChange={(e) => setEditFormData({ ...editFormData, frecuente: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="frecuente">Cliente frecuente</Label>
              </div>
            </form>
            <DialogFooter>
              <Button onClick={handleEditSave}>Guardar</Button>
              <Button variant="cancel" onClick={() => setEditingCliente(null)}>
                Cancelar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};
