import { useEffect, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Dropdown,
  Rb_Button,
  Rb_Input,
} from "rentbook";
import { toast } from "react-toastify";
import { Product } from "../types/product";

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

function WishlistModal({
  isOpen,
  onClose,
  product,
}: WishlistModalProps) {
  // Temporary local wishlists
  const [wishlists, setWishlists] = useState([
    {
      label: "Programming Books",
      value: "programming",
    },
    {
      label: "Favorites",
      value: "favorites",
    },
    {
      label: "Weekend Reads",
      value: "weekend",
    },
  ]);

  const [newWishlist, setNewWishlist] = useState("");
  const [selectedWishlist, setSelectedWishlist] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setNewWishlist("");
      setSelectedWishlist("");
    }
  }, [isOpen]);

  const handleCreateWishlist = () => {
    if (!newWishlist.trim()) {
      toast.error("Please enter wishlist name.");
      return;
    }

    const value = newWishlist.toLowerCase().replace(/\s+/g, "-");

    setWishlists((prev) => [
      ...prev,
      {
        label: newWishlist,
        value,
      },
    ]);

    toast.success(
      `"${newWishlist}" created and "${product.name}" added successfully.`
    );

    onClose();
  };

  const handleAddToWishlist = () => {
    if (!selectedWishlist) {
      toast.error("Please select a wishlist.");
      return;
    }

    const wishlist = wishlists.find(
      (item) => item.value === selectedWishlist
    );

    toast.success(
      `"${product.name}" added to "${wishlist?.label}".`
    );

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalHeader onClose={onClose}>
        Save to Wishlist
      </ModalHeader>

      <ModalBody>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">

            <h3 className="font-semibold text-lg"> Create New Wishlist </h3>
            <Rb_Input
              placeholder="Wishlist Name"
              value={newWishlist}
              onChange={(e) =>
                setNewWishlist(e.target.value)
              }
            />
            <Rb_Button onClick={handleCreateWishlist} >
              Create Wishlist
            </Rb_Button>
          </div>


          <div className="flex items-center gap-4">
            <hr className="flex-1" />
            <span className="text-gray-500">
              OR
            </span>
            <hr className="flex-1" />
          </div>


          <div className="flex flex-col gap-3">

            <h3 className="font-semibold text-lg"> Add to Existing Wishlist </h3>
            <Dropdown
              placeholder="Select Wishlist"
              options={wishlists}
              value={selectedWishlist}
              onChange={setSelectedWishlist}
            />
            <Rb_Button
              onClick={handleAddToWishlist}
            >
              Add To Wishlist
            </Rb_Button>

          </div>          
        </div>
      </ModalBody>
    </Modal>
  );
}

export default WishlistModal;