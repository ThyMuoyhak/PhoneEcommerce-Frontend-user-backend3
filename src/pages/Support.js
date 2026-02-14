import { useState } from 'react';

const Support = () => {
    const [activeFaq, setActiveFaq] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        orderNumber: '',
        issue: '',
        message: ''
    });

    const faqs = [
        {
            question: "How long does shipping take?",
            answer: "Standard shipping takes 3-5 business days. Express shipping takes 1-2 business days."
        },
        {
            question: "What is your return policy?",
            answer: "We offer 30-day returns for all unused products in original packaging."
        },
        {
            question: "Do you offer warranty?",
            answer: "Yes, all products come with a 1-year manufacturer warranty."
        },
        {
            question: "How can I track my order?",
            answer: "You'll receive a tracking number via email once your order ships."
        }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Support form submitted:', formData);
        alert('Thank you for contacting us. We\'ll get back to you soon!');
        setFormData({ name: '', email: '', orderNumber: '', issue: '', message: '' });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">Support Center</h1>
            <p className="text-xl text-gray-600 mb-12 text-center">How can we help you today?</p>

            {/* Quick Help Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition duration-300">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Live Chat</h3>
                    <p className="text-gray-600 mb-4">Chat with our support team</p>
                    <button className="text-blue-600 hover:text-blue-800 font-semibold">
                        Start Chat →
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition duration-300">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Phone Support</h3>
                    <p className="text-gray-600 mb-4">Call us at +1 (800) 123-4567</p>
                    <p className="text-sm text-gray-500">Mon-Fri: 9AM - 6PM</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition duration-300">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Email Support</h3>
                    <p className="text-gray-600 mb-4">support@phonehub.com</p>
                    <p className="text-sm text-gray-500">24/7 Response within 24h</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* FAQ Section */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                                <button
                                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                                    className="w-full text-left p-4 flex justify-between items-center hover:bg-gray-50"
                                >
                                    <span className="font-semibold text-gray-900">{faq.question}</span>
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        className={`h-5 w-5 transform transition duration-300 ${activeFaq === index ? 'rotate-180' : ''}`}
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {activeFaq === index && (
                                    <div className="p-4 bg-gray-50 border-t border-gray-200">
                                        <p className="text-gray-600">{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Form */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Order Number (optional)
                            </label>
                            <input
                                type="text"
                                name="orderNumber"
                                value={formData.orderNumber}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Issue Type *
                            </label>
                            <select
                                name="issue"
                                value={formData.issue}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select an issue</option>
                                <option value="order">Order Issue</option>
                                <option value="product">Product Question</option>
                                <option value="return">Return/Refund</option>
                                <option value="shipping">Shipping</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Message *
                            </label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                required
                                rows="4"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition duration-300"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Support;