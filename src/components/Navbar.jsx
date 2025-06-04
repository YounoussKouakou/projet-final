import { Link } from 'react-router-dom'
import { useState } from 'react'

function Navbar() {
  // TODO: Replace with actual auth state management
  const [isAuthenticated, setIsAuthenticated] = useState(true) // Temporairement mis à true pour le test

  const handleLogout = () => {
    setIsAuthenticated(false)
    // TODO: Implement logout logic
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-primary">
            Coworking
          </Link>
          
          <div className="flex space-x-4">
            <Link
              to="/"
              className="text-gray-700 hover:text-primary px-3 py-2 rounded-md"
            >
             Tableau de bord
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/Home"
                  className="text-gray-700 hover:text-primary px-3 py-2 rounded-md"
                >
                   Réserver un espace

                </Link>
                <Link
                  to="/reservations"
                  className="text-gray-700 hover:text-primary px-3 py-2 rounded-md"
                >
                  Mes réservations
                </Link>
              </>
            )}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-primary px-3 py-2 rounded-md"
              >
                Déconnexion
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary px-3 py-2 rounded-md"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary"
                >
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar 