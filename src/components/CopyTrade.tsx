import React, { useState, useRef, useEffect } from 'react';
import { Search, TrendingUp, Star, Users, Filter, ChevronDown, Info, ChevronRight, LineChart } from 'lucide-react';

const CopyTrade: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filters = [
    'Clasificación general',
    'Nivel de Cuenta',
    'Activos de la Cuenta',
    'Copiadores',
    'ROI de 30D',
    'Pérdida y ganancia acumulada',
    'Ganancias acumuladas de copiadores',
    'Seguidores',
    'Riesgo'
  ];

  const traderCategories = [
    {
      title: 'Todos los traders',
      description: 'Lista completa de traders disponibles'
    },
    {
      title: 'Traders en tendencia',
      description: 'Traders que han tenido éxito en los últimos 7 días',
      traders: [
        {
          id: 'trader1',
          name: 'Trader 1',
          roi: '+70.35%',
          copiers: '5,982',
          winRate: '99.95%',
          chart: [40, 60, 75, 50, 90, 45, 80]
        }
      ]
    },
    {
      title: 'Traders Sólidos',
      description: 'Traders con rendimiento estable y bajo riesgo',
      traders: [
        {
          id: 'trader2',
          name: 'Trader 2',
          roi: '+41.26%',
          copiers: '405',
          winRate: '54.77%',
          chart: [50, 70, 65, 80, 60, 85, 75]
        }
      ]
    },
    {
      title: 'Estrellas en ascenso',
      description: 'Traders prometedores con gran potencial',
      traders: [
        {
          id: 'trader3',
          name: 'Trader 3',
          roi: '+35.89%',
          copiers: '203',
          winRate: '82.41%',
          chart: [30, 45, 60, 75, 90, 85, 95]
        }
      ]
    },
    {
      title: 'Los traders dicen...',
      description: 'Últimas actualizaciones de los traders',
      updates: [
        {
          id: 'update1',
          trader: 'Trader 1',
          message: 'Market analysis for today...',
          time: '2h ago'
        }
      ]
    }
  ];

  const renderTraderCard = (trader: any) => (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <h3 className="text-white font-medium">{trader.name}</h3>
            <span className="text-green-400 text-sm">{trader.roi} ROI 30d</span>
          </div>
        </div>
        <button className="px-4 py-1.5 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors">
          Copy
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-gray-400 text-xs mb-1">Copiers</div>
          <div className="text-white font-medium">{trader.copiers}</div>
        </div>
        <div>
          <div className="text-gray-400 text-xs mb-1">Win Rate</div>
          <div className="text-white font-medium">{trader.winRate}</div>
        </div>
      </div>

      <div className="h-16 flex items-end justify-between">
        {trader.chart.map((value: number, i: number) => (
          <div
            key={`${trader.id}-chart-${i}`}
            className="w-[8%] bg-blue-500/20 rounded-t"
            style={{ height: `${value}%` }}
          >
            <div
              className="w-full bg-blue-500 rounded-t"
              style={{ height: `${value * 0.7}%` }}
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderUpdate = (update: any) => (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
          <Users className="w-4 h-4 text-gray-400" />
        </div>
        <div>
          <h3 className="text-white text-sm font-medium">{update.trader}</h3>
          <span className="text-gray-400 text-xs">{update.time}</span>
        </div>
      </div>
      <p className="text-gray-300 text-sm">{update.message}</p>
    </div>
  );

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-xl sm:text-2xl font-bold text-white">Copy Trading</h1>
          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">Coming Soon</span>
        </div>
        <p className="text-sm sm:text-base text-gray-400">Copy successful traders automatically</p>
      </div>

      <div className="bg-gray-900/30 backdrop-blur-md rounded-lg border border-gray-800">
        {/* Header Stats */}
        <div className="p-4 sm:p-6 border-b border-gray-800">
          <div className="text-center">
            <div className="text-sm sm:text-base text-gray-400 mb-1">Total Successful Connections</div>
            <div className="text-2xl sm:text-3xl font-bold text-white">0</div>
            <div className="text-xs sm:text-sm text-gray-500">between traders and copiers</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="p-4 sm:p-6 border-b border-gray-800">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search trader..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-lg pl-9 pr-3 py-2 sm:py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            <div className="flex gap-2">
              <div className="relative" ref={filterRef}>
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-3 py-2 bg-gray-800 rounded-lg text-gray-400 hover:text-white text-sm flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filtrar</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
                
                {showFilters && (
                  <div className="absolute z-50 top-full right-0 mt-2 w-64 bg-gray-800 rounded-lg border border-gray-700 shadow-lg py-2">
                    {filters.map((filter, index) => (
                      <button
                        key={`dropdown-filter-${index}`}
                        className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                        onClick={() => {
                          setSelectedFilter(filter);
                          setShowFilters(false);
                        }}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button className="px-3 py-2 bg-gray-800 rounded-lg text-gray-400 hover:text-white text-sm">
                My Subscriptions
              </button>
            </div>
          </div>
        </div>

        {/* Trader Categories */}
        <div className="divide-y divide-gray-800">
          {traderCategories.map((category, index) => (
            <div key={`category-${index}`} className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-white">{category.title}</h2>
                <button className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
                  Ver todo
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              
              <p className="text-gray-400 text-sm mb-4">{category.description}</p>
              
              {category.traders ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.traders.map((trader) => (
                    <div key={trader.id}>{renderTraderCard(trader)}</div>
                  ))}
                </div>
              ) : category.updates ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.updates.map((update) => (
                    <div key={update.id}>{renderUpdate(update)}</div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-gray-800/50 rounded-lg text-center">
                  <p className="text-gray-400 text-sm">No data found in this category</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CopyTrade;