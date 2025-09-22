import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4">
            ♔ Chess App
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Explore the world of chess with real-time data from Lichess. 
            View player profiles, check leaderboards, and discover ongoing tournaments.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Link href="/profile" className="group">
              <div className="bg-gray-800 hover:bg-gray-700 rounded-lg p-8 transition-all duration-300 group-hover:transform group-hover:scale-105">
                <div className="text-4xl mb-4">👤</div>
                <h3 className="text-xl font-semibold mb-2">Player Profiles</h3>
                <p className="text-gray-400">
                  Search and view detailed player statistics, ratings, and recent games
                </p>
              </div>
            </Link>
            
            <Link href="/leaderboards" className="group">
              <div className="bg-gray-800 hover:bg-gray-700 rounded-lg p-8 transition-all duration-300 group-hover:transform group-hover:scale-105">
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="text-xl font-semibold mb-2">Leaderboards</h3>
                <p className="text-gray-400">
                  View top players across different time controls and game variants
                </p>
              </div>
            </Link>
            
            <Link href="/tournaments" className="group">
              <div className="bg-gray-800 hover:bg-gray-700 rounded-lg p-8 transition-all duration-300 group-hover:transform group-hover:scale-105">
                <div className="text-4xl mb-4">⚔️</div>
                <h3 className="text-xl font-semibold mb-2">Tournaments</h3>
                <p className="text-gray-400">
                  Discover live, upcoming, and finished tournaments with detailed info
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
