import React from 'react'

function Receipt({ reservation, paymentDetails }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Reçu de Réservation</h2>
          <p className="text-gray-600">Coworking Space</p>
        </div>

        <div className="border-t border-b py-4">
          <div className="flex justify-between mb-2">
            <span className="font-medium">Numéro de réservation:</span>
            <span>{reservation.id}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-medium">Date:</span>
            <span>{new Date(reservation.date).toLocaleDateString('fr-FR')}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-medium">Heure:</span>
            <span>{reservation.time}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-medium">Espace:</span>
            <span>{reservation.space.name}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-medium">Montant:</span>
            <span>{reservation.space.price} Fcfa</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">ID Transaction:</span>
            <span>{paymentDetails?.id || 'N/A'}</span>
          </div>
        </div>

        <div className="text-center text-sm text-gray-600">
          <p>Votre réservation a été confirmée</p>
          <p>Présentez ce reçu à l'accueil lors de votre arrivée</p>
        </div>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={() => window.print()}
          className="bg-primary text-white px-6 py-2 rounded-md hover:bg-secondary transition-colors"
        >
          Imprimer le reçu
        </button>
      </div>
    </div>
  )
}

export default Receipt 