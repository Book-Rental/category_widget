import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addBookToWishlist, createWishlistGroup } from "../services/wishlistService";

export const useWishlistMutations = (userId: string) => {
    const queryClient = useQueryClient();

    const addBookMutation = useMutation({
        mutationFn: ({
            wishlistId,
            bookId,
        }: {
            wishlistId: string;
            bookId: string;
        }) => addBookToWishlist(wishlistId, bookId),
      });
    
      const createWishlistMutation = useMutation({
        mutationFn: ({
            name,
        }: {
            name: string;
        }) => createWishlistGroup(userId, name),
    
        onSuccess: () => {
            queryClient.invalidateQueries({
            queryKey: ["wishlistNames", userId],
            });
        },
       });
    return { addBookMutation, createWishlistMutation, };
}