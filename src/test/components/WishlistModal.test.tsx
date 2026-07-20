import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import WishlistModal from "../../components/WishlistModal";
import type { Product } from "../../types/product";
import type { ReactNode } from "react";

vi.mock("../../hooks/useWishlistNames", () => ({
  useWishlistNames: vi.fn(),
}));

vi.mock("../../hooks/useWishlistMutations", () => ({
  useWishlistMutations: vi.fn(),
}));

vi.mock("../../utils/toast", () => ({
  showToast: vi.fn(),
}));

vi.mock("@rentbook/rentbook-ui-lib", async () => {
  const actual = await vi.importActual("@rentbook/rentbook-ui-lib");
  return {
    ...actual,
    Rb_Button: ({ children, onClick , disabled}: {
      children: ReactNode;
      onClick?: () => void;
      disabled?: boolean;
    }) => (
      <button onClick={onClick} disabled={disabled}>
        {children}
      </button>
    ),
  };
});

import { useWishlistNames } from "../../hooks/useWishlistNames";
import { useWishlistMutations } from "../../hooks/useWishlistMutations";
import { showToast } from "../../utils/toast";

const product: Product = {
  _id: "1",
  name: "Atomic Habits",
  description: "Book",
  author: "James Clear",
  coverImage: "",
  images: [],
  purchasePrice: 500,
  rentalPricePerDay: 20,
  rentalPricePerWeek: 100,
  rentalPricePerMonth: 300,
  securityDeposit: 100,
};

const addBookMutation = {
  mutateAsync: vi.fn(),
  isPending: false,
};

const createWishlistMutation = {
  mutateAsync: vi.fn(),
  isPending: false,
};

describe("WishlistModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useWishlistNames as ReturnType<typeof vi.fn>).mockReturnValue({
      data: {
        data: [
          {
            _id: "wishlist1",
            name: "Favorites",
          },
          {
            _id: "wishlist2",
            name: "Reading",
          },
        ],
      },
    });

    (useWishlistMutations as ReturnType<typeof vi.fn>).mockReturnValue({
      addBookMutation,
      createWishlistMutation,
    });
  });

  it("renders modal", () => {
    render(
      <WishlistModal
        isOpen
        onClose={vi.fn()}
        product={product}
        userId="user1"
      />
    );

    expect(
      screen.getAllByText("Add to Wishlist")[0]
    ).toBeInTheDocument();
  });

  it("renders wishlist dropdown", () => {
    render(
      <WishlistModal
        isOpen
        onClose={vi.fn()}
        product={product}
        userId="user1"
      />
    );

    expect(
      screen.getByRole("combobox")
    ).toBeInTheDocument();
  });

  it("opens create wishlist screen", async () => {
    const user = userEvent.setup();

    render(
      <WishlistModal
        isOpen
        onClose={vi.fn()}
        product={product}
        userId="user1"
      />
    );

    await user.click(
      screen.getByText("+ Create New Wishlist")
    );

    expect(
      screen.getByText("Wishlist Name")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /create & add/i,
      })
    ).toBeInTheDocument();
  });

  it("returns to existing wishlist screen", async () => {
    const user = userEvent.setup();

    render(
      <WishlistModal
        isOpen
        onClose={vi.fn()}
        product={product}
        userId="user1"
      />
    );

    await user.click(
      screen.getByText("+ Create New Wishlist")
    );

    await user.click(
      screen.getByText(/add to existing/i)
    );

    expect(
      screen.getAllByText("Add to Wishlist")[0]
    ).toBeInTheDocument();
  });

  it("creates wishlist and adds book", async () => {
    const user = userEvent.setup();

    createWishlistMutation.mutateAsync.mockResolvedValue({
      data: {
        _id: "wishlist3",
      },
    });

    addBookMutation.mutateAsync.mockResolvedValue({});

    const onClose = vi.fn();

    render(
      <WishlistModal
        isOpen
        onClose={onClose}
        product={product}
        userId="user1"
      />
    );

    await user.click(
      screen.getByText("+ Create New Wishlist")
    );

    const input = screen.getByPlaceholderText(
      "Enter wishlist name"
    );

    await user.type(input, "My Books");

    await user.click(
      screen.getByRole("button", {
        name: /create & add/i,
      })
    );

    expect(
      createWishlistMutation.mutateAsync
    ).toHaveBeenCalledWith({
      name: "My Books",
    });

    expect(
      addBookMutation.mutateAsync
    ).toHaveBeenCalledWith({
      wishlistId: "wishlist3",
      bookId: "1",
    });

    expect(onClose).toHaveBeenCalled();

    expect(showToast).toHaveBeenCalled();
  });

  it("adds book to existing wishlist", async () => {
    const user = userEvent.setup();

    addBookMutation.mutateAsync.mockResolvedValue({});

    const onClose = vi.fn();

    render(
      <WishlistModal
        isOpen
        onClose={onClose}
        product={product}
        userId="user1"
      />
    );

    await user.selectOptions(
      screen.getByRole("combobox"),
      "wishlist1"
    );

    await user.click(
      screen.getByRole("button", {
        name: /add to wishlist/i,
      })
    );

    expect(
      addBookMutation.mutateAsync
    ).toHaveBeenCalledWith({
      wishlistId: "wishlist1",
      bookId: "1",
    });

    expect(onClose).toHaveBeenCalled();

    expect(showToast).toHaveBeenCalled();
  });

  it("Create & Add button is disabled when wishlist name is empty", async () => {
    const user = userEvent.setup();

    render(
      <WishlistModal
        isOpen
        onClose={vi.fn()}
        product={product}
        userId="user1"
      />
    );

    await user.click(
      screen.getByText("+ Create New Wishlist")
    );

    expect(
      screen.getByRole("button", {
        name: /create & add/i,
      })
    ).toBeDisabled();
  });

  it("resets form when modal is closed", async () => {
    const user = userEvent.setup();

    const { rerender } = render(
      <WishlistModal
        isOpen
        onClose={vi.fn()}
        product={product}
        userId="user1"
      />
    );

    await user.click(
      screen.getByText("+ Create New Wishlist")
    );

    await user.type(
      screen.getByPlaceholderText("Enter wishlist name"),
      "Books"
    );

    rerender(
      <WishlistModal
        isOpen={false}
        onClose={vi.fn()}
        product={product}
        userId="user1"
      />
    );

    rerender(
      <WishlistModal
        isOpen
        onClose={vi.fn()}
        product={product}
        userId="user1"
      />
    );

    expect(
      screen.queryByDisplayValue("Books")
    ).not.toBeInTheDocument();
  });

  it("shows error toast when adding to existing wishlist fails", async () => {
    const user = userEvent.setup();

    addBookMutation.mutateAsync.mockRejectedValue(
      new Error("Failed to add")
    );

    render(
      <WishlistModal
        isOpen
        onClose={vi.fn()}
        product={product}
        userId="user1"
      />
    );

    await user.selectOptions(
      screen.getByRole("combobox"),
      "wishlist1"
    );

    await user.click(
      screen.getByRole("button", {
        name: /add to wishlist/i,
      })
    );

    expect(showToast).toHaveBeenCalledWith(
      "Failed to add",
      "error"
    );
  });

  it("shows error toast when creating wishlist fails", async () => {
    const user = userEvent.setup();

    createWishlistMutation.mutateAsync.mockRejectedValue(
      new Error("Create failed")
    );

    render(
      <WishlistModal
        isOpen
        onClose={vi.fn()}
        product={product}
        userId="user1"
      />
    );

    await user.click(
      screen.getByText("+ Create New Wishlist")
    );

    await user.type(
      screen.getByPlaceholderText("Enter wishlist name"),
      "Books"
    );

    await user.click(
      screen.getByRole("button", {
        name: /create & add/i,
      })
    );

    expect(showToast).toHaveBeenCalledWith(
      "Create failed",
      "error"
    );
  });

  it("opens create wishlist screen when no wishlists exist", () => {
    (useWishlistNames as ReturnType<typeof vi.fn>).mockReturnValue({
      data: {
        data: [],
      },
    });

    render(
      <WishlistModal
        isOpen
        onClose={vi.fn()}
        product={product}
        userId="user1"
      />
    );

    expect(
      screen.getByText("Create New Wishlist")
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Enter wishlist name")
    ).toBeInTheDocument();
  });
  
});