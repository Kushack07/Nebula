import React, { useState, useEffect } from "react";
import { ShopEaseService, Product } from "@/lib/shopEaseService";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ShoppingBag, Star, RefreshCw } from "lucide-react";

interface ShopEaseCarouselProps {
    walletAddress: string;
}

export function ShopEaseCarousel({ walletAddress }: ShopEaseCarouselProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [redeemingId, setRedeemingId] = useState<number | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setIsLoading(true);
        const data = await ShopEaseService.getProducts();
        setProducts(data);
        setIsLoading(false);
    };

    const handleRedeem = async (productId: number, cost: number) => {
        if (!walletAddress) {
            toast.error("Please connect your wallet first!");
            return;
        }

        setRedeemingId(productId);
        try {
            const response = await ShopEaseService.redeemProduct(walletAddress, productId, cost);

            if (response.success) {
                toast.success(
                    `Successfully redeemed! Order ID: ${response.order_id}. Remaining balance: ${response.remaining_balance} $DUST`
                );
            } else {
                toast.error(response.message || "Failed to redeem product");
            }
        } catch (error) {
            toast.error("An unexpected error occurred during redemption.");
        } finally {
            setRedeemingId(null);
        }
    };

    // Helper to convert fiat price to "Stardust" $DUST cost loosely for demo purposes
    const getStardustCost = (price: number) => Math.floor(price * 10);

    if (isLoading) {
        return (
            <div className="flex h-48 w-full items-center justify-center">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading Shop Ease Products...</span>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="flex flex-col h-48 w-full items-center justify-center text-center p-4 border rounded-xl border-dashed">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-foreground">No Products Found</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                    Nebula could not fetch products from the Shop Ease service. Please ensure the backend server is running.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full py-6">
            <div className="flex items-center justify-between mb-4 px-2">
                <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    <ShoppingBag className="h-6 w-6 text-primary" />
                    Shop Ease Rewards
                </h2>
                <span className="text-sm text-muted-foreground bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                    Powered by Conversational Commerce
                </span>
            </div>

            {/* Horizontal Carousel Container */}
            <div className="flex overflow-x-auto gap-4 pb-6 px-2 snap-x scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
                {products.map((product) => {
                    const stardustCost = getStardustCost(product.price);
                    const isRedeeming = redeemingId === product.id;

                    return (
                        <Card key={product.id} className="min-w-[280px] max-w-[280px] snap-center shrink-0 border-primary/10 bg-card/50 backdrop-blur overflow-hidden group flex flex-col hover:border-primary/30 transition-all duration-300">
                            {/* Image Area - Using a placeholder if strictly image array not structured */}
                            <div className="h-48 w-full bg-muted relative overflow-hidden flex items-center justify-center border-b">
                                {product.images && product.images.length > 0 ? (
                                    <img
                                        src={product.images[0]}
                                        alt={product.name}
                                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
                                )}
                                {product.is_featured && (
                                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                                        Featured
                                    </div>
                                )}
                            </div>

                            <CardHeader className="p-4 pb-2">
                                <div className="flex justify-between items-start gap-2">
                                    <CardTitle className="text-base font-semibold leading-tight line-clamp-2">
                                        {product.name}
                                    </CardTitle>
                                </div>
                                {product.brand && <p className="text-xs text-muted-foreground">{product.brand}</p>}
                            </CardHeader>

                            <CardContent className="p-4 pt-0 flex-1 flex flex-col justify-end">
                                <div className="flex items-center gap-1 mb-3">
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    <span className="text-xs font-medium">{product.rating || 'New'}</span>
                                    {product.review_count > 0 && <span className="text-xs text-muted-foreground">({product.review_count})</span>}
                                </div>
                                <div className="flex items-end gap-2 text-xl font-bold text-primary">
                                    {stardustCost} <span className="text-sm font-medium text-foreground/70 mb-0.5">$DUST</span>
                                </div>
                            </CardContent>

                            <CardFooter className="p-4 pt-0">
                                <Button
                                    onClick={() => handleRedeem(product.id, stardustCost)}
                                    disabled={isRedeeming || product.stock <= 0}
                                    className="w-full flex items-center justify-center gap-2 group-hover:bg-primary/90 transition-colors"
                                >
                                    {isRedeeming ? (
                                        <><RefreshCw className="h-4 w-4 animate-spin" /> Processing...</>
                                    ) : product.stock <= 0 ? (
                                        "Out of Stock"
                                    ) : (
                                        "Redeem Points"
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
