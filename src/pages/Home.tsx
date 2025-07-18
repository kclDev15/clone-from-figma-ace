import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wifi, Car, Coffee, Waves, Star, MapPin, Calendar, Users, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Reservation } from '@/types';
import { useAuth } from '@/context/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();
  const [activeReservations, setActiveReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const features = [
    { icon: Wifi, title: 'WiFi Gratuito', description: 'Internet de alta velocidad en todas las habitaciones' },
    { icon: Car, title: 'Estacionamiento', description: 'Estacionamiento gratuito para huéspedes' },
    { icon: Coffee, title: 'Desayuno', description: 'Desayuno continental incluido' },
    { icon: Waves, title: 'Piscina', description: 'Piscina climatizada y gimnasio' },
  ];

  useEffect(() => {
    if (!user) return;

    // Load active reservations from localStorage
    const savedReservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    const now = new Date();
    const userActiveReservations = savedReservations
      .filter((reservation: Reservation) => 
        reservation.userId === user.id && 
        reservation.status === 'confirmed' && 
        new Date(reservation.checkOut) >= now
      )
      .map((reservation: any) => ({
        ...reservation,
        checkIn: new Date(reservation.checkIn),
        checkOut: new Date(reservation.checkOut),
        createdAt: new Date(reservation.createdAt),
      }));
    
    setActiveReservations(userActiveReservations);
  }, [user]);

  const handleCancelReservation = async (reservationId: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update local state
      const updatedReservations = activeReservations.map(reservation => 
        reservation.id === reservationId 
          ? { ...reservation, status: 'cancelled' as const }
          : reservation
      ).filter(reservation => reservation.status !== 'cancelled');
      
      setActiveReservations(updatedReservations);

      // Update localStorage
      const allReservations = JSON.parse(localStorage.getItem('reservations') || '[]');
      const updatedAllReservations = allReservations.map((reservation: Reservation) => 
        reservation.id === reservationId 
          ? { ...reservation, status: 'cancelled' }
          : reservation
      );
      localStorage.setItem('reservations', JSON.stringify(updatedAllReservations));

      toast.success('Reserva cancelada exitosamente', {
        description: 'Tu reserva ha sido cancelada y el reembolso será procesado.',
      });
    } catch (error) {
      toast.error('Error al cancelar la reserva', {
        description: 'Por favor intenta de nuevo o contacta soporte.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const canCancelReservation = (reservation: Reservation) => {
    const now = new Date();
    const checkInDate = new Date(reservation.checkIn);
    const hoursUntilCheckIn = (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return reservation.status === 'confirmed' && hoursUntilCheckIn > 24;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-600 to-purple-800 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Bienvenido a Harmony Hotel
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Experimenta la perfecta armonía entre lujo y comodidad en el corazón de la ciudad
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <NavLink to="/rooms">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 text-lg">
                Ver Habitaciones
              </Button>
            </NavLink>
            <NavLink to="/book">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-3 text-lg">
                Reservar Ahora
              </Button>
            </NavLink>
          </div>
        </div>
      </section>

      {/* Active Reservations Section */}
      {user && activeReservations.length > 0 && (
        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Mis Reservas Activas
              </h2>
              <p className="text-lg text-gray-600">
                Gestiona tus reservas actuales
              </p>
            </div>
            
            <div className="grid gap-6 max-w-4xl mx-auto">
              {activeReservations.map((reservation) => (
                <Card key={reservation.id} className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-gray-900">
                          Habitación #{reservation.roomId}
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                          ID: {reservation.id}
                        </CardDescription>
                      </div>
                      <Badge className="bg-green-500">Confirmada</Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-5 h-5 text-purple-600" />
                          <div>
                            <p className="text-sm text-gray-600">Check-in</p>
                            <p className="font-medium">
                              {format(new Date(reservation.checkIn), 'MMM dd, yyyy')}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-5 h-5 text-purple-600" />
                          <div>
                            <p className="text-sm text-gray-600">Check-out</p>
                            <p className="font-medium">
                              {format(new Date(reservation.checkOut), 'MMM dd, yyyy')}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <Users className="w-5 h-5 text-purple-600" />
                          <div>
                            <p className="text-sm text-gray-600">Huéspedes</p>
                            <p className="font-medium">{reservation.guests} huésped{reservation.guests > 1 ? 's' : ''}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <DollarSign className="w-5 h-5 text-purple-600" />
                          <div>
                            <p className="text-sm text-gray-600">Precio Total</p>
                            <p className="font-medium text-lg">${reservation.totalPrice}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col justify-center space-y-3">
                        {canCancelReservation(reservation) && (
                          <Button
                            variant="destructive"
                            onClick={() => handleCancelReservation(reservation.id)}
                            disabled={isLoading}
                            className="w-full"
                          >
                            {isLoading ? 'Cancelando...' : 'Cancelar Reserva'}
                          </Button>
                        )}
                        
                        {!canCancelReservation(reservation) && (
                          <p className="text-xs text-gray-500 text-center">
                            No se puede cancelar dentro de las 24 horas previas al check-in
                          </p>
                        )}

                        <NavLink to="/reservations" className="w-full">
                          <Button variant="outline" className="w-full">
                            Ver Todas las Reservas
                          </Button>
                        </NavLink>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Servicios Destacados
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Disfruta de nuestros servicios premium diseñados para hacer tu estadía inolvidable
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300 border-purple-100">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 bg-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Una Experiencia Única
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                En Harmony Hotel, cada detalle está cuidadosamente diseñado para ofrecerte 
                una experiencia excepcional. Nuestras habitaciones modernas y elegantes 
                combinan el confort contemporáneo con toques de lujo.
              </p>
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="w-5 h-5 text-purple-600" />
                <span className="text-gray-700">Ubicación céntrica privilegiada</span>
              </div>
              <div className="flex items-center space-x-2 mb-6">
                <Star className="w-5 h-5 text-purple-600" />
                <span className="text-gray-700">Calificación 5 estrellas</span>
              </div>
              <NavLink to="/rooms">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3">
                  Explorar Habitaciones
                </Button>
              </NavLink>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h3 className="font-semibold text-gray-900 mb-2">150+</h3>
                  <p className="text-gray-600">Habitaciones Premium</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h3 className="font-semibold text-gray-900 mb-2">24/7</h3>
                  <p className="text-gray-600">Servicio al Cliente</p>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h3 className="font-semibold text-gray-900 mb-2">5★</h3>
                  <p className="text-gray-600">Calificación Promedio</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h3 className="font-semibold text-gray-900 mb-2">10k+</h3>
                  <p className="text-gray-600">Huéspedes Satisfechos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;