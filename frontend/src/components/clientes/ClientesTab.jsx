import React, { useState, useRef, useEffect } from 'react'; 
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
    notas: '',
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

  const handleEditClick = (cliente) => {
    setEditingCliente(cliente);
    setEditFormData({
      nombre_cliente: cliente.nombre_cliente,
      correo: cliente.correo,
      telefono_cliente: cliente.telefono_cliente,
      notas: cliente.notas || '',
    });
    setNotasInput(cliente.notas || '');
  };

  const handleEditSave = async () => {
    try {
      await updateCliente(editingCliente.id_cliente, { ...editFormData, notas: notasInput });
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

  const handleNotasChange = (e) => {
    setNotasInput(e.target.value);
    setEditFormData({ ...editFormData, notas: e.target.value });
    setMostrarSugerencias(true);
  };

  const handleNotasClick = (option) => {
    setNotasInput(option);
    setEditFormData({ ...editFormData, notas: option });
    setMostrarSugerencias(false);
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
                <TableHead>Notas</TableHead>
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
                  <TableCell>{cliente.notas}</TableCell>
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

      {editingCliente && (
        <Dialog open={!!editingCliente} onOpenChange={() => setEditingCliente(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Cliente</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleEditSave(); }}>
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
                  <ul className="absolute z-10 bg-white border border-gray-300 rounded-md w-full max-h-48 overflow-auto">
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
              
              <DialogFooter>
                <Button type="submit">Guardar</Button>
                <Button variant="cancel" onClick={() => setEditingCliente(null)}>
                  Cancelar
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};
