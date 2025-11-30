import React from 'react';
import { Award, Users, Heart, Palette, Scroll, Sparkles, Quote, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const About = () => {
    return (
        <div className="bg-white font-sans">
            <SEO
                title="About Arundhati Handlooms - Our Story"
                description="Learn about Arundhati Handlooms' journey in preserving traditional handloom craftsmanship. Supporting 200+ artisan families since 1975."
                keywords="handloom heritage, artisan sarees, traditional weaving, Indian textiles, handloom story"
            />
            {/* Hero */}
            <div className="relative h-[70vh] bg-gray-900 overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0">
                    <img
                        src="/images/kalamkari-red.png"
                        alt="Weaving Heritage"
                        className="w-full h-full object-cover opacity-40 scale-105 animate-slow-zoom"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-gray-900"></div>
                </div>
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <span className="text-[var(--color-secondary)] tracking-[0.3em] uppercase text-sm font-medium mb-6 block animate-fade-in-up">Est. 1975</span>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-8 leading-tight animate-fade-in-up delay-100">
                        Weaving Stories,<br />Preserving Traditions
                    </h1>
                    <p className="text-xl text-gray-200 font-light max-w-2xl mx-auto animate-fade-in-up delay-200">
                        A journey of passion, heritage, and the timeless art of Indian handlooms.
                    </p>
                </div>
            </div>

            {/* Our Mission */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-[var(--color-primary)] mb-8">Reviving the Golden Era</h2>
                        <p className="text-gray-600 leading-relaxed text-lg md:text-xl font-light">
                            "Arundhati Handlooms began as a humble initiative to bring the exquisite artistry of Indian handlooms to the world. What started in a small weaver's village has now grown into a community that cherishes and supports the magic of handmade textiles. We believe that every saree has a soul."
                        </p>
                        <div className="mt-12 w-24 h-1 bg-[var(--color-secondary)] mx-auto rounded-full"></div>
                    </div>
                </div>
            </section>

            {/* The Craft Process */}
            <section className="py-24 bg-[var(--color-bg)]">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-[var(--color-primary)] font-medium tracking-wider text-sm uppercase">The Process</span>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold mt-2">From Loom to Luxury</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gray-200 -z-10 transform -translate-y-1/2"></div>

                        {[
                            { icon: Scroll, title: "Design", desc: "Intricate patterns sketched by master artists." },
                            { icon: Palette, title: "Dyeing", desc: "Yarns soaked in vibrant, eco-friendly colors." },
                            { icon: Users, title: "Weaving", desc: "Handwoven with rhythm and precision on looms." },
                            { icon: Sparkles, title: "Finishing", desc: "Polished and inspected for perfection." }
                        ].map((step, index) => (
                            <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 text-center group">
                                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-[var(--color-primary)] mx-auto mb-6 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
                                    <step.icon size={32} />
                                </div>
                                <h3 className="text-xl font-serif font-bold mb-3">{step.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Founder's Note */}
            <section className="py-24 bg-white overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <div className="md:w-1/2 relative">
                            <div className="absolute -inset-4 border-2 border-[var(--color-secondary)] rounded-lg transform -translate-x-4 translate-y-4"></div>
                            <img
                                src="/images/chanderi-indigo-red.png"
                                alt="Founder"
                                className="rounded-lg shadow-2xl relative z-10 w-full h-[500px] object-cover"
                            />
                        </div>
                        <div className="md:w-1/2">
                            <Quote size={48} className="text-[var(--color-secondary)] mb-6 opacity-50" />
                            <h2 className="text-4xl font-serif font-bold text-[var(--color-primary)] mb-8">A Note from the Founder</h2>
                            <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                                <p>
                                    "Growing up surrounded by the rhythmic clatter of handlooms, I realized early on that this wasn't just cloth being woven—it was culture, history, and identity."
                                </p>
                                <p>
                                    "At Arundhati, we don't just sell sarees; we act as custodians of a dying art form. Every piece you buy directly supports a weaver's family and encourages the next generation to take up this noble craft."
                                </p>
                            </div>
                            <div className="mt-10">
                                <p className="font-serif font-bold text-xl text-gray-900">Arundhati</p>
                                <p className="text-[var(--color-secondary)] text-sm uppercase tracking-wider">Founder & Curator</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-24 bg-gray-900 text-white">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-12 text-center">
                        <div className="p-6">
                            <Award size={48} className="mx-auto mb-6 text-[var(--color-secondary)]" />
                            <h3 className="text-2xl font-serif font-bold mb-4">100% Authentic</h3>
                            <p className="text-gray-400 leading-relaxed">Silk Mark certified products sourced directly from the weavers of Banaras, Chanderi, and Kanchipuram.</p>
                        </div>
                        <div className="p-6 border-l border-r border-gray-800">
                            <Users size={48} className="mx-auto mb-6 text-[var(--color-secondary)]" />
                            <h3 className="text-2xl font-serif font-bold mb-4">Community First</h3>
                            <p className="text-gray-400 leading-relaxed">We support over 200 artisan families, ensuring fair wages, healthcare, and sustainable livelihoods.</p>
                        </div>
                        <div className="p-6">
                            <Heart size={48} className="mx-auto mb-6 text-[var(--color-secondary)]" />
                            <h3 className="text-2xl font-serif font-bold mb-4">Made with Love</h3>
                            <p className="text-gray-400 leading-relaxed">Each saree takes 2-4 weeks to weave, carrying the dedication and passion of its creator.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-[var(--color-secondary)] relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-[var(--color-primary)] mb-6">Be a Part of Our Story</h2>
                    <p className="text-xl text-[var(--color-primary)]/80 mb-10 max-w-2xl mx-auto">
                        Experience the elegance of true handloom. Wrap yourself in a legacy that has stood the test of time.
                    </p>
                    <Link
                        to="/shop"
                        className="bg-[var(--color-primary)] text-white px-10 py-4 rounded-full font-medium text-lg hover:bg-white hover:text-[var(--color-primary)] transition-all shadow-xl inline-flex items-center gap-2 transform hover:scale-105"
                    >
                        Explore Collection <ArrowRight size={20} />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default About;
