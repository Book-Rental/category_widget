import { useEffect, useState } from "react";
import { FiHeart } from "react-icons/fi";
import { Product } from "../types/product";
import WishlistModal from "./WishlistModal";
import { Modal, ModalBody, ModalFooter, ModalHeader, Rb_Button, Rb_Icon } from "@rentbook/rentbook-ui-lib";
import { AiFillHeart } from "react-icons/ai";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AddToCartModal from "./AddToCartModal";
import { addToCart } from "../services/cartService";
import { AddToCartPayload } from "../types/cart";
import { showToast } from "../utils/toast";


interface ProductActionsProps {
  product: Product;
  userId: string
}

function ProductActions({ product, userId }: ProductActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [addedType, setAddedType] = useState<"rent" | "purchase" | null>(null);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const isLoggedIn = window.HOST_USER_INFO ?? false;
  const [wishlists, setWishlists] = useState<Record<string, string[]>>( window.HOST_WISHLISTS ?? {});

  useEffect(() => {
    const handleWishlistStateChanged = (
      event: Event
    ) => {
      const customEvent = event as CustomEvent<Record<string, string[]>>;

      setWishlists(customEvent.detail);
    };

    window.addEventListener(
      "wishlist-state-changed",
      handleWishlistStateChanged
    );

    return () => {
      window.removeEventListener(
        "wishlist-state-changed",
        handleWishlistStateChanged
      );
    };
  }, []);

  let wishlistId: string | undefined;

  const isWishlisted =
    isLoggedIn &&
    !!Object.keys(wishlists).find((id) => {
      if (wishlists[id].includes(product._id)) {
        wishlistId = id;
        return true;
      }

      return false;
    });

    const handleAddToCart = async (payload: AddToCartPayload) => {
      setIsAddingToCart(true);

      try {
        await addToCart(payload);
        showToast("Book added to rental cart.", "success");
        setAddedType("rent");
      } catch (error) {
        showToast(
          error instanceof Error
            ? error.message
            : "Failed to add book to cart.",
          "error"
        );
      } finally {
        setIsAddingToCart(false);
      }
    };


  const queryClient = useQueryClient();

  const deleteBook = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/wishList/delete/${product._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            wishlistId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete book");
      }

      return response.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["wishlistNames", userId],
      });
      window.dispatchEvent(new CustomEvent("wishlist-refresh"));


      setIsRemoveModalOpen(false);
      showToast("Book removed from wishlist.", "success");
    },

    onError: () => {
      showToast("Failed to remove book.", "success");
    },
  });

  const handleWishlist = () => {
    if (isWishlisted) {
      setIsRemoveModalOpen(true);
    } else {
      setIsWishlistOpen(true);
    }
  }
  return (
    <>
      {isLoggedIn && (
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <Rb_Button
              disabled={isAddingToCart}
              onClick={() => {
                if (addedType || isAddingToCart) {
                  return;
                }
                setIsModalOpen(true);
              }}
            >
              {isAddingToCart ? "Adding..." : addedType ? "Go to Cart" : "Add to Cart"}
            </Rb_Button>
          </div>
            {isLoggedIn && <button
              type="button"
              className="ml-3 hover:text-red-500 transition-colors"
              onClick={() => handleWishlist()}
            >
              {isWishlisted ? (
                <Rb_Icon icon={AiFillHeart} color="red" size={22} />
              ) : (
                <Rb_Icon icon={FiHeart} size={22} />
              )}
            </button>}
        </div>
      )}
      <AddToCartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
        onProceed={handleAddToCart}
      />

      <Modal
        isOpen={isRemoveModalOpen}
        onClose={() => setIsRemoveModalOpen(false)}
      >
        <ModalHeader
          onClose={() => setIsRemoveModalOpen(false)}
        >
          Remove Book
        </ModalHeader>

        <ModalBody>
          <p className="leading-6 text-gray-600">
            Are you sure you want to remove this book from your wishlist?
          </p>
        </ModalBody>

        <ModalFooter>
          <div className="flex justify-end gap-3">
            <Rb_Button
              variant="secondary"
              onClick={() => setIsRemoveModalOpen(false)}
            >
              Cancel
            </Rb_Button>

            <Rb_Button
              className="!bg-red-600 hover:!bg-red-700"
              disabled={deleteBook.isPending}
              onClick={() => deleteBook.mutate()}
            >
              {deleteBook.isPending ? "Removing..." : "Remove"}
            </Rb_Button>
          </div>
        </ModalFooter>
      </Modal>

      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        product={product}
        userId={userId}
      />
    </>
  );
}

export default ProductActions;