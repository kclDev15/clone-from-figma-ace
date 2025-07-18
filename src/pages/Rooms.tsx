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
        isAvailable: false,
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
        isAvailable: false,
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
        isAvailable: false,
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
        isAvailable: false,
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
    setRooms(mockRooms);
  }, []);

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

  const getRoomTypeDescription = (type: Room['type']) => {
    switch (type) {
      case 'basic':
        return 'Comfortable and affordable accommodation with essential amenities';
      case 'premium':
        return 'Enhanced comfort with premium amenities and beautiful views';
      case 'vip':
        return 'Luxurious suite with exclusive services and premium facilities';
      default:
        return 'Quality accommodation';
    }
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <Wifi className="w-4 h-4" />;
      case 'tv':
      case 'smart tv':
        return <Tv className="w-4 h-4" />;
      case 'private bathroom':
      case 'luxury bathroom':
        return <Bath className="w-4 h-4" />;
      case 'parking':
        return <Car className="w-4 h-4" />;
      case 'minibar':
      case 'premium minibar':
        return <Coffee className="w-4 h-4" />;
      default:
        return <Bed className="w-4 h-4" />;
    }
  };

  const groupedRooms = {
    basic: rooms.filter(room => room.type === 'basic'),
    premium: rooms.filter(room => room.type === 'premium'),
    vip: rooms.filter(room => room.type === 'vip'),
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Rooms
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our elegant rooms designed for your maximum comfort and relaxation
          </p>
        </div>

        {/* Room Categories */}
        <div className="space-y-16">
          {/* Basic Rooms */}
          <section>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Basic Rooms</h2>
              <p className="text-gray-600 max-w-xl mx-auto">
                Comfortable and affordable accommodation with all essential amenities for a pleasant stay
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {groupedRooms.basic.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          </section>

          {/* Premium Rooms */}
          <section>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Premium Rooms</h2>
              <p className="text-gray-600 max-w-xl mx-auto">
                Enhanced comfort with premium amenities, beautiful views, and superior service
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {groupedRooms.premium.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          </section>

          {/* VIP Suites */}
          <section>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">VIP Suites</h2>
              <p className="text-gray-600 max-w-xl mx-auto">
                Luxurious suites with exclusive services, premium facilities, and personalized attention
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {groupedRooms.vip.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

interface RoomCardProps {
  room: Room;
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
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

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <Wifi className="w-4 h-4" />;
      case 'tv':
      case 'smart tv':
        return <Tv className="w-4 h-4" />;
      case 'private bathroom':
      case 'luxury bathroom':
        return <Bath className="w-4 h-4" />;
      case 'parking':
        return <Car className="w-4 h-4" />;
      case 'minibar':
      case 'premium minibar':
        return <Coffee className="w-4 h-4" />;
      default:
        return <Bed className="w-4 h-4" />;
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={room.image}
          alt={`Room ${room.number}`}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4">
          <Badge
            variant={room.isAvailable ? "default" : "destructive"}
            className={room.isAvailable ? "bg-green-500" : ""}
          >
            {room.isAvailable ? 'Available' : 'Occupied'}
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
              Room #{room.number}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-600">
              ${room.price}
            </div>
            <div className="text-sm text-gray-500">per night</div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Amenities:</h4>
            <div className="flex flex-wrap gap-2">
              {room.amenities.slice(0, 6).map((amenity, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-md text-sm"
                >
                  {getAmenityIcon(amenity)}
                  <span>{amenity}</span>
                </div>
              ))}
              {room.amenities.length > 6 && (
                <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-sm">
                  +{room.amenities.length - 6} more
                </div>
              )}
            </div>
          </div>

          <Button
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            disabled={!room.isAvailable}
          >
            {room.isAvailable ? 'Book Now' : 'Not Available'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Rooms;