import { Link } from 'react-router-dom';
import { useState } from 'react';

function Navbar() {
  // TODO: Replace with actual auth state management
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Temporairement mis à true pour le test
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Nouvel état pour le menu mobile

  const handleLogout = () => {
    setIsAuthenticated(false);
    // TODO: Implement logout logic
    setIsMenuOpen(false); // Ferme le menu après déconnexion
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-primary">
            Coworking
          </Link>

          {/* Bouton Hamburger (visible seulement sur mobile) */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-primary focus:outline-none focus:text-primary"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {/* Icône hamburger ou croix selon l'état du menu */}
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Liens de navigation (cachés sur mobile, affichés sur desktop) */}
          <div
            className={`${
              isMenuOpen ? 'block' : 'hidden'
            } md:flex md:space-x-4 absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent shadow-lg md:shadow-none z-20`}
          >
            <Link
              to="/"
              className="block px-3 py-2 text-gray-700 hover:text-primary md:rounded-md"
              onClick={() => setIsMenuOpen(false)} // Ferme le menu après clic
            >
              Tableau de bord
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/Home"
                  className="block px-3 py-2 text-gray-700 hover:text-primary md:rounded-md"
                  onClick={() => setIsMenuOpen(false)} // Ferme le menu après clic
                >
                  Réserver un espace
                </Link>
                <Link
                  to="/reservations"
                  className="block px-3 py-2 text-gray-700 hover:text-primary md:rounded-md"
                  onClick={() => setIsMenuOpen(false)} // Ferme le menu après clic
                >
                  Mes réservations
                </Link>
              </>
            )}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="block px-3 py-2 text-gray-700 hover:text-primary md:rounded-md w-full text-left"
              >
                Déconnexion
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 text-gray-700 hover:text-primary md:rounded-md"
                  onClick={() => setIsMenuOpen(false)} // Ferme le menu après clic
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2 bg-primary text-white md:rounded-md hover:bg-secondary w-full text-left"
                  onClick={() => setIsMenuOpen(false)} // Ferme le menu après clic
                >
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;