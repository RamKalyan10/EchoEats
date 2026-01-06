import { Clock, Star, Plus } from 'lucide-react';

interface FoodCardProps {
  id: number;
  name: string;
  description: string;
  price: number;
  rating: number;
  deliveryTime: string;
  image: string;
  badge?: string;
  onAddToCart: (item: { id: number; name: string; price: number; image: string }) => void;
}

export function FoodCard({
  id,
  name,
  description,
  price,
  rating,
  deliveryTime,
  image,
  badge,
  onAddToCart,
}: FoodCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        {badge && (
          <span className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium">
            {badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-gray-900">{name}</h3>
          <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-lg">
            <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
            <span className="text-sm font-medium text-gray-900">{rating}</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-gray-500">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{deliveryTime}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t">
          <span className="text-xl font-semibold text-gray-900">${price.toFixed(2)}</span>
          <button
            onClick={() => onAddToCart({ id, name, price, image })}
            className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}