import { useState } from "react";
import { Dropdown, Modal, ModalBody, ModalHeader, ModalFooter, Rb_Button, Rb_Icon, Rb_Radio } from "rentbook";
import { FiHeart } from "react-icons/fi";
import { Product } from "../types/product";
import { toast } from "react-toastify";
import WishlistModal from "./WishlistModal";


interface ProductActionsProps {
  product: Product;
}

function ProductActions({ product }: ProductActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState("");
  const [actionType, setActionType] = useState<"rent" | "purchase" | "">("");
  const [addedType, setAddedType] = useState<"rent" | "purchase" | null>(null);
  const isProceedDisabled = actionType === "" ? true : actionType === "rent" ? !selectedDuration : false;

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

  return (
    <>
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

        <button
          type="button"
          className="ml-3 hover:text-red-500 transition-colors"
          onClick={() => setIsWishlistOpen(true)}
        >
          <Rb_Icon
            icon={FiHeart}
            size={22}
          />
        </button>
      </div>

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
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        product={product}
      />
    </>
  );
}

export default ProductActions;