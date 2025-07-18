import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Users, DollarSign, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Reservation } from '@/types';
import { useAuth } from '@/context/AuthContext';

const Reservations: React.FC = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Simulate API call to fetch user reservations
    const mockReservations: Reservation[] = [
      {
        id: '1',
        userId: user.id,
        roomId: '101',
        checkIn: new Date('2024-08-15'),
        checkOut: new Date('2024-08-18'),
        guests: 2,
        totalPrice: 540,
        status: 'confirmed',
        createdAt: new Date('2024-07-10'),
        version: 1,
      },
      {
        id: '2',
        userId: user.id,
        roomId: '201',
        checkIn: new Date('2024-07-20'),
        checkOut: new Date('2024-07-23'),
        guests: 1,
        totalPrice: 360,
        status: 'confirmed',
        createdAt: new Date('2024-06-15'),
        version: 1,
      },
      {
        id: '3',
        userId: user.id,
        roomId: '301',
        checkIn: new Date('2024-09-10'),
        checkOut: new Date('2024-09-14'),
        guests: 3,
        totalPrice: 1400,
        status: 'cancelled',
        createdAt: new Date('2024-07-05'),
        version: 1,
      },
    ];
    setReservations(mockReservations);
  }, [user]);

  const handleCancelReservation = async (reservationId: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setReservations(prev => 
        prev.map(reservation => 
          reservation.id === reservationId 
            ? { ...reservation, status: 'cancelled' as const }
            : reservation
        )
      );

      toast.success('Reservation cancelled successfully', {
        description: 'Your reservation has been cancelled and refund will be processed.',
      });
    } catch (error) {
      toast.error('Failed to cancel reservation', {
        description: 'Please try again or contact support.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: Reservation['status']) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500">Confirmed</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const filterReservations = (status: 'active' | 'past' | 'cancelled') => {
    const now = new Date();
    return reservations.filter(reservation => {
      switch (status) {
        case 'active':
          return reservation.status === 'confirmed' && reservation.checkOut >= now;
        case 'past':
          return reservation.status === 'confirmed' && reservation.checkOut < now;
        case 'cancelled':
          return reservation.status === 'cancelled';
        default:
          return false;
      }
    });
  };

  const canCancelReservation = (reservation: Reservation) => {
    const now = new Date();
    const checkInDate = new Date(reservation.checkIn);
    const hoursUntilCheckIn = (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return reservation.status === 'confirmed' && hoursUntilCheckIn > 24;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-900">Access Required</CardTitle>
            <CardDescription>
              You must be logged in to view your reservations
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            My Reservations
          </h1>
          <p className="text-lg text-gray-600">
            Manage your hotel bookings and view your reservation history
          </p>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="active" className="text-xs sm:text-sm px-2 py-2">
              <span className="hidden sm:inline">Active Reservations</span>
              <span className="sm:hidden">Active</span>
            </TabsTrigger>
            <TabsTrigger value="past" className="text-xs sm:text-sm px-2 py-2">
              <span className="hidden sm:inline">Past Reservations</span>
              <span className="sm:hidden">Past</span>
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="text-xs sm:text-sm px-2 py-2">
              <span className="hidden sm:inline">Cancelled</span>
              <span className="sm:hidden">Cancelled</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            <div className="grid gap-6">
              {filterReservations('active').length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No active reservations
                    </h3>
                    <p className="text-gray-600">
                      You don't have any upcoming reservations. Book a room to get started!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filterReservations('active').map((reservation) => (
                  <ReservationCard
                    key={reservation.id}
                    reservation={reservation}
                    onCancel={handleCancelReservation}
                    canCancel={canCancelReservation(reservation)}
                    isLoading={isLoading}
                  />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="past" className="space-y-6">
            <div className="grid gap-6">
              {filterReservations('past').length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No past reservations
                    </h3>
                    <p className="text-gray-600">
                      Your completed reservations will appear here.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filterReservations('past').map((reservation) => (
                  <ReservationCard
                    key={reservation.id}
                    reservation={reservation}
                    onCancel={handleCancelReservation}
                    canCancel={false}
                    isLoading={isLoading}
                  />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-6">
            <div className="grid gap-6">
              {filterReservations('cancelled').length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No cancelled reservations
                    </h3>
                    <p className="text-gray-600">
                      Your cancelled reservations will appear here.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filterReservations('cancelled').map((reservation) => (
                  <ReservationCard
                    key={reservation.id}
                    reservation={reservation}
                    onCancel={handleCancelReservation}
                    canCancel={false}
                    isLoading={isLoading}
                  />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

interface ReservationCardProps {
  reservation: Reservation;
  onCancel: (id: string) => void;
  canCancel: boolean;
  isLoading: boolean;
}

const ReservationCard: React.FC<ReservationCardProps> = ({
  reservation,
  onCancel,
  canCancel,
  isLoading,
}) => {
  const getStatusBadge = (status: Reservation['status']) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500">Confirmed</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-white">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl text-gray-900">
              Room #{reservation.roomId}
            </CardTitle>
            <CardDescription className="text-gray-600">
              Reservation ID: {reservation.id}
            </CardDescription>
          </div>
                <div className="text-right">
                  {getStatusBadge(reservation.status)}
                </div>
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
                <p className="text-sm text-gray-600">Guests</p>
                <p className="font-medium">{reservation.guests} guest{reservation.guests > 1 ? 's' : ''}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <DollarSign className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Total Price</p>
                <p className="font-medium text-lg">${reservation.totalPrice}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center space-y-3">
            <p className="text-sm text-gray-600">
              Booked on {format(new Date(reservation.createdAt), 'MMM dd, yyyy')}
            </p>
            
            {canCancel && (
              <Button
                variant="destructive"
                onClick={() => onCancel(reservation.id)}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Cancelling...' : 'Cancel Reservation'}
              </Button>
            )}
            
            {!canCancel && reservation.status === 'confirmed' && (
              <p className="text-xs text-gray-500">
                Cancellation not allowed within 24 hours of check-in
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Reservations;