
export interface Event {
  id: string;
  date: string; // YYYY-MM-DD format
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  title: string; // Event Name
  clientName: string;
  eventType: string;
  notes: string;
  contact?: string; // Optional
}
