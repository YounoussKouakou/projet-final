import React, { useState, useEffect } from 'react';
import reservationService from '../services/reservationService';
import AddReservation from './AddReservation';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalReservations: 0,
    confirmedReservations: 0,
    pendingReservations: 0,
    totalRevenue: 0,
    paidReservations: 0,
    recentReservations: []
  });
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    // Charger les statistiques initiales
    loadStats();

    // S'abonner aux mises à jour en temps réel
    const unsubscribe = reservationService.subscribe(() => {
      loadStats();
    });

    return () => unsubscribe();
  }, []);

  const loadStats = () => {
    try {
      const dashboardStats = reservationService.getDashboardStats();
      setStats(dashboardStats);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReservation = (newReservation) => {
    // Le service notifiera automatiquement tous les listeners
    console.log('Nouvelle réservation créée depuis le dashboard:', newReservation);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmée';
      case 'pending':
        return 'En attente';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  const getPaymentStatus = (reservation) => {
    if (reservation.paymentDetails) {
      return (
        <span className="text-green-600 text-xs">
          ✓ Payé
        </span>
      );
    }
    return (
      <span className="text-gray-500 text-xs">
        Non payé
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Tableau de bord</h1>
        <div className="text-center">
          <p className="text-gray-600">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary transition-colors"
        >
          + Nouvelle Réservation
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Carte statistique 1 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Total Réservations</h2>
          <p className="text-3xl font-bold text-blue-600">{stats.totalReservations}</p>
          <p className="text-gray-500 mt-2">Toutes les réservations</p>
        </div>

        {/* Carte statistique 2 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Confirmées</h2>
          <p className="text-3xl font-bold text-green-600">{stats.confirmedReservations}</p>
          <p className="text-gray-500 mt-2">Statut confirmé</p>
        </div>

        {/* Carte statistique 3 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">En Attente</h2>
          <p className="text-3xl font-bold text-yellow-600">{stats.pendingReservations}</p>
          <p className="text-gray-500 mt-2">En cours de traitement</p>
        </div>

        {/* Carte statistique 4 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Payées</h2>
          <p className="text-3xl font-bold text-purple-600">{stats.paidReservations}</p>
          <p className="text-gray-500 mt-2">Paiements effectués</p>
        </div>

        {/* Carte statistique 5 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Revenus</h2>
          <p className="text-3xl font-bold text-indigo-600">{stats.totalRevenue.toLocaleString()} Fcfa</p>
          <p className="text-gray-500 mt-2">Total des paiements</p>
        </div>
      </div>

      {/* Graphique ou tableau récent */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Réservations Récentes</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Espace</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paiement</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentReservations.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    Aucune réservation récente
                  </td>
                </tr>
              ) : (
                stats.recentReservations.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(reservation.date).toLocaleDateString('fr-FR')}
                        </div>
                        <div className="text-sm text-gray-500">
                          {reservation.time}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reservation.user}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {reservation.space?.name || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reservation.space?.price ? `${reservation.space.price} Fcfa` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPaymentStatus(reservation)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(reservation.status)}`}>
                        {getStatusText(reservation.status)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal pour ajouter une réservation */}
      {showAddModal && (
        <AddReservation
          onClose={() => setShowAddModal(false)}
          onSuccess={handleAddReservation}
        />
      )}
    </div>
  );
};

export default Dashboard; 