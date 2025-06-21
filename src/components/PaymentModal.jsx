import React, { useState } from 'react';
import reservationService from '../services/reservationService';
import PaymentReceipt from './PaymentReceipt';

const PaymentModal = ({ reservation, onClose, onSuccess }) => {
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [completedReservation, setCompletedReservation] = useState(null);
  const [completedPaymentDetails, setCompletedPaymentDetails] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulation d'un processus de paiement
      await simulatePayment();

      // Créer les détails de paiement
      const paymentDetails = {
        id: `PAY-${Date.now()}`,
        amount: reservation.space.price,
        method: 'Carte bancaire',
        status: 'completed',
        timestamp: new Date().toISOString()
      };

      // Créer la réservation avec les détails de paiement
      const newReservation = await reservationService.addReservation({
        ...reservation,
        paymentDetails: paymentDetails
      });

      // Stocker les données pour le reçu
      setCompletedReservation(newReservation);
      setCompletedPaymentDetails(paymentDetails);

      // Afficher le reçu
      setShowReceipt(true);

      // Notifier le succès
      if (onSuccess) {
        onSuccess(newReservation);
      }

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const simulatePayment = () => {
    return new Promise((resolve, reject) => {
      // Simulation d'un délai de traitement
      setTimeout(() => {
        // Simulation d'une validation de carte
        if (paymentData.cardNumber.length < 16) {
          reject(new Error('Numéro de carte invalide'));
          return;
        }
        if (paymentData.cvv.length < 3) {
          reject(new Error('Code CVV invalide'));
          return;
        }
        resolve();
      }, 2000);
    });
  };

  const handleReceiptClose = () => {
    setShowReceipt(false);
    setCompletedReservation(null);
    setCompletedPaymentDetails(null);
    // Fermer le modal de paiement
    if (onClose) {
      onClose();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  // Si le reçu est affiché, ne pas afficher le modal de paiement
  if (showReceipt && completedReservation && completedPaymentDetails) {
    return (
      <PaymentReceipt
        reservation={completedReservation}
        paymentDetails={completedPaymentDetails}
        onClose={handleReceiptClose}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Paiement</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Résumé de la réservation */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h3 className="font-semibold text-gray-800 mb-2">Résumé de la réservation</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <p><span className="font-medium">Espace:</span> {reservation.space.name}</p>
            <p><span className="font-medium">Date:</span> {new Date(reservation.date).toLocaleDateString('fr-FR')}</p>
            <p><span className="font-medium">Heure:</span> {reservation.time}</p>
            <p><span className="font-medium">Montant:</span> <span className="font-bold text-green-600">{reservation.space.price} Fcfa</span></p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Nom du titulaire
            </label>
            <input
              type="text"
              name="cardholderName"
              value={paymentData.cardholderName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Nom sur la carte"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Numéro de carte
            </label>
            <input
              type="text"
              name="cardNumber"
              value={paymentData.cardNumber}
              onChange={(e) => setPaymentData(prev => ({ ...prev, cardNumber: formatCardNumber(e.target.value) }))}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="1234 5678 9012 3456"
              maxLength="19"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Date d'expiration
              </label>
              <input
                type="text"
                name="expiryDate"
                value={paymentData.expiryDate}
                onChange={(e) => setPaymentData(prev => ({ ...prev, expiryDate: formatExpiryDate(e.target.value) }))}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="MM/AA"
                maxLength="5"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                CVV
              </label>
              <input
                type="text"
                name="cvv"
                value={paymentData.cvv}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="123"
                maxLength="4"
                required
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Traitement...' : `Payer ${reservation.space.price} Fcfa`}
            </button>
          </div>
        </form>

        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>🔒 Paiement sécurisé - Vos données sont protégées</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal; 