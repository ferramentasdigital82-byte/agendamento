import React, { useMemo } from 'react';
import { Event } from '../types';

interface CalendarProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  events: Event[];
  onDateClick: (date: Date) => void;
  onEventClick: (event: Event) => void;
  onDeleteEvent: (eventId: string) => void;
}

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export const Calendar: React.FC<CalendarProps> = ({ currentDate, setCurrentDate, events, onDateClick, onEventClick, onDeleteEvent }) => {

  const firstDayOfMonth = useMemo(() => new Date(currentDate.getFullYear(), currentDate.getMonth(), 1), [currentDate]);
  const daysInMonth = useMemo(() => new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate(), [currentDate]);

  const calendarDays = useMemo(() => {
    const days = [];
    const startingDay = firstDayOfMonth.getDay();
    
    // Add blank days for the previous month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add days of the current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
    }
    return days;
  }, [firstDayOfMonth, daysInMonth, currentDate]);
  
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Mês anterior">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h2 className="text-xl sm:text-2xl font-bold text-center text-blue-600 dark:text-blue-400">
          {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Próximo mês">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center font-semibold text-gray-600 dark:text-gray-400">
        {WEEKDAYS.map(day => <div key={day} className="py-2">{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} className="border border-transparent rounded-lg"></div>;
          }
          const dayString = day.toISOString().split('T')[0];
          const dayEvents = events.filter(e => e.date === dayString).sort((a, b) => a.startTime.localeCompare(b.startTime));

          return (
            <div 
              key={day.toString()} 
              className="relative border border-gray-200 dark:border-gray-700 rounded-lg h-28 sm:h-32 p-1.5 cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors"
              onClick={() => onDateClick(day)}
            >
              <span className={`flex items-center justify-center w-7 h-7 rounded-full text-sm ${isToday(day) ? 'bg-blue-600 text-white font-bold' : ''}`}>
                {day.getDate()}
              </span>
              <div className="mt-1 space-y-1 overflow-y-auto max-h-[calc(100%-2rem)]">
                {dayEvents.map(event => (
                  <div 
                    key={event.id}
                    className="relative group text-left text-xs bg-blue-100 dark:bg-blue-900/50 p-1 rounded-md"
                  >
                    <div onClick={(e) => { e.stopPropagation(); onEventClick(event); }} className="truncate">
                      <span className="font-semibold">{event.startTime}</span> {event.title}
                    </div>
                     <button 
                      onClick={(e) => { e.stopPropagation(); onDeleteEvent(event.id); }}
                      className="absolute top-0.5 right-0.5 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none"
                      aria-label="Excluir evento"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
