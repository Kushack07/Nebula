import React from 'react';

const ShopEasePage: React.FC = () => {
    const shopEaseUrl = 'https://shop-ease-1.vercel.app/';

    return (
        <div className="w-full h-screen pt-20 bg-background flex flex-col items-center justify-center">
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
