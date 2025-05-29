import { useState } from 'react'
import SpaceCard from '../components/SpaceCard'
import PayPalButton from '../components/PayPalButton'
import Receipt from '../components/Receipt'

function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedTime, setSelectedTime] = useState(null)
  const [selectedSpace, setSelectedSpace] = useState(null)
  const [showPayment, setShowPayment] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [paymentDetails, setPaymentDetails] = useState(null)
  const [reservationId, setReservationId] = useState(null)

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ]

  const spaces = [
    {
      id: 1,
      name: 'Espace Open',
      price: 20000,
      capacity: 4,
      equipment: ['WiFi', 'Écran partagé', 'Prise électrique', 'Table de réunion']
    },
    {
      id: 2,
      name: 'Bureau Privé',
      price: 25000,
      capacity: 1,
      equipment: ['WiFi', 'Écran', 'Prise électrique', 'Casier personnel']
    },
    {
      id: 3,
      name: 'Salle de Réunion',
      price: 40000,
      capacity: 8,
      equipment: ['WiFi', 'Écran 65"', 'Visioconférence', 'Tableau blanc', 'Café']
    }
  ]

  const handleTimeSelect = (time) => {
    setSelectedTime(time)
  }

  const handleSpaceSelect = (space) => {
    setSelectedSpace(space)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedTime) {
      alert('Veuillez sélectionner un créneau horaire')
      return
    }
    if (!selectedSpace) {
      alert('Veuillez sélectionner un espace')
      return
    }
    setShowPayment(true)
  }

  const handlePaymentSuccess = (order) => {
    setPaymentSuccess(true)
    setPaymentDetails(order)
    // Générer un ID de réservation unique
    setReservationId(Math.random().toString(36).substr(2, 9))
  }

  const handlePaymentError = (err) => {
    console.error('Erreur de paiement:', err)
    alert('Une erreur est survenue lors du paiement. Veuillez réessayer.')
  }

  if (paymentSuccess) {
    return (
      <Receipt
        reservation={{
          id: reservationId,
          date: selectedDate,
          time: selectedTime,
          space: selectedSpace
        }}
        paymentDetails={paymentDetails}
      />
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Réservez votre espace de coworking
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Section des espaces */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Choisissez votre espace
          </h2>
          <div className="space-y-4">
            {spaces.map((space) => (
              <SpaceCard
                key={space.id}
                space={space}
                onSelect={handleSpaceSelect}
                isSelected={selectedSpace?.id === space.id}
              />
            ))}
          </div>
        </div>

        {/* Section de réservation */}
        <div>
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Sélectionnez une date
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Sélectionnez un créneau horaire
              </label>
              <div className="grid grid-cols-3 gap-4">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    type="button"
                    className={`p-4 rounded-md text-center transition-colors ${
                      selectedTime === time
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 hover:bg-primary hover:text-white'
                    }`}
                    onClick={() => handleTimeSelect(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {selectedSpace && (
              <div className="mb-6 p-4 bg-gray-50 rounded-md">
                <h3 className="font-semibold text-gray-800 mb-2">Résumé de la réservation</h3>
                <p className="text-gray-600">
                  <span className="font-medium">Espace:</span> {selectedSpace.name}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Prix:</span> {selectedSpace.price} Fcfa
                </p>
                {selectedTime && (
                  <p className="text-gray-600">
                    <span className="font-medium">Créneau:</span> {selectedTime}
                  </p>
                )}
              </div>
            )}

            {showPayment ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Paiement via PayPal</h3>
                <PayPalButton
                  amount={selectedSpace.price}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </div>
            ) : (
              <button
                type="submit"
                className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition-colors"
                disabled={!selectedTime || !selectedSpace}
              >
                Procéder au paiement
              </button>
            )}
          </form>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Instructions</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>Sélectionnez un espace selon vos besoins</li>
          <li>Choisissez une date dans le calendrier</li>
          <li>Sélectionnez un créneau horaire disponible</li>
          <li>Effectuez le paiement via PayPal</li>
          <li>Recevez votre reçu avec QR code</li>
        </ul>
      </div>
    </div>
  )
}

export default Home 