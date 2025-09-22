'use client'

import { useState, useEffect } from 'react'
import BackButton from '../components/BackButton'
import { getCurrentTournaments } from '../../lib/lichess-api'

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const fetchTournaments = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await getCurrentTournaments()
      // Filter to show only upcoming tournaments
      const now = new Date().getTime()
      const upcomingTournaments = (data.created || []).filter(tournament => {
        const startTime = new Date(tournament.startsAt).getTime()
        return startTime > now
      })
      setTournaments(upcomingTournaments)
    } catch (err) {
      setError('Failed to fetch tournament data. Please try again.')
      console.error('Tournament fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTournaments()
  }, [])

  const handleRefresh = () => {
    fetchTournaments()
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <BackButton />
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Upcoming Tournaments</h1>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            <svg 
              className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded text-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-lg">Loading tournaments...</span>
          </div>
        ) : (
          <>
            {tournaments.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tournaments.map((tournament) => {
                  // Format duration
                  const formatDuration = (minutes) => {
                    if (minutes < 60) return `${minutes}m`
                    const hours = Math.floor(minutes / 60)
                    const mins = minutes % 60
                    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
                  }
                  
                  // Format time control
                  const formatTimeControl = (clock) => {
                    if (!clock) return 'Unknown'
                    const initial = Math.floor(clock.limit / 60)
                    const increment = clock.increment
                    return `${initial}+${increment}`
                  }

                  return (
                    <div key={tournament.id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors border border-gray-700">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                          {tournament.fullName || tournament.name}
                        </h3>
                        {tournament.createdBy && (
                          <p className="text-sm text-gray-400">
                            Created by: {tournament.createdBy}
                          </p>
                        )}
                      </div>
                      
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Time Control:</span>
                          <span className="font-medium">{formatTimeControl(tournament.clock)}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-400">Players:</span>
                          <span className="font-medium">
                            {tournament.nbPlayers || 0} / {tournament.maxPlayers || '∞'}
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-400">Variant:</span>
                          <span className="font-medium capitalize">{tournament.variant?.name || 'Standard'}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-400">Start Time:</span>
                          <span className="font-medium">
                            {new Date(tournament.startsAt).toLocaleTimeString()}
                          </span>
                        </div>
                        
                        {tournament.minutes && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Duration:</span>
                            <span className="font-medium">{formatDuration(tournament.minutes)}</span>
                          </div>
                        )}
                        
                        {tournament.rated !== undefined && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Rated:</span>
                            <span className={`font-medium ${tournament.rated ? 'text-green-400' : 'text-gray-400'}`}>
                              {tournament.rated ? 'Yes' : 'No'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Progress bar for tournament capacity */}
                      {tournament.maxPlayers && (
                        <div className="mt-4">
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Participants</span>
                            <span>{tournament.nbPlayers}/{tournament.maxPlayers}</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${Math.min((tournament.nbPlayers / tournament.maxPlayers) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <a
                          href={`https://lichess.org/tournament/${tournament.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                        >
                          <span>View on Lichess</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🏆</div>
                <p className="text-xl text-gray-400 mb-2">
                  No upcoming tournaments available
                </p>
                <p className="text-gray-500">
                  Check back later or try refreshing the page
                </p>
              </div>
            )}
          </>
        )}

        {filteredTournaments.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Showing {filteredTournaments.length} tournament{filteredTournaments.length !== 1 ? 's' : ''} 
              {filter !== 'all' && ` (${filter})`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}