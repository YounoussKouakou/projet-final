import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

const PaymentReceipt = ({ reservation, paymentDetails, onClose }) => {
  const generateQRData = () => {
    return JSON.stringify({
      reservationId: reservation.id,
      paymentId: paymentDetails.id,
      date: reservation.date,
      time: reservation.time,
      space: reservation.space.name,
      amount: paymentDetails.amount,
      user: reservation.user,
      timestamp: paymentDetails.timestamp
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Créer un lien de téléchargement pour le reçu
    const receiptContent = `
      Reçu de Paiement - Coworking Space
      
      Numéro de réservation: ${reservation.id}
      ID Transaction: ${paymentDetails.id}
      Date: ${new Date(reservation.date).toLocaleDateString('fr-FR')}
      Heure: ${reservation.time}
      Espace: ${reservation.space.name}
      Montant: ${paymentDetails.amount} Fcfa
      Client: ${reservation.user}
      Méthode de paiement: ${paymentDetails.method}
      Statut: ${paymentDetails.status}
      Date de paiement: ${new Date(paymentDetails.timestamp).toLocaleString('fr-FR')}
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recu-${reservation.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Reçu de Paiement</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-2xl text-green-600">✓</span>
          </div>
          <h3 className="text-lg font-semibold text-green-600">Paiement Réussi !</h3>
          <p className="text-sm text-gray-600">Votre réservation a été confirmée</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-gray-800 mb-3">Détails de la Réservation</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Numéro de réservation:</span>
              <span className="font-medium">{reservation.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{new Date(reservation.date).toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Heure:</span>
              <span className="font-medium">{reservation.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Espace:</span>
              <span className="font-medium">{reservation.space.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Client:</span>
              <span className="font-medium">{reservation.user}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-gray-800 mb-3">Détails du Paiement</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">ID Transaction:</span>
              <span className="font-medium">{paymentDetails.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Montant:</span>
              <span className="font-bold text-green-600">{paymentDetails.amount} Fcfa</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Méthode:</span>
              <span className="font-medium">{paymentDetails.method}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Statut:</span>
              <span className="font-medium text-green-600">{paymentDetails.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date de paiement:</span>
              <span className="font-medium">{new Date(paymentDetails.timestamp).toLocaleString('fr-FR')}</span>
            </div>
          </div>
        </div>

        <div className="text-center mb-6">
          <h4 className="font-semibold text-gray-800 mb-3">QR Code de Validation</h4>
          <div className="flex justify-center">
            <QRCodeSVG
              value={generateQRData()}
              size={200}
              level="H"
              includeMargin={true}
              className="border-2 border-gray-200 rounded-lg"
            />
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Présentez ce QR code à l'accueil lors de votre arrivée
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handlePrint}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Imprimer
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Télécharger
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors"
          >
            Fermer
          </button>
        </div>

        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>Merci pour votre confiance !</p>
          <p>Ce reçu fait foi de paiement</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentReceipt; 