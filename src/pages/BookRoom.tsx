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

  useEffect(() => {
    // Simulate API call to fetch available rooms
    const mockRooms: Room[] = [
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
        number: '103',
        type: 'basic',
        price: 89,
        amenities: ['WiFi', 'TV', 'Private Bathroom', 'Air Conditioning'],
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400',
        isAvailable: true,
        version: 1,
      },
      // Premium Rooms
      {
        id: '3',
        number: '201',
        type: 'premium',
        price: 149,
        amenities: ['WiFi', 'Smart TV', 'Private Bathroom', 'Air Conditioning', 'Minibar', 'Ocean View'],
        image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400',
        isAvailable: true,
        version: 1,
      },
      {
        id: '4',
        number: '203',
        type: 'premium',
        price: 149,
        amenities: ['WiFi', 'Smart TV', 'Private Bathroom', 'Air Conditioning', 'Minibar', 'Ocean View'],
        image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400',
        isAvailable: true,
        version: 1,
      },
      // VIP Suites
      {
        id: '5',
        number: '301',
        type: 'vip',
        price: 299,
        amenities: ['WiFi', 'Smart TV', 'Luxury Bathroom', 'Climate Control', 'Premium Minibar', 'Ocean View', 'Jacuzzi', 'Living Area'],
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400',
        isAvailable: true,
        version: 1,
      },
    ];
    setRooms(mockRooms.filter(room => room.isAvailable));
  }, []);

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

  const simulateOptimisticConcurrency = async (roomId: string, roomVersion: number) => {
    // Simulate a small chance of concurrency conflict
    const conflictChance = Math.random() < 0.3; // 30% chance of conflict
    
    if (conflictChance) {
      throw new Error('CONCURRENCY_CONFLICT');
    }
    
    // Simulate successful booking
    return true;
  };

  const onSubmit = async (data: BookingFormData) => {
    if (!user || !selectedRoom) return;

    setIsLoading(true);
    
    try {
      // Attempt booking with optimistic concurrency control
      await simulateOptimisticConcurrency(selectedRoom.id, selectedRoom.version);
      
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

      // Update room availability
      setRooms(prev => prev.map(room => 
        room.id === data.roomId 
          ? { ...room, isAvailable: false, version: room.version + 1 }
          : room
      ));

      toast.success('Reservation confirmed!', {
        description: `Your reservation for room ${selectedRoom.number} has been confirmed. Total: $${totalPrice}`,
        duration: 5000,
      });

      form.reset();
      setSelectedRoom(null);

    } catch (error) {
      if (error instanceof Error && error.message === 'CONCURRENCY_CONFLICT') {
        toast.error('Oops! Someone else booked this room', {
          description: 'The room is no longer available. Please select another room.',
          duration: 5000,
        });
        
        // Refresh room availability
        setRooms(prev => prev.map(room => 
          room.id === selectedRoom?.id 
            ? { ...room, isAvailable: false }
            : room
        ));
        
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
                                disabled={(date) =>
                                  date < new Date() || date < new Date("1900-01-01")
                                }
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
                                disabled={(date) =>
                                  date < new Date() || date < new Date("1900-01-01")
                                }
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
                        <p className="font-medium">Concurrency Control</p>
                        <p>
                          Our system ensures that only one person can book each room. 
                          If someone else books your selected room while you complete the form, 
                          you will be notified immediately.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || !selectedRoom}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3"
                  >
                    {isLoading ? 'Processing Reservation...' : 'Confirm Reservation'}
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