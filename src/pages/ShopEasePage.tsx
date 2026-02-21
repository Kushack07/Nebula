import React from 'react';

const ShopEasePage: React.FC = () => {
    const shopEaseUrl = (import.meta as any).env.VITE_SHOPEASE_URL || 'http://localhost:3000';

    return (
        <div className="w-full h-screen pt-20"> {/* Adjust padding for the navbar if needed */}
            <iframe
                src={shopEaseUrl}
                className="w-full h-full border-none"
                title="Shop Ease"
                allow="fullscreen"
            />
        </div>
    );
};

export default ShopEasePage;
