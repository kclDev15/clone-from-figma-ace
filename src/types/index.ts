export interface User {
  id: string;
  email: string;
  username: string;
}

export interface Room {
  id: string;
  number: string;
  type: 'basic' | 'premium' | 'vip';
  price: number;
  amenities: string[];
  image: string;
  isAvailable: boolean;
  version: number; // For optimistic concurrency control
}

export interface Reservation {
  id: string;
  userId: string;
  roomId: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
  version: number; // For optimistic concurrency control
}

export interface BookingFormData {
  roomId: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
}