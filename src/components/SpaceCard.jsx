function SpaceCard({ space, onSelect, isSelected }) {
  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-primary' : 'hover:shadow-lg'
      }`}
      onClick={() => onSelect(space)}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{space.name}</h3>
        <span className="text-primary font-bold">{space.price}Fcfa/jour</span>
      </div>
      
      <div className="space-y-2">
        <p className="text-gray-600">
          <span className="font-medium">Capacité:</span> {space.capacity} personnes
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Équipements:</span>
        </p>
        <ul className="list-disc list-inside text-gray-600">
          {space.equipment.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default SpaceCard 