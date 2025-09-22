// Lichess API base URL
const LICHESS_API_BASE = 'https://lichess.org/api'

// Generic fetch wrapper for Lichess API
async function lichessApiFetch(endpoint, options = {}) {
  try {
    const response = await fetch(`${LICHESS_API_BASE}${endpoint}`, {
      headers: {
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    })
    
    if (!response.ok) {
      throw new Error(`Lichess API error: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Lichess API fetch error:', error)
    throw error
  }
}

// Get user profile by username
export async function getUserProfile(username) {
  if (!username) throw new Error('Username is required')
  return lichessApiFetch(`/user/${username}`)
}

// Get user's rating history
export async function getUserRatingHistory(username) {
  if (!username) throw new Error('Username is required')
  return lichessApiFetch(`/user/${username}/rating-history`)
}

// Get user's recent games
export async function getUserGames(username, options = {}) {
  if (!username) throw new Error('Username is required')
  const params = new URLSearchParams({
    max: options.max || 10,
    rated: options.rated || 'true',
    ...options.params
  })
  return lichessApiFetch(`/games/user/${username}?${params}`)
}

// Get leaderboard data
export async function getLeaderboard(perfType = 'bullet', nb = 10) {
  return lichessApiFetch(`/player/top/${nb}/${perfType}`)
}

// Get current tournaments
export async function getCurrentTournaments() {
  return lichessApiFetch('/tournament')
}

// Get tournament details by ID
export async function getTournamentById(tournamentId) {
  if (!tournamentId) throw new Error('Tournament ID is required')
  return lichessApiFetch(`/tournament/${tournamentId}`)
}

// Get tournament results/standings
export async function getTournamentResults(tournamentId, nb = 10) {
  if (!tournamentId) throw new Error('Tournament ID is required')
  return lichessApiFetch(`/tournament/${tournamentId}/results?nb=${nb}`)
}