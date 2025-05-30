import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { BarberoForm } from './BarberoForm';
import { Button } from "@/components/ui/button";
import { deleteBarbero } from '../../api';

export const BarberosTab = ({ data, onUpdate }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [barberoEdit, setBarberoEdit] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este barbero?')) {
      try {
        await deleteBarbero(id);
        onUpdate();
      } catch (error) {
        console.error("Error eliminando barbero:", error);
      }
    }
  };

  const openEditModal = (barbero) => {
    setBarberoEdit(barbero);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setBarberoEdit(null);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <BarberoForm onSuccess={onUpdate} />

        <div className="mt-6 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Especialidad</TableHead>
                <TableHead>Turno</TableHead>
                <TableHead>Activo</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((barbero) => (
                <TableRow key={barbero.id_barbero}>
                  <TableCell>{barbero.id_barbero}</TableCell>
                  <TableCell>{barbero.nombre_barbero}</TableCell>
                  <TableCell>{barbero.telefono_barbero}</TableCell>
                  <TableCell>{barbero.especialidad}</TableCell>
                  <TableCell>{barbero.turno}</TableCell>
                  <TableCell>{barbero.activo ? 'Sí' : 'No'}</TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(barbero)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(barbero.id_barbero)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
              <h2 className="text-xl mb-4">Editar Barbero</h2>
              <BarberoForm
                initialData={barberoEdit}
                onSuccess={() => {
                  onUpdate();
                  closeModal();
                }}
                onCancel={closeModal}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
