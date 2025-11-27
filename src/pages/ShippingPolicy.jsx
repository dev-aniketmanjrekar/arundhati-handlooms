import React from 'react';

const ShippingPolicy = () => {
    return (
        <div className="bg-white py-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl font-serif font-bold text-[var(--color-primary)] mb-8 text-center">Shipping Policy</h1>

                <div className="space-y-8 text-gray-700 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Shipping Locations</h2>
                        <p>
                            We currently ship to all major cities and towns across India. For international shipping inquiries, please contact us directly at orders@arundhatihandlooms.com.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Delivery Time</h2>
                        <p className="mb-2">
                            <strong>Ready to Ship:</strong> Orders are dispatched within 24-48 hours and typically delivered within 3-7 business days depending on your location.
                        </p>
                        <p>
                            <strong>Made to Order:</strong> Custom orders may take 2-4 weeks for weaving and finishing. We will keep you updated on the progress of your order.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Shipping Charges</h2>
                        <p>
                            We offer <strong>FREE Shipping</strong> on all orders above ₹5000 within India. For orders below this amount, a flat shipping fee of ₹150 applies.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Tracking Your Order</h2>
                        <p>
                            Once your order is shipped, you will receive a tracking number via email and SMS. You can use this to track your package on our courier partner's website.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ShippingPolicy;
