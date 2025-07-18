import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wifi, Car, Coffee, Waves, Star, MapPin } from 'lucide-react';

const Home: React.FC = () => {
  const features = [
    { icon: Wifi, title: 'WiFi Gratuito', description: 'Internet de alta velocidad en todas las habitaciones' },
    { icon: Car, title: 'Estacionamiento', description: 'Estacionamiento gratuito para huéspedes' },
    { icon: Coffee, title: 'Desayuno', description: 'Desayuno continental incluido' },
    { icon: Waves, title: 'Piscina', description: 'Piscina climatizada y gimnasio' },
  ];

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