import React from 'react';
import { LineChart, Star, ChevronRight, Swords, Users, TrendingUp } from 'lucide-react';

const Games: React.FC = () => {
  const featuredGames = [
    {
      name: "BugsBunny Roulette",
      description: "Place your bets and spin the wheel for a chance to win big! Experience the thrill of our provably fair roulette game.",
      image: "https://photos.pinksale.finance/file/pinksale-logo-upload/1742333026456-be596f15487a1b7993e4b0ca60eac14a.jpg",
      url: "https://roulette.bugsbunny.lol/",
    },
    {
      name: "Rock Paper Scissors",
      description: "Challenge other players in the classic game of Rock Paper Scissors! Win CORE tokens in this strategic battle of wits.",
      image: "https://photos.pinksale.finance/file/pinksale-logo-upload/1750218254489-de9112ea4564d27514a91ee7524dc340.png",
      url: "https://ppt.falcox.net/",
    },
    {
      name: "Elemental War",
      description: "Join the ultimate blockchain gaming experience. Battle with elements, win CORE tokens, and climb the leaderboard!",
      image: "https://photos.pinksale.finance/file/pinksale-logo-upload/1750218496571-8a6a69a354540d190c6907808067d1f2.png",
      url: "https://eb.falcox.net/",
    },
    {
      name: "Tic Tac Toe Arena",
      description: "The classic game of X and O with a crypto twist! Challenge opponents and win CORE tokens in this strategic showdown.",
      image: "https://photos.pinksale.finance/file/pinksale-logo-upload/1750219721365-3a280f82eee75e1a54d573e6d3ea173e.png",
      url: "https://0x.falcox.net/",
    },
    {
      name: "Battleship",
      description: "Engage in naval warfare! Strategically place your ships and take turns firing at your opponent's fleet. The last fleet standing wins CORE tokens!",
      image: "https://photos.pinksale.finance/file/pinksale-logo-upload/1750217948501-e415c02d80fe9e231457015ba48f4c17.png",
      url: "https://battleship.falcox.net/",
    },
    {
      name: "MultiLottery System",
      description: "A revolutionary lottery platform where any project can list their token and sell lottery tickets. Win big in your favorite tokens!",
      image: "https://photos.pinksale.finance/file/pinksale-logo-upload/1755535152075-5174fb13a6c88c85a92f69089bd890b6.png",
      url: "https://lottox.falcox.net/",
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-shrink-0">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
              <div className="relative bg-black rounded-lg p-2">
                <LineChart className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
            </div>
            <div className="overflow-hidden">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 truncate">
                FalcoX Games
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 mt-1 truncate">
                Play, earn, and have fun with our collection of games
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {featuredGames.map((game, index) => (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-gray-900 to-black rounded-xl sm:rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 flex flex-col"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={game.image}
                  alt={game.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              </div>

              <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-grow">
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-white truncate flex-grow mr-2">
                    {game.name}
                  </h3>
                  <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                    <span className="text-xs sm:text-sm text-yellow-500 font-medium hidden sm:inline">
                      Featured
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-gray-300 mb-4 sm:mb-5 line-clamp-3">
                  {game.description}
                </p>

                <div className="mt-auto">
                  <div className="mb-3 sm:mb-4">
                    <div className="flex items-center justify-between p-2 sm:p-3 bg-blue-900/20 rounded-lg sm:rounded-xl border border-blue-900/30">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                        <span className="text-xs sm:text-sm text-blue-400 truncate">
                          Status:
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-blue-400 truncate">
                        Active
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => window.open(game.url, '_blank')}
                    className="w-full py-2 sm:py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs sm:text-sm rounded-lg font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2"
                  >
                    <span>Play Now</span>
                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Games;