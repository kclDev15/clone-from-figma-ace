import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Users, Clock, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Room, Reservation, BookingFormData } from '@/types';
import { useAuth } from '@/context/AuthContext';

const bookingSchema = z.object({
  roomId: z.string().min(1, 'Please select a room'),
  checkIn: z.date({
    required_error: 'Please select check-in date',
  }),
  checkOut: z.date({
    required_error: 'Please select check-out date',
  }),
  guests: z.number().min(1, 'Minimum 1 guest').max(6, 'Maximum 6 guests'),
}).refine((data) => data.checkOut > data.checkIn, {
  message: 'Check-out date must be after check-in date',
  path: ['checkOut'],
});

const BookRoom: React.FC = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  
  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      guests: 1,
    },
  });

  // Function to get blocked dates for a specific room
  const getBlockedDatesForRoom = (roomId: string): Date[] => {
    const existingReservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    const blockedDates: Date[] = [];
    
    existingReservations
      .filter((reservation: Reservation) => 
        reservation.roomId === roomId && reservation.status !== 'cancelled'
      )
      .forEach((reservation: Reservation) => {
        const checkIn = new Date(reservation.checkIn);
        const checkOut = new Date(reservation.checkOut);
        
        // Add all dates in the reservation range
        let currentDate = new Date(checkIn);
        while (currentDate <= checkOut) {
          blockedDates.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
      });
    
    return blockedDates;
  };

  // Function to check if room is available for given dates
  const isRoomAvailableForDates = (roomId: string, checkIn: Date, checkOut: Date) => {
    const existingReservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    
    return !existingReservations.some((reservation: Reservation) => {
      if (reservation.roomId !== roomId || reservation.status === 'cancelled') {
        return false;
      }
      
      const reservationCheckIn = new Date(reservation.checkIn);
      const reservationCheckOut = new Date(reservation.checkOut);
      
      // Check for date overlap
      return (
        (checkIn < reservationCheckOut && checkOut > reservationCheckIn)
      );
    });
  };

  // Function to get currently available rooms (not reserved for any future dates)
  const getAvailableRooms = () => {
    const allRooms: Room[] = [
      // Basic Rooms
      {
        id: '1',
        number: '101',
        type: 'basic',
        price: 89,
        amenities: ['WiFi', 'TV', 'Private Bathroom', 'Air Conditioning'],
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400',
        isAvailable: true,
        version: 1,
      },
      {
        id: '2',
        number: '102',
        type: 'basic',
        price: 89,
        amenities: ['WiFi', 'TV', 'Private Bathroom', 'Air Conditioning'],
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400',
        isAvailable: true,
        version: 1,
      },
      {
        id: '3',
        number: '103',
        type: 'basic',
        price: 89,
        amenities: ['WiFi', 'TV', 'Private Bathroom', 'Air Conditioning'],
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400',
        isAvailable: true,
        version: 1,
      },
      {
        id: '9',
        number: '104',
        type: 'basic',
        price: 89,
        amenities: ['WiFi', 'TV', 'Private Bathroom', 'Air Conditioning'],
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
        isAvailable: true,
        version: 1,
      },
      {
        id: '10',
        number: '105',
        type: 'basic',
        price: 95,
        amenities: ['WiFi', 'TV', 'Private Bathroom', 'Air Conditioning', 'Work Desk'],
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
        isAvailable: true,
        version: 1,
      },
      {
        id: '11',
        number: '106',
        type: 'basic',
        price: 89,
        amenities: ['WiFi', 'TV', 'Private Bathroom', 'Air Conditioning'],
        image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400',
        isAvailable: true,
        version: 1,
      },
      // Premium Rooms
      {
        id: '4',
        number: '201',
        type: 'premium',
        price: 149,
        amenities: ['WiFi', 'Smart TV', 'Private Bathroom', 'Air Conditioning', 'Minibar', 'Ocean View', 'Room Service'],
        image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400',
        isAvailable: true,
        version: 1,
      },
      {
        id: '5',
        number: '202',
        type: 'premium',
        price: 149,
        amenities: ['WiFi', 'Smart TV', 'Private Bathroom', 'Air Conditioning', 'Minibar', 'Ocean View', 'Room Service'],
        image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400',
        isAvailable: true,
        version: 1,
      },
      {
        id: '6',
        number: '203',
        type: 'premium',
        price: 149,
        amenities: ['WiFi', 'Smart TV', 'Private Bathroom', 'Air Conditioning', 'Minibar', 'Ocean View', 'Room Service'],
        image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400',
        isAvailable: true,
        version: 1,
      },
      {
        id: '12',
        number: '204',
        type: 'premium',
        price: 159,
        amenities: ['WiFi', 'Smart TV', 'Private Bathroom', 'Air Conditioning', 'Minibar', 'City View', 'Room Service', 'Balcony'],
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400',
        isAvailable: true,
        version: 1,
      },
      {
        id: '13',
        number: '205',
        type: 'premium',
        price: 149,
        amenities: ['WiFi', 'Smart TV', 'Private Bathroom', 'Air Conditioning', 'Minibar', 'Ocean View', 'Room Service'],
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400',
        isAvailable: true,
        version: 1,
      },
      {
        id: '14',
        number: '206',
        type: 'premium',
        price: 165,
        amenities: ['WiFi', 'Smart TV', 'Private Bathroom', 'Air Conditioning', 'Premium Minibar', 'Ocean View', 'Room Service', 'Spa Bath'],
        image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
        isAvailable: true,
        version: 1,
      },
      {
        id: '15',
        number: '207',
        type: 'premium',
        price: 149,
        amenities: ['WiFi', 'Smart TV', 'Private Bathroom', 'Air Conditioning', 'Minibar', 'Garden View', 'Room Service'],
        image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
        isAvailable: true,
        version: 1,
      },
      // VIP Suites
      {
        id: '7',
        number: '301',
        type: 'vip',
        price: 299,
        amenities: ['WiFi', 'Smart TV', 'Luxury Bathroom', 'Climate Control', 'Premium Minibar', 'Ocean View', 'Jacuzzi', 'Living Area', 'Concierge Service', 'Butler Service'],
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400',
        isAvailable: true,
        version: 1,
      },
      {
        id: '8',
        number: '302',
        type: 'vip',
        price: 299,
        amenities: ['WiFi', 'Smart TV', 'Luxury Bathroom', 'Climate Control', 'Premium Minibar', 'Ocean View', 'Jacuzzi', 'Living Area', 'Concierge Service', 'Butler Service'],
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400',
        isAvailable: true,
        version: 1,
      },
      {
        id: '16',
        number: '303',
        type: 'vip',
        price: 349,
        amenities: ['WiFi', 'Smart TV', 'Luxury Bathroom', 'Climate Control', 'Premium Minibar', 'Panoramic View', 'Jacuzzi', 'Living Area', 'Concierge Service', 'Butler Service', 'Private Terrace'],
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400',
        isAvailable: true,
        version: 1,
      },
      {
        id: '17',
        number: '304',
        type: 'vip',
        price: 325,
        amenities: ['WiFi', 'Smart TV', 'Luxury Bathroom', 'Climate Control', 'Premium Minibar', 'Ocean View', 'Jacuzzi', 'Living Area', 'Concierge Service', 'Butler Service', 'Dining Area'],
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400',
        isAvailable: true,
        version: 1,
      },
      {
        id: '18',
        number: '305',
        type: 'vip',
        price: 399,
        amenities: ['WiFi', 'Smart TV', 'Luxury Bathroom', 'Climate Control', 'Premium Minibar', 'Penthouse View', 'Jacuzzi', 'Living Area', 'Concierge Service', 'Butler Service', 'Private Kitchen', 'Wine Cellar'],
        image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400',
        isAvailable: true,
        version: 1,
      },
      {
        id: '19',
        number: '306',
        type: 'vip',
        price: 299,
        amenities: ['WiFi', 'Smart TV', 'Luxury Bathroom', 'Climate Control', 'Premium Minibar', 'Garden View', 'Jacuzzi', 'Living Area', 'Concierge Service', 'Butler Service'],
        image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400',
        isAvailable: true,
        version: 1,
      },
    ];

    const existingReservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    const currentDate = new Date();
    
    // Filter out rooms that have active reservations
    return allRooms.filter(room => {
      const hasActiveReservation = existingReservations.some((reservation: Reservation) => {
        if (reservation.roomId !== room.id || reservation.status === 'cancelled') {
          return false;
        }
        
        const checkOutDate = new Date(reservation.checkOut);
        return checkOutDate > currentDate; // Room is reserved until checkout date
      });
      
      return !hasActiveReservation;
    });
  };

  useEffect(() => {
    setRooms(getAvailableRooms());
  }, []);

  // Update calendar when selectedRoom changes or when reservations change
  useEffect(() => {
    // Force re-render of calendar when room selection changes
    if (selectedRoom) {
      // Reset form dates to ensure calendar updates with new blocked dates
      const currentCheckIn = form.getValues('checkIn');
      const currentCheckOut = form.getValues('checkOut');
      
      if (currentCheckIn) {
        const blockedDates = getBlockedDatesForRoom(selectedRoom.id);
        const isCheckInBlocked = blockedDates.some(date => 
          date.toDateString() === currentCheckIn.toDateString()
        );
        
        if (isCheckInBlocked) {
          form.setValue('checkIn', undefined as any);
          form.setValue('checkOut', undefined as any);
          toast.warning('Fechas seleccionadas no disponibles', {
            description: 'Las fechas que seleccionaste están ocupadas para esta habitación.',
            duration: 3000,
          });
        }
      }
    }
  }, [selectedRoom, form]);

  const watchedRoomId = form.watch('roomId');
  
  useEffect(() => {
    if (watchedRoomId) {
      const room = rooms.find(r => r.id === watchedRoomId);
      setSelectedRoom(room || null);
    } else {
      setSelectedRoom(null);
    }
  }, [watchedRoomId, rooms]);

  const calculateTotalPrice = (checkIn: Date, checkOut: Date, roomPrice: number) => {
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    return nights * roomPrice;
  };

  const checkConcurrencyAndReserve = async (roomId: string, checkIn: Date, checkOut: Date) => {
    // Crear un lock temporal para esta transacción
    const lockKey = `room_lock_${roomId}_${checkIn.toISOString()}_${checkOut.toISOString()}`;
    const lockTimeout = 10000; // 10 segundos
    const lockTimestamp = Date.now();
    
    // Intentar obtener el lock
    const existingLock = localStorage.getItem(lockKey);
    if (existingLock) {
      const lockData = JSON.parse(existingLock);
      if (Date.now() - lockData.timestamp < lockTimeout) {
        throw new Error('ROOM_BEING_BOOKED');
      }
    }
    
    // Establecer el lock
    localStorage.setItem(lockKey, JSON.stringify({
      timestamp: lockTimestamp,
      userId: user?.id
    }));
    
    try {
      // Verificar disponibilidad una vez más con el lock activo
      await new Promise(resolve => setTimeout(resolve, 100)); // Simular latencia
      
      const currentReservations = JSON.parse(localStorage.getItem('reservations') || '[]');
      const isStillAvailable = !currentReservations.some((reservation: Reservation) => {
        if (reservation.roomId !== roomId || reservation.status === 'cancelled') {
          return false;
        }
        
        const reservationCheckIn = new Date(reservation.checkIn);
        const reservationCheckOut = new Date(reservation.checkOut);
        
        return (checkIn < reservationCheckOut && checkOut > reservationCheckIn);
      });
      
      if (!isStillAvailable) {
        throw new Error('ROOM_UNAVAILABLE_DATES');
      }
      
      // Simular procesamiento de reserva
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return true;
      
    } finally {
      // Liberar el lock después del procesamiento
      setTimeout(() => {
        localStorage.removeItem(lockKey);
      }, 1000);
    }
  };

  const onSubmit = async (data: BookingFormData) => {
    if (!user || !selectedRoom) return;

    setIsLoading(true);
    
    try {
      // Double-check room availability for specific dates before booking
      if (!isRoomAvailableForDates(data.roomId, data.checkIn, data.checkOut)) {
        throw new Error('ROOM_UNAVAILABLE_DATES');
      }
      
      // Attempt booking with concurrency control
      await checkConcurrencyAndReserve(data.roomId, data.checkIn, data.checkOut);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const totalPrice = calculateTotalPrice(data.checkIn, data.checkOut, selectedRoom.price);
      
      const reservation: Reservation = {
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        roomId: data.roomId,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        guests: data.guests,
        totalPrice,
        status: 'confirmed',
        createdAt: new Date(),
        version: 1,
      };

      // Save reservation to localStorage
      const existingReservations = JSON.parse(localStorage.getItem('reservations') || '[]');
      const updatedReservations = [...existingReservations, reservation];
      localStorage.setItem('reservations', JSON.stringify(updatedReservations));

      // Update room availability list - remove reserved room from available list
      setRooms(getAvailableRooms());

      toast.success('Reservation confirmed!', {
        description: `Your reservation for room ${selectedRoom.number} has been confirmed. Total: $${totalPrice}`,
        duration: 5000,
      });

      form.reset();
      setSelectedRoom(null);

    } catch (error) {
      if (error instanceof Error && (error.message === 'ROOM_BEING_BOOKED' || error.message === 'ROOM_UNAVAILABLE_DATES')) {
        const errorMessage = error.message === 'ROOM_BEING_BOOKED' 
          ? 'Otra persona está reservando esta habitación en este momento.'
          : 'La habitación ya no está disponible para estas fechas.';
        
        toast.error(errorMessage, {
          description: 'Por favor, selecciona otra habitación o fechas diferentes.',
          duration: 5000,
        });
        
        // Refresh room availability list
        setRooms(getAvailableRooms());
        
        // Clear the selected room
        form.setValue('roomId', '');
        setSelectedRoom(null);
      } else {
        toast.error('Error processing reservation', {
          description: 'Please try again.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getRoomTypeTitle = (type: Room['type']) => {
    switch (type) {
      case 'basic':
        return 'Basic Room';
      case 'premium':
        return 'Premium Room';
      case 'vip':
        return 'VIP Suite';
      default:
        return 'Room';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-900">Access Required</CardTitle>
            <CardDescription>
              You must be logged in to make a reservation. Only authenticated users can book rooms.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Book a Room
          </h1>
          <p className="text-lg text-gray-600">
            Select your ideal room and choose your stay dates
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-purple-600" />
                <span>Reservation Details</span>
              </CardTitle>
              <CardDescription>
                Complete the information for your reservation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="roomId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Room</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a room" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {rooms.map((room) => (
                              <SelectItem key={room.id} value={room.id}>
                                {getRoomTypeTitle(room.type)} #{room.number} - ${room.price}/night
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="checkIn"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Check-in Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Select date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => {
                                  // Disable past dates
                                  if (date < new Date() || date < new Date("1900-01-01")) {
                                    return true;
                                  }
                                  
                                  // Disable blocked dates for selected room
                                  if (selectedRoom) {
                                    const blockedDates = getBlockedDatesForRoom(selectedRoom.id);
                                    return blockedDates.some(blockedDate => 
                                      date.toDateString() === blockedDate.toDateString()
                                    );
                                  }
                                  
                                  return false;
                                }}
                                initialFocus
                                className="p-3 pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="checkOut"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Check-out Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Select date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => {
                                  // Disable past dates
                                  if (date < new Date() || date < new Date("1900-01-01")) {
                                    return true;
                                  }
                                  
                                  // Disable dates before check-in
                                  const checkInDate = form.watch('checkIn');
                                  if (checkInDate && date <= checkInDate) {
                                    return true;
                                  }
                                  
                                  // Disable blocked dates for selected room
                                  if (selectedRoom) {
                                    const blockedDates = getBlockedDatesForRoom(selectedRoom.id);
                                    return blockedDates.some(blockedDate => 
                                      date.toDateString() === blockedDate.toDateString()
                                    );
                                  }
                                  
                                  return false;
                                }}
                                initialFocus
                                className="p-3 pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="guests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>Number of Guests</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            max="6"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div className="text-sm text-yellow-800">
                        <p className="font-medium">Control de Concurrencia Optimista</p>
                        <p>
                          Nuestro sistema utiliza control de versión para garantizar que solo una persona pueda reservar cada habitación para las mismas fechas. 
                          Si alguien más reserva la habitación seleccionada mientras completas el formulario, 
                          verás el mensaje "La habitación ya no está disponible" y podrás seleccionar otra habitación.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || !selectedRoom}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3"
                  >
                    {isLoading ? 'Processing Reservation...' : 'Book Now'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Room Preview */}
          {selectedRoom && (
            <Card>
              <CardHeader>
                <CardTitle>Room Preview</CardTitle>
                <CardDescription>
                  {getRoomTypeTitle(selectedRoom.type)} #{selectedRoom.number}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <img
                    src={selectedRoom.image}
                    alt={`Habitación ${selectedRoom.number}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Price per night:</span>
                      <span className="text-xl font-bold text-purple-600">
                        ${selectedRoom.price}
                      </span>
                    </div>
                    
                    {form.watch('checkIn') && form.watch('checkOut') && (
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="font-medium">Total:</span>
                        <span className="text-2xl font-bold text-purple-600">
                          ${calculateTotalPrice(
                            form.watch('checkIn'),
                            form.watch('checkOut'),
                            selectedRoom.price
                          )}
                        </span>
                      </div>
                    )}
                   </div>

                   {/* Blocked dates indicator */}
                   <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                     <h4 className="font-medium mb-2 text-red-800 flex items-center">
                       <CalendarIcon className="w-4 h-4 mr-2" />
                       Fechas Ocupadas
                     </h4>
                     <div className="text-sm text-red-700">
                       {(() => {
                         const blockedDates = getBlockedDatesForRoom(selectedRoom.id);
                         if (blockedDates.length === 0) {
                           return <span className="text-green-700">✓ No hay fechas ocupadas para esta habitación</span>;
                         }
                         
                         // Group consecutive dates
                         const groupedDates: string[] = [];
                         let start = blockedDates[0];
                         let end = blockedDates[0];
                         
                         for (let i = 1; i < blockedDates.length; i++) {
                           const currentDate = blockedDates[i];
                           const prevDate = blockedDates[i - 1];
                           
                           if (currentDate.getTime() - prevDate.getTime() === 24 * 60 * 60 * 1000) {
                             end = currentDate;
                           } else {
                             if (start.toDateString() === end.toDateString()) {
                               groupedDates.push(format(start, 'dd/MM/yyyy'));
                             } else {
                               groupedDates.push(`${format(start, 'dd/MM/yyyy')} - ${format(end, 'dd/MM/yyyy')}`);
                             }
                             start = currentDate;
                             end = currentDate;
                           }
                         }
                         
                         // Add the last group
                         if (start.toDateString() === end.toDateString()) {
                           groupedDates.push(format(start, 'dd/MM/yyyy'));
                         } else {
                           groupedDates.push(`${format(start, 'dd/MM/yyyy')} - ${format(end, 'dd/MM/yyyy')}`);
                         }
                         
                         return (
                           <div className="space-y-1">
                             {groupedDates.slice(0, 3).map((dateRange, index) => (
                               <div key={index}>• {dateRange}</div>
                             ))}
                             {groupedDates.length > 3 && (
                               <div className="text-xs">... y {groupedDates.length - 3} más</div>
                             )}
                           </div>
                         );
                       })()}
                     </div>
                   </div>

                   <div>
                     <h4 className="font-medium mb-2">Included amenities:</h4>
                     <div className="flex flex-wrap gap-2">
                       {selectedRoom.amenities.map((amenity, index) => (
                         <span
                           key={index}
                           className="bg-purple-100 text-purple-700 px-2 py-1 rounded-md text-sm"
                         >
                           {amenity}
                         </span>
                       ))}
                     </div>
                   </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookRoom;