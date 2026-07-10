import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Product } from "../types/product";
import { useWishlistMutations } from "../hooks/useWishlistMutations";
import { FiArrowLeft } from "react-icons/fi";
import { useWishlistNames } from "../hooks/useWishlistNames";
import { Modal, ModalHeader, ModalBody, Dropdown, Rb_Button, Rb_Input } from "@rentbook/rentbook-ui-lib";

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  userId: string
}

function WishlistModal({ isOpen, onClose, product, userId}: WishlistModalProps) {
  const { data } = useWishlistNames( userId, isOpen );
  const {
    addBookMutation,
    createWishlistMutation,
  } = useWishlistMutations( userId );

  const wishlistOptions =
  data?.data.map((wishlist) => ({
    label: wishlist.name,
    value: wishlist._id,
  })) ?? [];

  const [selectedWishlist, setSelectedWishlist] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newWishlist, setNewWishlist] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setIsCreating(false);
      setNewWishlist("");
      setSelectedWishlist("");
    }
  }, [isOpen]);

   const handleAdd = async (
    wishlistId: string,
    wishlistName: string
    ) => {
    try {
        await addBookMutation.mutateAsync({
        wishlistId,
        bookId: product._id,
        });

        toast.success(
        `"${product.name}" added to "${wishlistName}".`
        );

        onClose();
    } catch (error) {
        toast.error(
        error instanceof Error
            ? error.message
            : "Failed to add to wishlist."
        );
    }
  };

  const handleCreate = async () => {
    if (!newWishlist.trim()) {
        toast.error("Please enter wishlist name.");
        return;
    }

    try {
        const result = await createWishlistMutation.mutateAsync({
            name: newWishlist.trim(),
        });

        await addBookMutation.mutateAsync({
        wishlistId: result.data._id,
        bookId: product._id,
        });

        toast.success(
        `"${product.name}" added to "${newWishlist}".`
        );
        onClose();
    } 
    catch (error) {
        toast.error(
        error instanceof Error
            ? error.message
            : "Failed to create wishlist."
        );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader onClose={onClose}>
        {isCreating
        ? "Create New Wishlist"
        : "Add to Wishlist"}
      </ModalHeader>

      <ModalBody>
        {!isCreating ? (
            <div className="flex flex-col gap-4">

                <Dropdown
                placeholder="Select Wishlist"
                options={wishlistOptions}
                value={selectedWishlist}
                onChange={setSelectedWishlist}
                />
              
                <button
                    type="button"
                    onClick={() => setIsCreating(true)}
                    className="self-start font-medium"
                >
                    + Create New Wishlist
                </button>

                <div className="mt-4 flex justify-end gap-3">
                    <Rb_Button
                        disabled={ !selectedWishlist || addBookMutation.isPending}
                        onClick={() => {
                            const wishlist = data?.data.find(
                                (w) => w._id === selectedWishlist
                            );
                            if (!wishlist) return;
                            handleAdd(
                                wishlist._id,
                                wishlist.name
                            );
                        }}
                        >
                        { addBookMutation.isPending ? "Adding..." : "Add to Wishlist" }
                    </Rb_Button>
                </div>

            </div>
        ) : (
            <div className="flex flex-col gap-6">
                <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Wishlist Name
                        </label>
                        <Rb_Input
                            placeholder="Enter wishlist name"
                            value={newWishlist}
                            onChange={(e) => setNewWishlist(e.target.value)}
                            borderClass="border border-gray-300 rounded-lg"
                        />
                </div>
                <div className="flex items-center justify-between mt-4">
                    <button
                        type="button"
                        onClick={() => {
                        setIsCreating(false);
                        setNewWishlist("");
                        }}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <FiArrowLeft size={18} />
                         Add to existed 
                    </button>
                    <Rb_Button 
                    disabled={
                        !newWishlist.trim() ||
                        createWishlistMutation.isPending ||
                        addBookMutation.isPending
                    }
                    onClick={handleCreate}
                    > 
                        {createWishlistMutation.isPending ||
                        addBookMutation.isPending
                        ? "Creating..."
                        : "Create & Add"}
                    </Rb_Button>
                </div>

            </div>
        )}
      </ModalBody>
    </Modal>
  );
}

export default WishlistModal;