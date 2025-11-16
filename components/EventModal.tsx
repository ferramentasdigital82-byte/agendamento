import React, { useState, useEffect, useCallback } from 'react';
import { Event } from '../types';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<Event, 'id'>, id?: string) => boolean;
  selectedDate: Date | null;
  eventToEdit?: Event | null;
  onDelete: (eventId: string) => void;
}

const initialEventState = {
  title: '',
  clientName: '',
  startTime: '09:00',
  endTime: '10:00',
  eventType: 'Reunião',
  notes: '',
  contact: '',
};

export const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSave, selectedDate, eventToEdit, onDelete }) => {
  const [eventData, setEventData] = useState<Omit<Event, 'id' | 'date'>>(initialEventState);

  useEffect(() => {
    if (isOpen) {
      if (eventToEdit) {
        const { id, date, ...rest } = eventToEdit;
        setEventData(rest);
      } else {
        setEventData(initialEventState);
      }
    }
  }, [isOpen, eventToEdit]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEventData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;

    const fullEventData = {
      ...eventData,
      date: selectedDate.toISOString().split('T')[0],
    };

    const success = onSave(fullEventData, eventToEdit?.id);
    if (success) {
      onClose();
    }
  }, [eventData, selectedDate, onSave, eventToEdit, onClose]);

  const handleDelete = useCallback(() => {
    if (eventToEdit) {
      if(window.confirm('Tem certeza que deseja excluir este evento?')) {
        onDelete(eventToEdit.id);
        onClose();
      }
    }
  }, [eventToEdit, onDelete, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 transition-opacity duration-300"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col transform transition-all duration-300"
        onClick={e => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <header className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {eventToEdit ? 'Editar Evento' : 'Adicionar Evento'}
              </h2>
              <button 
                type="button" 
                onClick={onClose} 
                className="p-1 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-400"
                aria-label="Fechar modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
             {selectedDate && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>}
          </header>
          
          <main className="p-4 sm:p-6 space-y-4 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Título do Evento</label>
                <input type="text" name="title" id="title" value={eventData.title} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700"/>
              </div>
               <div>
                <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome do Cliente</label>
                <input type="text" name="clientName" id="clientName" value={eventData.clientName} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700"/>
              </div>
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Hora de Início</label>
                <input type="time" name="startTime" id="startTime" value={eventData.startTime} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700"/>
              </div>
              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Hora de Fim</label>
                <input type="time" name="endTime" id="endTime" value={eventData.endTime} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700"/>
              </div>
            </div>
             <div>
              <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de Evento</label>
              <select name="eventType" id="eventType" value={eventData.eventType} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700">
                <option>Reunião</option>
                <option>Consulta</option>
                <option>Ligação</option>
                <option>Apresentação</option>
                <option>Outro</option>
              </select>
            </div>
             <div>
              <label htmlFor="contact" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contato (Telefone/Email)</label>
              <input type="text" name="contact" id="contact" value={eventData.contact || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700"/>
            </div>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notas Adicionais</label>
              <textarea name="notes" id="notes" rows={3} value={eventData.notes} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700"></textarea>
            </div>
          </main>

          <footer className="p-4 sm:p-6 flex flex-col sm:flex-row-reverse sm:items-center gap-2 border-t border-gray-200 dark:border-gray-700 mt-auto">
            <button
              type="submit"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm"
            >
              {eventToEdit ? 'Salvar Alterações' : 'Criar Evento'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Cancelar
            </button>
             {eventToEdit && (
              <button
                type="button"
                onClick={handleDelete}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm sm:mr-auto"
              >
                Excluir Evento
              </button>
            )}
          </footer>
        </form>
      </div>
    </div>
  );
};
