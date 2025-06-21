import React, { useState } from 'react';
import reservationService from '../services/reservationService';
import PaymentModal from './PaymentModal';

const AddReservation = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    space: '',
    user: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingReservation, setPendingReservation] = useState(null);

  const spaces = [
    { name: 'Espace Open', price: 20000},
    { name: 'Bureau Privé', price: 25000 },
    { name: 'Salle de Réunion', price: 40000 }
  ];

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validation
      if (!formData.date || !formData.time || !formData.space || !formData.user) {
        throw new Error('Tous les champs sont obligatoires');
      }

      // Vérifier si la date n'est pas dans le passé
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        throw new Error('La date ne peut pas être dans le passé');
      }

      // Trouver l'espace sélectionné
      const selectedSpace = spaces.find(space => space.name === formData.space);
      if (!selectedSpace) {
        throw new Error('Espace invalide');
      }

      // Créer l'objet réservation temporaire
      const reservationData = {
        date: formData.date,
        time: formData.time,
        space: selectedSpace,
        user: formData.user
      };

      // Stocker la réservation en attente et ouvrir le modal de paiement
      setPendingReservation(reservationData);
      setShowPaymentModal(true);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (newReservation) => {
    // Réinitialiser le formulaire
    setFormData({
      date: '',
      time: '',
      space: '',
      user: ''
    });

    // Notifier le succès
    if (onSuccess) {
      onSuccess(newReservation);
    }

    // Fermer le modal
    if (onClose) {
      onClose();
    }
  };

  const handlePaymentClose = () => {
    setShowPaymentModal(false);
    setPendingReservation(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Nouvelle Réservation</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Nom complet
              </label>
              <input
                type="text"
                name="user"
                value={formData.user}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Votre nom complet"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Heure
              </label>
              <select
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Sélectionner une heure</option>
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Espace
              </label>
              <select
                name="space"
                value={formData.space}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Sélectionner un espace</option>
                {spaces.map(space => (
                  <option key={space.name} value={space.name}>
                    {space.name} - {space.price} Fcfa
                  </option>
                ))}
              </select>
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
                className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary disabled:opacity-50"
              >
                {loading ? 'Validation...' : 'Continuer vers le paiement'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal de paiement */}
      {showPaymentModal && pendingReservation && (
        <PaymentModal
          reservation={pendingReservation}
          onClose={handlePaymentClose}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
};

export default AddReservation; 