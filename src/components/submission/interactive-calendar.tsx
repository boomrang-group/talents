
"use client";

import { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from 'lucide-react';

// Mock event data - UPDATED for current competition phase
const competitionEvents = [
  { date: new Date(2024, 7, 4), title: "Début de la Compétition", description: "Lancement officiel et ouverture des soumissions." }, // August 4
  { date: new Date(2024, 7, 31), title: "Deadline Soumission Projets", description: "Dernier jour pour soumettre vos projets." }, // August 31
  { date: new Date(2024, 8, 5), title: "Début Votes Publics", description: "La phase de vote public commence." }, // September 5
  { date: new Date(2024, 8, 20), title: "Annonce des Finalistes", description: "Les finalistes seront annoncés." }, // September 20
];

export default function InteractiveCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<{title: string; description: string} | null>(null);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const eventOnDate = competitionEvents.find(event => 
        event.date.getFullYear() === date.getFullYear() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getDate() === date.getDate()
      );
      setSelectedEvent(eventOnDate || null);
    } else {
      setSelectedEvent(null);
    }
  };

  return (
    <div className="space-y-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleDateSelect}
        className="rounded-md border shadow"
        // Disable past dates - optional
        // disabled={(date) => date < new Date(new Date().setDate(new Date().getDate()-1))} 
        modifiers={{
          eventDay: competitionEvents.map(event => event.date)
        }}
        modifiersStyles={{
          eventDay: {
            fontWeight: 'bold',
            color: 'hsl(var(--primary))', // Use primary color for event days
            border: '2px solid hsl(var(--primary))',
            borderRadius: 'var(--radius)',
          }
        }}
      />
      {selectedEvent && (
        <Alert className="bg-primary/10 border-primary/30 text-primary">
          <Info className="h-5 w-5 text-primary" />
          <AlertTitle className="font-semibold text-primary">{selectedEvent.title}</AlertTitle>
          <AlertDescription className="text-primary/80">
            {selectedEvent.description}
          </AlertDescription>
        </Alert>
      )}
      {!selectedEvent && selectedDate && (
         <Alert variant="default">
          <Info className="h-5 w-5" />
          <AlertTitle>Information</AlertTitle>
          <AlertDescription>
            Aucun événement spécial prévu pour cette date. Vérifiez les dates en surbrillance.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
