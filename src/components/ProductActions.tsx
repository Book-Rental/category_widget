import { useState } from "react";
import { FiHeart } from "react-icons/fi";
import { Product } from "../types/product";
import { toast } from "react-toastify";
import WishlistModal from "./WishlistModal";
import { Rb_Button, Rb_Icon, Modal, ModalHeader, ModalBody, Rb_Radio, Dropdown, ModalFooter } from "@rentbook/rentbook-ui-lib";
import { AiFillHeart } from "react-icons/ai";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ProductActionsProps {
  product: Product;
  userId: string
}

function ProductActions({ product, userId }: ProductActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState("");
  const [actionType, setActionType] = useState<"rent" | "purchase" | "">("");
  const [addedType, setAddedType] = useState<"rent" | "purchase" | null>(null);
  const isProceedDisabled = actionType === "" ? true : actionType === "rent" ? !selectedDuration : false;
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  // const isLoggedIn = !!userId;

  const isLoggedIn = window.HOST_USER_INFO ?? false;

  let isWishlisted = false;
  let wishlistId: string | undefined;

  if (isLoggedIn) {
    const wishlists = window.HOST_WISHLISTS ?? {};
    console.log(wishlists)
    console.log("product._id", product._id)
    wishlistId = Object.keys(wishlists).find((id) =>
      wishlists[id].includes(product._id),
    );

    isWishlisted = !!wishlistId;
  }
  const rentalOptions = [
    {
      label: `1 Day - ₹${product.rentalPricePerDay}`,
      value: "day",
    },
    {
      label: `1 Week - ₹${product.rentalPricePerWeek}`,
      value: "week",
    },
    {
      label: `1 Month - ₹${product.rentalPricePerMonth}`,
      value: "month",
    },
  ];

  const handleProceed = () => {
    if (!actionType) return;
    setAddedType(actionType);

    toast.success(
      actionType === "rent"
        ? "Book added to rental cart."
        : "Book added to cart."
    );

    setIsModalOpen(false);
    setActionType("");
    setSelectedDuration("");
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
      toast.success("Book removed from wishlist.");
    },

    onError: () => {
      toast.error("Failed to remove book.");
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
              onClick={() => {
                if (addedType) {
                  console.log("Navigate to Cart");
                  return;
                }
                setIsModalOpen(true);
              }}
            >
              {addedType ? "Go to Cart" : "Add to Cart"}
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setActionType("");
          setSelectedDuration("");
        }}
      >
        <ModalHeader
          onClose={() => {
            setIsModalOpen(false);
            setActionType("");
            setSelectedDuration("");
          }}
        >
          Choose Purchase Option
        </ModalHeader>

        <ModalBody>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <Rb_Radio
                name="purchaseOption"
                label="Rent Now"
                value="rent"
                checked={actionType === "rent"}
                onChange={() => setActionType("rent")}
              />
              {actionType === "rent" && (
                <div className="mt-3 ml-7">
                  <Dropdown
                    placeholder="Select Rental Duration"
                    options={rentalOptions}
                    value={selectedDuration}
                    onChange={setSelectedDuration}
                  />
                </div>
              )}

              <Rb_Radio
                name="purchaseOption"
                label="Purchase Now"
                value="purchase"
                checked={actionType === "purchase"}
                onChange={() => setActionType("purchase")}
              />
              {actionType === "purchase" && (
                <div className="rounded-md border p-3 bg-gray-50">
                  <p className="text-sm text-gray-500">
                    Purchase Price
                  </p>

                  <p className="text-lg font-semibold">
                    ₹{product.purchasePrice}
                  </p>
                </div>
              )}
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <div className="flex justify-end">
            <Rb_Button
              disabled={isProceedDisabled}
              onClick={handleProceed}
            >
              Proceed
            </Rb_Button>
          </div>
        </ModalFooter>
      </Modal>
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