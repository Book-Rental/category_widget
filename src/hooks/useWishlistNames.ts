import { useQuery } from "@tanstack/react-query";
import { getWishlistNames } from "../services/wishlistService";

export const useWishlistNames = (
  userId: string,
  enabled: boolean
) => {
  return useQuery({
    queryKey: ["wishlistNames", userId],
    queryFn: () => getWishlistNames(userId),
    enabled:  enabled && !!userId,
  });
};