import React from 'react';

const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Carte statistique 1 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Utilisateurs</h2>
          <p className="text-3xl font-bold text-blue-600">1,234</p>
          <p className="text-gray-500 mt-2">+12% ce mois</p>
        </div>

        {/* Carte statistique 2 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Revenus</h2>
          <p className="text-3xl font-bold text-green-600">Fcfa 45,678</p>
          <p className="text-gray-500 mt-2">+8% ce mois</p>
        </div>

        {/* Carte statistique 3 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Commandes</h2>
          <p className="text-3xl font-bold text-purple-600">567</p>
          <p className="text-gray-500 mt-2">+23% ce mois</p>
        </div>
      </div>

      {/* Graphique ou tableau récent */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Activité récente</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024-03-20</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Nouvelle commande</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Traoré Ali</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Complété
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024-03-19</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Mise à jour profil</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Coulibaly Issa</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    En cours
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 