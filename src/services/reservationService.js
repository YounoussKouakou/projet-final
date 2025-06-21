// Service de gestion des réservations avec localStorage
class ReservationService {
  constructor() {
    this.storageKey = 'coworking_reservations';
    this.listeners = [];
    this.initializeStorage();
  }

  // Initialiser le stockage avec des données par défaut
  initializeStorage() {
    if (!localStorage.getItem(this.storageKey)) {
      const defaultReservations = [
        {
          id: 1,
          date: '2024-03-20',
          time: '09:00',
          space: { name: 'Bureau Privé A', price: 15000 },
          status: 'confirmed',
          user: 'Traoré Ali',
          paymentDetails: {
            id: 'PAY-001',
            amount: 15000,
            method: 'Carte bancaire',
            status: 'completed',
            timestamp: new Date('2024-03-18').toISOString()
          },
          createdAt: new Date('2024-03-18').toISOString()
        },
        {
          id: 2,
          date: '2024-03-22',
          time: '14:00',
          space: { name: 'Salle de Réunion B', price: 25000 },
          status: 'pending',
          user: 'Coulibaly Issa',
          createdAt: new Date('2024-03-19').toISOString()
        },
        {
          id: 3,
          date: '2024-03-25',
          time: '10:00',
          space: { name: 'Espace Ouvert C', price: 8000 },
          status: 'confirmed',
          user: 'Diallo Fatou',
          paymentDetails: {
            id: 'PAY-003',
            amount: 8000,
            method: 'Carte bancaire',
            status: 'completed',
            timestamp: new Date('2024-03-20').toISOString()
          },
          createdAt: new Date('2024-03-20').toISOString()
        }
      ];
      localStorage.setItem(this.storageKey, JSON.stringify(defaultReservations));
    }
  }

  // Obtenir toutes les réservations
  getAllReservations() {
    try {
      const reservations = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      return reservations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
      console.error('Erreur lors de la récupération des réservations:', error);
      return [];
    }
  }

  // Ajouter une nouvelle réservation
  addReservation(reservationData) {
    try {
      const reservations = this.getAllReservations();
      const newReservation = {
        id: Date.now(), // ID unique basé sur le timestamp
        ...reservationData,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };
      
      reservations.unshift(newReservation); // Ajouter au début
      localStorage.setItem(this.storageKey, JSON.stringify(reservations));
      
      // Notifier les listeners
      this.notifyListeners();
      
      return newReservation;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la réservation:', error);
      throw error;
    }
  }

  // Supprimer une réservation
  deleteReservation(id) {
    try {
      const reservations = this.getAllReservations();
      const filteredReservations = reservations.filter(res => res.id !== id);
      localStorage.setItem(this.storageKey, JSON.stringify(filteredReservations));
      
      // Notifier les listeners
      this.notifyListeners();
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de la réservation:', error);
      throw error;
    }
  }

  // Obtenir les statistiques du dashboard
  getDashboardStats() {
    const reservations = this.getAllReservations();
    
    const totalReservations = reservations.length;
    const confirmedReservations = reservations.filter(r => r.status === 'confirmed').length;
    const pendingReservations = reservations.filter(r => r.status === 'pending').length;
    
    // Calculer les revenus et réservations payées
    const paidReservations = reservations.filter(r => r.paymentDetails && r.paymentDetails.status === 'completed').length;
    const totalRevenue = reservations
      .filter(r => r.paymentDetails && r.paymentDetails.status === 'completed')
      .reduce((sum, r) => sum + (r.paymentDetails.amount || 0), 0);
    
    const recentReservations = reservations.slice(0, 5); // 5 dernières réservations
    
    return {
      totalReservations,
      confirmedReservations,
      pendingReservations,
      paidReservations,
      totalRevenue,
      recentReservations
    };
  }

  // Système d'écoute pour les mises à jour en temps réel
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback(this.getAllReservations());
      } catch (error) {
        console.error('Erreur dans le listener:', error);
      }
    });
  }

  // Obtenir les réservations par statut
  getReservationsByStatus(status) {
    const reservations = this.getAllReservations();
    return reservations.filter(r => r.status === status);
  }

  // Obtenir les réservations par date
  getReservationsByDate(date) {
    const reservations = this.getAllReservations();
    return reservations.filter(r => r.date === date);
  }

  // Obtenir les réservations payées
  getPaidReservations() {
    const reservations = this.getAllReservations();
    return reservations.filter(r => r.paymentDetails && r.paymentDetails.status === 'completed');
  }

  // Obtenir les réservations non payées
  getUnpaidReservations() {
    const reservations = this.getAllReservations();
    return reservations.filter(r => !r.paymentDetails || r.paymentDetails.status !== 'completed');
  }
}

// Instance singleton
const reservationService = new ReservationService();
export default reservationService; 