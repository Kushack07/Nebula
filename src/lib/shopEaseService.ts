/**
 * Shop Ease API Integration Service
 * 
 * This service connects the Cardano Nebula AI frontend to the Shop Ease Backend.
 * It provides strict typings for interacting with Shop Ease's products and the newly
 * created reward system endpoints.
 */

const SHOPEASE_API_URL = import.meta.env.VITE_SHOPEASE_API_URL || 'http://localhost:5001/api';

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    original_price?: number;
    images: string[];
    category_id: number;
    brand: string;
    rating: number;
    review_count: number;
    stock: number;
    sku: string;
    is_active: boolean;
    is_featured: boolean;
}

export interface RedeemResponse {
    success: boolean;
    message: string;
    order_id?: number;
    remaining_balance?: number;
}

export const ShopEaseService = {
    /**
     * Fetch the active product catalog from Shop Ease.
     */
    async getProducts(): Promise<Product[]> {
        try {
            const response = await fetch(`${SHOPEASE_API_URL}/products?limit=20`);
            const data = await response.json();
            if (data.success) {
                return data.data;
            }
            throw new Error(data.message || 'Failed to fetch products');
        } catch (error) {
            console.error('Error fetching Shop Ease products:', error);
            return [];
        }
    },

    /**
     * Link a Cardano Wallet to a Shop Ease User Account via email.
     * This should be called once the user authenticates with Nebula.
     */
    async linkWallet(email: string, walletAddress: string): Promise<boolean> {
        try {
            const response = await fetch(`${SHOPEASE_API_URL}/integration/link-wallet`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, wallet_address: walletAddress })
            });
            const data = await response.json();
            return data.success;
        } catch (error) {
            console.error('Error linking wallet to Shop Ease:', error);
            return false;
        }
    },

    /**
     * Sync exactly how much Stardust was earned by an action.
     */
    async syncRewards(walletAddress: string, stardustEarned: number): Promise<number | null> {
        try {
            const response = await fetch(`${SHOPEASE_API_URL}/integration/sync-rewards`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ wallet_address: walletAddress, stardust_earned: stardustEarned })
            });
            const data = await response.json();
            if (data.success) {
                return data.balance;
            }
            return null;
        } catch (error) {
            console.error('Error syncing rewards:', error);
            return null;
        }
    },

    /**
     * Triggers the "Conversational Commerce" purchase using user's Stardust.
     * Calls the backend which verifies the balance, creates an order, and deducts the balance.
     */
    async redeemProduct(walletAddress: string, productId: number, stardustCost: number): Promise<RedeemResponse> {
        try {
            const response = await fetch(`${SHOPEASE_API_URL}/integration/redeem`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    wallet_address: walletAddress,
                    product_id: productId,
                    stardust_cost: stardustCost
                })
            });
            return await response.json();
        } catch (error) {
            console.error('Error redeeming product:', error);
            return { success: false, message: 'Network error occurred during redemption' };
        }
    }
};
