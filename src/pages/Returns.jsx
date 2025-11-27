import React from 'react';

const Returns = () => {
    return (
        <div className="bg-white py-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl font-serif font-bold text-[var(--color-primary)] mb-8 text-center">Returns & Exchanges</h1>

                <div className="space-y-8 text-gray-700 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Return Policy</h2>
                        <p>
                            At Arundhati Handlooms, we take great care in inspecting every product before it is shipped. However, if you receive a defective or incorrect item, we are happy to offer a return or exchange.
                        </p>
                        <p className="mt-2">
                            Please note that due to the handcrafted nature of our products, slight variations in weave, color, and texture are natural and are not considered defects.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Eligibility for Returns</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Returns must be initiated within <strong>48 hours</strong> of delivery.</li>
                            <li>The product must be unused, unwashed, and in its original condition with all tags intact.</li>
                            <li>Sarees with detached blouse pieces or fall/pico done are <strong>not eligible</strong> for return.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">How to Initiate a Return</h2>
                        <p>
                            To initiate a return, please email us at <a href="mailto:orders@arundhatihandlooms.com" className="text-[var(--color-secondary)] underline">orders@arundhatihandlooms.com</a> with your order number and clear photos of the defect/issue. Our team will review your request and guide you through the process.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Refunds</h2>
                        <p>
                            Once we receive the returned item and verify its condition, we will process your refund within 5-7 business days. Refunds will be credited to the original payment method.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Returns;
