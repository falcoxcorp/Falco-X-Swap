import React, { useState } from 'react';
import { Search, ArrowUpDown, ChevronDown, Filter, X } from 'lucide-react';

interface Order {
  seller: string;
  method: string;
  currency: string;
  amount: string;
  price: string;
  rating: number;
}

const P2PMarket: React.FC = () => {
  const [orders] = useState<Order[]>([]);
  const [recordsPerPage, setRecordsPerPage] = useState('10');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('ALL');
  const [selectedMethod, setSelectedMethod] = useState('ALL');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Order | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });

  const handleSort = (key: keyof Order) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const currencies = ['ALL', 'USDT', 'CORE', 'BUGS'];
  const methods = ['ALL', 'Bank Transfer', 'PayPal', 'Credit Card'];

  return (
    <div className="p-3 sm:p-6">
      <div className="mb-4 sm:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-xl sm:text-2xl font-bold text-white">P2P Market</h1>
          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">Coming Soon</span>
        </div>
        <p className="text-sm sm:text-base text-gray-400">Buy and sell tokens directly with other users</p>
      </div>

      <div className="bg-gray-900/30 backdrop-blur-md rounded-lg border border-gray-800">
        {/* Header Section */}
        <div className="p-3 sm:p-4 border-b border-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by seller, method, or currency..."
                className="w-full bg-gray-800 text-white rounded-lg pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-lg text-white text-xs hover:bg-gray-700 transition-colors"
            >
              <Filter className="w-3 h-3" />
              Filters
            </button>
            <div className="hidden sm:flex items-center gap-3">
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {currencies.map(currency => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
              <select
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {methods.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Mobile Filters */}
        {showFilters && (
          <div className="sm:hidden p-3 border-b border-gray-800 space-y-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Currency</label>
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {currencies.map(currency => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Payment Method</label>
              <select
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {methods.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Table/Cards Section */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-400 border-b border-gray-800">
                {['SELLER', 'METHOD', 'CURRENCY', 'AMOUNT', 'PRICE', 'RATING', 'ACTIONS'].map((header) => (
                  <th
                    key={header}
                    className="p-4 font-medium cursor-pointer hover:text-white transition-colors whitespace-nowrap"
                    onClick={() => header !== 'ACTIONS' && handleSort(header.toLowerCase() as keyof Order)}
                  >
                    <div className="flex items-center gap-1">
                      {header}
                      {header !== 'ACTIONS' && (
                        <ArrowUpDown className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 sm:py-32">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <Search className="w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-4 opacity-20" />
                      <p className="text-base sm:text-lg font-medium mb-1">Nothing found</p>
                      <p className="text-xs sm:text-sm">
                        Sorry, looks like we couldn't find any matching records.
                        <br />
                        Try different search terms.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order, index) => (
                  <tr key={index} className="border-b border-gray-800 text-white">
                    <td className="p-4">{order.seller}</td>
                    <td className="p-4">{order.method}</td>
                    <td className="p-4">{order.currency}</td>
                    <td className="p-4">{order.amount}</td>
                    <td className="p-4">{order.price}</td>
                    <td className="p-4">{order.rating}</td>
                    <td className="p-4">
                      <button className="bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-600 transition-colors">
                        Trade
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="sm:hidden divide-y divide-gray-800">
          {orders.length === 0 ? (
            <div className="py-12">
              <div className="flex flex-col items-center justify-center text-gray-400">
                <Search className="w-10 h-10 mb-3 opacity-20" />
                <p className="text-sm font-medium mb-1">Nothing found</p>
                <p className="text-xs px-6 text-center">
                  Sorry, looks like we couldn't find any matching records.
                </p>
              </div>
            </div>
          ) : (
            orders.map((order, index) => (
              <div key={index} className="p-3 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm text-white font-medium">{order.seller}</div>
                    <div className="text-xs text-gray-400">{order.method}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-white">{order.amount} {order.currency}</div>
                    <div className="text-xs text-gray-400">{order.price}</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-400">
                    Rating: {order.rating}
                  </div>
                  <button className="bg-blue-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-blue-600 transition-colors">
                    Trade
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Section */}
        <div className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <div className="relative">
              <select
                value={recordsPerPage}
                onChange={(e) => setRecordsPerPage(e.target.value)}
                className="appearance-none bg-gray-800 text-white rounded px-2 sm:px-3 py-1 pr-6 sm:pr-8 text-xs sm:text-sm"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <ChevronDown className="absolute right-1.5 sm:right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4" />
            </div>
            <span>per page</span>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
            <span>Showing all records (0)</span>
            <div className="flex gap-1">
              <button className="p-1 hover:bg-gray-800 rounded">
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 rotate-90" />
              </button>
              <button className="p-1 hover:bg-gray-800 rounded">
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 -rotate-90" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default P2PMarket;