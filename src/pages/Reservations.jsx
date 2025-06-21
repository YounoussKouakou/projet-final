import { useState, useEffect } from 'react'
import reservationService from '../services/reservationService'
import AddReservation from '../components/AddReservation'
import PaymentReceipt from '../components/PaymentReceipt'

function Reservations() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState(null)

  useEffect(() => {
    // Charger les réservations initiales
    loadReservations()

    // S'abonner aux mises à jour en temps réel
    const unsubscribe = reservationService.subscribe((updatedReservations) => {
      setReservations(updatedReservations)
    })

    return () => unsubscribe()
  }, [])

  const loadReservations = () => {
    try {
      const data = reservationService.getAllReservations()
      setReservations(data)
    } catch (error) {
      console.error('Erreur lors du chargement des réservations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelReservation = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      try {
        await reservationService.deleteReservation(id)
        // Les listeners seront automatiquement notifiés
      } catch (error) {
        console.error('Erreur lors de l\'annulation:', error)
        alert('Erreur lors de l\'annulation de la réservation')
      }
    }
  }

  const handleAddReservation = (newReservation) => {
    // Le service notifiera automatiquement tous les listeners
    console.log('Nouvelle réservation créée:', newReservation)
  }

  const handleViewReceipt = (reservation) => {
    setSelectedReservation(reservation)
    setShowReceipt(true)
  }

  const handleReceiptClose = () => {
    setShowReceipt(false)
    setSelectedReservation(null)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmée'
      case 'pending':
        return 'En attente'
      case 'cancelled':
        return 'Annulée'
      default:
        return status
    }
  }

  const getPaymentStatus = (reservation) => {
    if (reservation.paymentDetails) {
      return (
        <span className="text-green-600 text-xs">
          ✓ Payé ({reservation.paymentDetails.method})
        </span>
      )
    }
    return (
      <span className="text-gray-500 text-xs">
        Non payé
      </span>
    )
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Mes Réservations
        </h1>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600">Chargement des réservations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Mes Réservations
        </h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary transition-colors"
        >
          + Nouvelle Réservation
        </button>
      </div>

      {reservations.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600 mb-4">Vous n'avez aucune réservation.</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary transition-colors"
          >
            Créer votre première réservation
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Heure
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Espace
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paiement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reservations.map((reservation) => (
                <tr key={reservation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(reservation.date).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {reservation.user}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{reservation.time}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {reservation.space?.name || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {reservation.space?.price ? `${reservation.space.price} Fcfa` : 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {reservation.space?.price ? `${reservation.space.price} Fcfa` : 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPaymentStatus(reservation)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        reservation.status
                      )}`}
                    >
                      {getStatusText(reservation.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      {reservation.paymentDetails && (
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => handleViewReceipt(reservation)}
                        >
                          Reçu
                        </button>
                      )}
                      {reservation.status !== 'cancelled' && (
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleCancelReservation(reservation.id)}
                        >
                          Annuler
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal pour ajouter une réservation */}
      {showAddModal && (
        <AddReservation
          onClose={() => setShowAddModal(false)}
          onSuccess={handleAddReservation}
        />
      )}

      {/* Modal pour afficher le reçu */}
      {showReceipt && selectedReservation && selectedReservation.paymentDetails && (
        <PaymentReceipt
          reservation={selectedReservation}
          paymentDetails={selectedReservation.paymentDetails}
          onClose={handleReceiptClose}
        />
      )}
    </div>
  )
}

export default Reservations 