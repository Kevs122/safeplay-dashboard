import { useState } from "react";
import Header from "./components/Header";
import MetricsCards from "./components/MetricsCards";
import DistributionChart from "./components/DistributionChart";
import ActivityChart from "./components/ActivityChart";
import EventsTable from "./components/EventsTable";
import EventDetailModal from "./components/EventDetailModal";
import DashboardStatus from "./components/DashboardStatus";
import { useEvents } from "./lib/useEvents";

function App() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { events, loading, error, lastRefresh, refresh } = useEvents(100);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-100 mb-2">
            Panel de moderación
          </h2>
          <p className="text-slate-400">
            Actividad reciente de tu entorno SafePark Demo
          </p>
        </div>

        {/* Status de conexión */}
        <DashboardStatus 
          loading={loading}
          error={error}
          lastRefresh={lastRefresh}
          onRefresh={refresh}
          eventCount={events.length}
        />

        {/* Mostrar contenido solo si hay eventos, estado vacío si no hay */}
        {!loading && !error && events.length === 0 ? (
          <div className="p-16 text-center border-2 border-dashed border-slate-800 rounded-xl">
            <p className="text-slate-400 text-lg mb-2">No hay eventos todavía</p>
            <p className="text-slate-600 text-sm">
              Los eventos aparecerán aquí cuando los jugadores escriban en el chat
            </p>
          </div>
        ) : (
          <>
            {/* Cards de métricas */}
            <MetricsCards events={events} />

            {/* Gráficas lado a lado */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <DistributionChart events={events} />
              <ActivityChart events={events} />
            </div>

            {/* Tabla de eventos */}
            <div className="mt-6">
              <EventsTable 
                events={events} 
                onEventClick={(event) => setSelectedEvent(event)}
              />
            </div>
          </>
        )}
      </main>

      {/* Modal de detalle */}
      <EventDetailModal 
        event={selectedEvent} 
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
}

export default App;