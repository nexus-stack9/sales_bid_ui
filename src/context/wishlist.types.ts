export const WISHLIST_UPDATE_EVENT = 'wishlist-update';

export type WishlistContextType = {
  wishlistCount: number;
  ordersCount: number;
  refreshWishlist: () => Promise<number>;
  updatePathname: (pathname: string) => void;
  pathname: string;
  lastUpdate: number;
  triggerWishlistUpdate: () => void;
  updateCounts: () => Promise<void>;
};
