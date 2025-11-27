import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
    const { addToCart, cart, updateQuantity } = useCart();

    const cartItem = cart.find(item => item.id === product.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    const handleAddToCart = (e) => {
        e.preventDefault();
        addToCart(product);
    };

    const handleIncrement = (e) => {
        e.preventDefault();
        updateQuantity(product.id, quantity + 1);
    };

    const handleDecrement = (e) => {
        e.preventDefault();
        updateQuantity(product.id, quantity - 1);
    };

    return (
        <div className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="relative overflow-hidden aspect-[3/4]">
                <Link to={`/product/${product.slug}`}>
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                </Link>
                {product.isNew && (
                    <span className="absolute top-4 left-4 bg-[var(--color-primary)] text-white text-xs font-bold px-3 py-1 uppercase tracking-wider">
                        New
                    </span>
                )}

                {/* Add to Cart Overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-center">
                    {quantity > 0 ? (
                        <div className="flex items-center justify-between bg-white rounded-full shadow-lg overflow-hidden border border-gray-100 w-full max-w-[140px]">
                            <button
                                onClick={handleDecrement}
                                className="p-2 hover:bg-gray-100 text-[var(--color-primary)] transition-colors w-10 h-10 flex items-center justify-center"
                            >
                                <Minus size={16} />
                            </button>
                            <span className="font-bold text-[var(--color-primary)]">{quantity}</span>
                            <button
                                onClick={handleIncrement}
                                className="p-2 hover:bg-gray-100 text-[var(--color-primary)] transition-colors w-10 h-10 flex items-center justify-center"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-white text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white py-2.5 rounded-full font-medium text-sm transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                        >
                            <ShoppingBag size={16} />
                            Add to Cart
                        </button>
                    )}
                </div>
            </div>
            <div className="p-4">
                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">{product.category}</p>
                <Link to={`/product/${product.slug}`}>
                    <h3 className="font-serif text-lg font-medium text-gray-900 mb-2 group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">
                        {product.name}
                    </h3>
                </Link>
                {product.fabric_type && (
                    <p className="text-xs text-gray-600 mb-2">• {product.fabric_type}</p>
                )}
                {product.variants && product.variants.length > 1 && (
                    <p className="text-xs text-blue-600 mb-2">{product.variants.length} colors available</p>
                )}
                <div className="flex items-center gap-2">
                    {product.discount_percent > 0 ? (
                        <>
                            <p className="text-[var(--color-primary)] font-bold">
                                ₹{(product.price * (1 - product.discount_percent / 100)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </p>
                            <p className="text-gray-400 text-sm line-through">
                                ₹{Number(product.price).toLocaleString()}
                            </p>
                            <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-0.5 rounded-full">
                                {product.discount_percent}% OFF
                            </span>
                        </>
                    ) : (
                        <p className="text-[var(--color-primary)] font-bold">₹{Number(product.price).toLocaleString()}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
