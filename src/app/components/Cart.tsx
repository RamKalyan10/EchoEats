import { ShoppingCart, Plus, Minus, Trash2, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from './ui/dialog';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartProps {
  items: CartItem[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
  onCheckout: () => void;
}

export function Cart({
  items,
  isOpen,
  onOpenChange,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartProps) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = items.length > 0 ? 3.99 : 0;
  const total = subtotal + deliveryFee;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ShoppingCart className="w-6 h-6 text-gray-700" />
          <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {totalItems}
          </span>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-md max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-orange-500" />
            Your Cart
          </DialogTitle>
          <DialogDescription className="sr-only">
            Review your cart items and complete your order
          </DialogDescription>
        </DialogHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 text-sm">Add items from the menu to get started!</p>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 bg-gray-50 p-3 rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{item.name}</h4>
                    <p className="text-orange-600 font-semibold mb-2">${item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                        className="w-7 h-7 bg-white border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>
                      <span className="w-8 text-center font-medium text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 bg-white border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors h-fit"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="border-t bg-white p-6 space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t">
                <span>Total</span>
                <span className="text-orange-600">${total.toFixed(2)}</span>
              </div>

              <button
                onClick={onCheckout}
                className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors mt-4"
              >
                Complete Order
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
