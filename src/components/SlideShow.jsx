import { useState, useEffect } from 'react';

const SlideShow = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    
    const slides = [
        {
            image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1780&q=80",
            title: "Latest Smartphones",
            description: "Discover the newest technology"
        },
        {
            image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1742&q=80",
            title: "Exclusive Deals",
            description: "Up to 40% off on selected models"
        },
        {
            image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
            title: "Premium Accessories",
            description: "Complete your phone experience"
        }
    ];

    // Auto slide
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    return (
        <div className="relative w-full h-[500px] overflow-hidden">
            {/* Slides */}
            <div className="relative h-full">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute w-full h-full transition-opacity duration-1000 ${
                            index === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        {/* Background Image */}
                        <div 
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${slide.image})` }}
                        >
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                        </div>
                        
                        {/* Content */}
                        <div className="relative h-full flex items-center justify-center text-center text-white">
                            <div className="max-w-2xl px-4">
                                <h2 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
                                    {slide.title}
                                </h2>
                                <p className="text-lg md:text-xl mb-8 animate-fade-in-delay">
                                    {slide.description}
                                </p>
                                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition duration-300 transform hover:scale-105">
                                    Shop Now
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            <button 
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white w-10 h-10 rounded-full flex items-center justify-center transition duration-300"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            
            <button 
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white w-10 h-10 rounded-full flex items-center justify-center transition duration-300"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === currentSlide 
                                ? 'w-8 bg-blue-600' 
                                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default SlideShow;