
import React, { useState, useCallback, useEffect } from 'react';
import { Calendar } from './components/Calendar';
import { EventModal } from './components/EventModal';
import { Event } from './types';

const APP_STORAGE_KEY = 'calendarEvents';

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Load events from localStorage or use initial sample data
  const [events, setEvents] = useState<Event[]>(() => {
    try {
      const savedEvents = localStorage.getItem(APP_STORAGE_KEY);
      if (savedEvents) {
        return JSON.parse(savedEvents);
      }
    } catch (error) {
      console.error("Failed to parse events from localStorage", error);
    }
    // If nothing in localStorage or parsing fails, use sample data
    return [
      {
        id: '1',
        date: new Date().toISOString().split('T')[0],
        startTime: '10:00',
        endTime: '11:00',
        title: 'Reunião de Equipe',
        clientName: 'Equipe Interna',
        eventType: 'Reunião',
        notes: 'Discutir o progresso do projeto.',
      }
    ];
  });
  
  // Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDateClick = useCallback((date: Date) => {
    setSelectedDate(date);
    setEditingEvent(null); // Ensure we are creating a new event
    setIsModalOpen(true);
  }, []);

  const handleEventClick = useCallback((event: Event) => {
    setEditingEvent(event);
    // Use Z to indicate UTC and avoid timezone issues when creating the date object
    setSelectedDate(new Date(event.date + 'T00:00:00Z'));
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedDate(null);
    setEditingEvent(null);
  }, []);

  const handleSaveEvent = useCallback((eventData: Omit<Event, 'id'>, idToUpdate?: string) => {
    // Conflict detection, excluding the event being edited from the check
    const eventsForDay = events.filter(e => e.date === eventData.date && e.id !== idToUpdate);
    const newStartTime = eventData.date + 'T' + eventData.startTime;
    const newEndTime = eventData.date + 'T' + eventData.endTime;

    const hasConflict = eventsForDay.some(event => {
      const existingStartTime = event.date + 'T' + event.startTime;
      const existingEndTime = event.date + 'T' + event.endTime;
      // Overlap condition: (StartA < EndB) and (EndA > StartB)
      return newStartTime < existingEndTime && newEndTime > existingStartTime;
    });

    if (hasConflict) {
      alert('Erro: Já existe um evento neste horário.');
      return false;
    }
    
    if (newStartTime >= newEndTime) {
      alert('Erro: A hora de fim deve ser posterior à hora de início.');
      return false;
    }
    
    if (idToUpdate) {
        setEvents(prev => prev.map(e => e.id === idToUpdate ? { ...eventData, id: idToUpdate } : e));
    } else {
        setEvents(prev => [...prev, { ...eventData, id: Date.now().toString() }]);
    }
    return true;
  }, [events]);
  
  const handleDeleteEvent = useCallback((eventId: string) => {
      setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
  }, []);


  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400">SaaS de Agendamento</h1>
          <p className="text-lg mt-2 text-gray-600 dark:text-gray-400">Sua agenda, simplificada e inteligente.</p>
        </header>
        <main>
          <Calendar 
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            events={events}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
            onDeleteEvent={handleDeleteEvent}
          />
        </main>
      </div>
      <EventModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEvent}
        selectedDate={selectedDate}
        eventToEdit={editingEvent}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
};

export default App;
