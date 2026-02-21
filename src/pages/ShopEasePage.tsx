import React from 'react';

const ShopEasePage: React.FC = () => {
    const shopEaseUrl = (import.meta as any).env.VITE_SHOPEASE_URL || 'http://localhost:3000';
    const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    const isMissingEnvVar = isProduction && shopEaseUrl.includes('localhost');

    return (
        <div className="w-full h-screen pt-20 bg-background flex flex-col items-center justify-center">
            {isMissingEnvVar ? (
                <div className="max-w-md p-8 text-center border border-indigo-500/30 rounded-xl bg-indigo-500/10 shadow-lg shadow-indigo-500/20">
                    <h2 className="text-2xl font-bold text-indigo-400 mb-4">Vercel Configuration Needed</h2>
                    <p className="text-muted-foreground mb-4">
                        The Shop Ease UI iframe is currently trying to load <code>localhost:3000</code>, which is blocked by your browser on a live website due to mixed content security policies.
                    </p>
                    <p className="text-sm font-semibold text-primary">
                        Please go to your Vercel Dashboard for Nebula, add the Environment Variable <code>VITE_SHOPEASE_URL</code> with your deployed Shop Ease URL, and redeploy!
                    </p>
                </div>
            ) : (
                <iframe
                    src={shopEaseUrl}
                    className="w-full h-full border-none"
                    title="Shop Ease"
                    allow="fullscreen"
                />
            )}
        </div>
    );
};

export default ShopEasePage;
