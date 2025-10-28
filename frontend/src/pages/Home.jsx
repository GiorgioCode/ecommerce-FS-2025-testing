// Página Home - Landing page
// Muestra una introducción a la tienda
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="space-y-8">
      {/* Sección hero/banner principal */}
      <section className="bg-white rounded-lg border overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center p-6">
          {/* Contenido del hero */}
          <div className="space-y-4">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
              Bienvenido a <span className="text-blue-600">GameHub</span>
            </h2>
            <p className="text-base text-gray-600">
              Descubre el mejor hardware gaming con tecnología de vanguardia
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              Desde consolas hasta periféricos pro, tenemos todo lo que necesitas 
              para llevar tu gaming al siguiente nivel.
            </p>
            
            {/* Botón de acción */}
            <div>
              <Link 
                to="/products" 
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded transition-colors inline-block"
              >
                Ver Productos
              </Link>
            </div>
          </div>
          
          {/* Imagen destacada */}
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600" 
              alt="Setup gaming con RGB y monitor ultrawide"
              loading="eager"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Sección de características/ventajas */}
      <section className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-bold text-gray-900 text-center mb-4">¿Por qué elegir GameHub?</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-3">
            <div className="text-2xl mb-2">🚚</div>
            <h4 className="text-sm font-semibold text-gray-900 mb-1">Envío Express</h4>
            <p className="text-xs text-gray-600">Entrega gratuita en pedidos superiores a $800.000</p>
          </div>
          <div className="text-center p-3">
            <div className="text-2xl mb-2">🔒</div>
            <h4 className="text-sm font-semibold text-gray-900 mb-1">Pago Seguro</h4>
            <p className="text-xs text-gray-600">Múltiples métodos de pago con máxima seguridad</p>
          </div>
          <div className="text-center p-3">
            <div className="text-2xl mb-2">⭐</div>
            <h4 className="text-sm font-semibold text-gray-900 mb-1">Hardware Original</h4>
            <p className="text-xs text-gray-600">100% productos gaming originales con garantía oficial</p>
          </div>
          <div className="text-center p-3">
            <div className="text-2xl mb-2">🔧</div>
            <h4 className="text-sm font-semibold text-gray-900 mb-1">Soporte Gamer</h4>
            <p className="text-xs text-gray-600">Asesoría especializada para optimizar tu setup gaming</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
