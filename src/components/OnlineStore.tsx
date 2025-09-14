import React from 'react';
import { Laptop, Smartphone, Tv, ShoppingBag, Truck, Clock, Shield, HeadphonesIcon, Star, ChevronRight, ExternalLink } from 'lucide-react';

const OnlineStore: React.FC = () => {
  const handleStoreClick = () => {
    window.open('https://store.falcox.net', '_blank');
  };

  const featuredProducts = [
    {
      name: "MacBook Air M2",
      price: "232.99",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=500&q=80",
      tag: "New Arrival"
    },
    {
      name: "iPhone 15 Pro Max",
      price: "599.99",
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=500&q=80",
      tag: "Best Seller"
    },
    {
      name: "Sony WH-1000XM5",
      price: "54.99",
      image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=500&q=80",
      tag: "Top Rated"
    },
    {
      name: "LG OLED C3 65\"",
      price: "548.99",
      image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=500&q=80",
      tag: "Premium"
    }
  ];

  const categories = [
    {
      name: "Computers",
      icon: Laptop,
      count: "150+ Products"
    },
    {
      name: "Smartphones",
      icon: Smartphone,
      count: "200+ Products"
    },
    {
      name: "TVs & Home Theater",
      icon: Tv,
      count: "100+ Products"
    },
    {
      name: "Audio",
      icon: HeadphonesIcon,
      count: "80+ Products"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1468436139062-f60a71c5c892?auto=format&fit=crop&w=1920&q=80"
          alt="Tech Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
          <div className="flex items-center justify-between mb-6">
            <div className="inline-flex items-center gap-2">
              <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20">
                Coming Soon
              </span>
              <span className="text-white/60 text-sm">Launch in Q2 2024</span>
            </div>
            <button 
              onClick={handleStoreClick}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <span>Visit Store</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
            Falco-X Store
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mb-8">
            Your premier destination for cutting-edge technology. From computers and smartphones to home electronics, discover the future of tech with us.
          </p>
          <div className="flex gap-4">
            <button className="px-8 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-100 transition-colors">
              Join Waitlist
            </button>
            <button className="px-8 py-3 border border-white/20 rounded-full font-medium hover:bg-white/10 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <div key={index} className="group relative bg-gray-900 rounded-xl overflow-hidden hover:scale-[1.02] transition-all duration-300">
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs font-medium">
                    {product.tag}
                  </span>
                </div>
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold">${product.price}</span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <div key={index} className="group bg-black rounded-xl p-8 border border-gray-800 hover:border-white/20 transition-colors cursor-pointer">
                <category.icon className="w-12 h-12 mb-6 text-gray-400 group-hover:text-white transition-colors" />
                <h3 className="text-xl font-medium mb-2">{category.name}</h3>
                <p className="text-gray-400">{category.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-400 mb-8">
            Be the first to know when we launch. Subscribe to get exclusive early access and special offers.
          </p>
          <div className="flex gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 bg-gray-900 rounded-full border border-gray-800 focus:outline-none focus:border-white/20"
            />
            <button className="px-8 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <Truck className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">Fast Shipping</h3>
            <p className="text-gray-400">Free delivery on orders over $100</p>
          </div>
          <div className="text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">Secure Shopping</h3>
            <p className="text-gray-400">100% secure payment</p>
          </div>
          <div className="text-center">
            <HeadphonesIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">24/7 Support</h3>
            <p className="text-gray-400">Dedicated support team</p>
          </div>
          <div className="text-center">
            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">Easy Returns</h3>
            <p className="text-gray-400">30-day return policy</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OnlineStore;