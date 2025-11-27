import React from 'react';
import { Award, Users, Heart } from 'lucide-react';

const About = () => {
    return (
        <div className="bg-white">
            {/* Hero */}
            <div className="relative h-[60vh] bg-gray-900 overflow-hidden">
                <img
                    src="/images/kalamkari-red.png"
                    alt="Weaving Heritage"
                    className="w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 flex items-center justify-center text-center px-4">
                    <div className="max-w-3xl">
                        <span className="text-[var(--color-secondary)] tracking-widest uppercase text-sm font-medium mb-4 block">Since 1975</span>
                        <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6">Weaving Stories,<br />Preserving Traditions</h1>
                    </div>
                </div>
            </div>

            {/* Our Story */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <div className="md:w-1/2">
                            <h2 className="text-4xl font-serif font-bold text-[var(--color-primary)] mb-6">Our Story</h2>
                            <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                                Arundhati Handlooms began as a humble initiative to bring the exquisite artistry of Indian handlooms to the world. What started in a small weaver's village has now grown into a community that cherishes and supports the magic of handmade textiles.
                            </p>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                We believe that every saree has a soul. It carries the rhythm of the loom, the skill of the artisan, and the legacy of generations. Our mission is to keep this art alive by connecting master weavers directly with connoisseurs like you.
                            </p>
                        </div>
                        <div className="md:w-1/2 grid grid-cols-2 gap-4">
                            <img src="/images/chanderi-indigo-red.png" alt="Weaving" className="rounded-lg shadow-lg w-full h-64 object-cover" />
                            <img src="/images/golden-tissue-blue.png" alt="Fabric" className="rounded-lg shadow-lg w-full h-64 object-cover mt-8" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 bg-[var(--color-bg)]">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-[var(--color-primary)] mx-auto mb-6">
                                <Award size={32} />
                            </div>
                            <h3 className="text-xl font-serif font-bold mb-4">Authenticity</h3>
                            <p className="text-gray-600">Every product is Silk Mark certified and directly sourced from weavers, ensuring 100% authenticity.</p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-[var(--color-primary)] mx-auto mb-6">
                                <Users size={32} />
                            </div>
                            <h3 className="text-xl font-serif font-bold mb-4">Empowerment</h3>
                            <p className="text-gray-600">We support over 200 artisan families, ensuring fair wages and sustainable livelihoods.</p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-[var(--color-primary)] mx-auto mb-6">
                                <Heart size={32} />
                            </div>
                            <h3 className="text-xl font-serif font-bold mb-4">Passion</h3>
                            <p className="text-gray-600">Driven by a deep love for Indian textiles, we curate only the finest pieces for your wardrobe.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
