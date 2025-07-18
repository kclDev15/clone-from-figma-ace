import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Room } from '@/types';
import { Wifi, Car, Coffee, Tv, Bath, Bed } from 'lucide-react';

const Rooms: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    // Simulate API call to fetch rooms
    const mockRooms: Room[] = [
      {
        id: '1',
        number: '101',
        type: 'single',
        price: 120,
        amenities: ['WiFi', 'TV', 'Baño Privado', 'Aire Acondicionado'],
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400',
        isAvailable: true,
        version: 1,
      },
      {
        id: '2',
        number: '201',
        type: 'double',
        price: 180,
        amenities: ['WiFi', 'TV', 'Baño Privado', 'Aire Acondicionado', 'Minibar', 'Vista al Mar'],
        image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400',
        isAvailable: true,
        version: 1,
      },
      {
        id: '3',
        number: '301',
        type: 'suite',
        price: 350,
        amenities: ['WiFi', 'TV', 'Baño Privado', 'Aire Acondicionado', 'Minibar', 'Vista al Mar', 'Jacuzzi', 'Sala de Estar'],
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400',
        isAvailable: true,
        version: 1,
      },
      {
        id: '4',
        number: '102',
        type: 'single',
        price: 120,
        amenities: ['WiFi', 'TV', 'Baño Privado', 'Aire Acondicionado'],
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400',
        isAvailable: false,
        version: 1,
      },
      {
        id: '5',
        number: '202',
        type: 'double',
        price: 180,
        amenities: ['WiFi', 'TV', 'Baño Privado', 'Aire Acondicionado', 'Minibar', 'Vista al Mar'],
        image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400',
        isAvailable: true,
        version: 1,
      },
      {
        id: '6',
        number: '302',
        type: 'suite',
        price: 350,
        amenities: ['WiFi', 'TV', 'Baño Privado', 'Aire Acondicionado', 'Minibar', 'Vista al Mar', 'Jacuzzi', 'Sala de Estar'],
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400',
        isAvailable: true,
        version: 1,
      },
    ];
    setRooms(mockRooms);
  }, []);

  const getRoomTypeTitle = (type: Room['type']) => {
    switch (type) {
      case 'single':
        return 'Habitación Individual';
      case 'double':
        return 'Habitación Doble';
      case 'suite':
        return 'Suite de Lujo';
      default:
        return 'Habitación';
    }
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <Wifi className="w-4 h-4" />;
      case 'tv':
        return <Tv className="w-4 h-4" />;
      case 'baño privado':
        return <Bath className="w-4 h-4" />;
      default:
        return <Bed className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Nuestras Habitaciones
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre nuestras elegantes habitaciones diseñadas para tu máximo confort y relajación
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <Card key={room.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <img
                  src={room.image}
                  alt={`Habitación ${room.number}`}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge
                    variant={room.isAvailable ? "default" : "destructive"}
                    className={room.isAvailable ? "bg-green-500" : ""}
                  >
                    {room.isAvailable ? 'Disponible' : 'Ocupada'}
                  </Badge>
                </div>
              </div>
              
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl text-gray-900">
                      {getRoomTypeTitle(room.type)}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Habitación #{room.number}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">
                      ${room.price}
                    </div>
                    <div className="text-sm text-gray-500">por noche</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Amenidades:</h4>
                    <div className="flex flex-wrap gap-2">
                      {room.amenities.map((amenity, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-md text-sm"
                        >
                          {getAmenityIcon(amenity)}
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    disabled={!room.isAvailable}
                  >
                    {room.isAvailable ? 'Reservar Ahora' : 'No Disponible'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rooms;