import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from "@tanstack/react-query";

import ProductActions from "../../components/ProductActions";
import type { Product } from "../../types/product";

type WishlistModalMockProps = {
  isOpen: boolean;
  userId: string;
  onClose: () => void;
};

vi.mock("../../services/cartService", () => ({
  addToCart: vi.fn(),
}));

vi.mock("../../utils/toast", () => ({
  showToast: vi.fn(),
}));

vi.mock("../../components/AddToCartModal", () => ({
  default: ({
    isOpen,
    onProceed,
    onClose,
  }: {
    isOpen: boolean;
    onProceed: (payload: {
      bookId: string;
      quantity: number;
      pricingMode: "rent";
      rentalPeriod: "day" | "week" | "month";
    }) => Promise<void>;
    onClose: () => void;
  }) => {
    if (!isOpen) return null;

    return (
      <div>
        <p>AddToCartModal</p>

        <button
          onClick={async () => {
            await onProceed({
              bookId: "book1",
              quantity: 1,
              pricingMode: "rent",
              rentalPeriod: "week",
            });

            onClose();
          }}
        >
          Confirm Add
        </button>
      </div>
    );
  },
}));

vi.mock("../../components/WishlistModal", () => ({
  default: ({
    isOpen,
    userId,
    onClose,
  }: WishlistModalMockProps) =>
    isOpen ? (
      <div>
        <p>WishlistModal {userId}</p>

        <button onClick={onClose}>
          Close Wishlist
        </button>
      </div>
    ) : null,
}));

import { addToCart } from "../../services/cartService";
import { showToast } from "../../utils/toast";

// const mutateMock = vi.fn();

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual<
    typeof import("@tanstack/react-query")
  >("@tanstack/react-query");

  return {
    ...actual,

    useMutation: vi.fn(),

    useQueryClient: () => ({
      invalidateQueries: vi.fn(),
    }),
  };
});

const product: Product = {
  _id: "book1",
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

const renderComponent = () => {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={client}>
      <ProductActions
        product={product}
      />
    </QueryClientProvider>
  );
};

describe("ProductActions", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    window.HOST_USER_INFO = {
      _id: "user1",
    };

    window.HOST_WISHLISTS = {};

    (useMutation as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      ({ mutationFn, onSuccess, onError }) => ({
        isPending: false,
        mutate: async () => {
          try {
            const result = await mutationFn();
            onSuccess?.(result);
          } catch (err) {
            onError?.(err);
          }
        },
      })
    );

    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders Add to Cart button", () => {
    renderComponent();

    expect(
      screen.getByRole("button", {
        name: /add to cart/i,
      })
    ).toBeInTheDocument();
  });

  it("renders wishlist icon", () => {
    renderComponent();

    expect(screen.getAllByRole("button").length).toBeGreaterThan(1);
  });

  it("opens AddToCart modal", async () => {
    const user = userEvent.setup();

    renderComponent();

    await user.click(
      screen.getByRole("button", {
        name: /add to cart/i,
      })
    );

    expect(screen.getByText("AddToCartModal")).toBeInTheDocument();
  });

  it("opens Wishlist modal", async () => {
    const user = userEvent.setup();

    renderComponent();

    const buttons = screen.getAllByRole("button");

    await user.click(buttons[1]);

    expect(screen.getByText("WishlistModal user1")).toBeInTheDocument();
  });

  it("does not render actions when user is not logged in", () => {
    window.HOST_USER_INFO = null;

    renderComponent();

    expect(
      screen.queryByRole("button", {
        name: /add to cart/i,
      })
    ).not.toBeInTheDocument();
  });

  it("shows success toast after adding to cart", async () => {
    const user = userEvent.setup();

    (addToCart as ReturnType<typeof vi.fn>).mockResolvedValue({});

    renderComponent();

    await user.click(
      screen.getByRole("button", {
        name: /add to cart/i,
      })
    );

    await user.click(
      screen.getByRole("button", {
        name: /confirm add/i,
      })
    );

    await waitFor(() => {
      expect(addToCart).toHaveBeenCalledWith({
        bookId: "book1",
        quantity: 1,
        pricingMode: "rent",
        rentalPeriod: "week",
      });
    });

    expect(showToast).toHaveBeenCalledWith(
      "Book added to rental cart.",
      "success"
    );

    expect(
      screen.getByRole("button", {
        name: /go to cart/i,
      })
    ).toBeInTheDocument();
  });

  it("shows error toast when add to cart fails", async () => {
    const user = userEvent.setup();

    (addToCart as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("Failed to add")
    );

    renderComponent();

    await user.click(
      screen.getByRole("button", {
        name: /add to cart/i,
      })
    );

    await user.click(
      screen.getByRole("button", {
        name: /confirm add/i,
      })
    );

    await waitFor(() => {
      expect(showToast).toHaveBeenCalledWith(
        "Failed to add",
        "error"
      );
    });
  });

  it("opens remove confirmation modal for wishlisted book", async () => {
    const user = userEvent.setup();

    window.HOST_WISHLISTS = {
      wishlist1: ["book1"],
    };

    renderComponent();

    const wishlistButton = screen.getAllByRole("button")[1];

    await user.click(wishlistButton);

    expect(
      screen.getByText(/remove book/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /are you sure you want to remove this book from your wishlist/i
      )
    ).toBeInTheDocument();
  });

  it("closes remove confirmation modal when Cancel is clicked", async () => {
    const user = userEvent.setup();

    window.HOST_WISHLISTS = {
      wishlist1: ["book1"],
    };

    renderComponent();

    await user.click(screen.getAllByRole("button")[1]);

    await user.click(
      screen.getByRole("button", {
        name: /cancel/i,
      })
    );

    expect(
      screen.queryByText(/remove book/i)
    ).not.toBeInTheDocument();
  });

  it("updates wishlist when wishlist-state-changed event is dispatched", async () => {
    const user = userEvent.setup();

    renderComponent();

    window.dispatchEvent(
      new CustomEvent("wishlist-state-changed", {
        detail: {
          wishlist1: ["book1"],
        },
      })
    );

    await user.click(screen.getAllByRole("button")[1]);

    expect(screen.getByText(/remove book/i)).toBeInTheDocument();
  });

  it("opens wishlist modal when product is not present in any wishlist", async () => {
    const user = userEvent.setup();

    window.HOST_WISHLISTS = {
      wishlist1: ["another-book"],
    };

    renderComponent();

    await user.click(screen.getAllByRole("button")[1]);

    expect(screen.getByText("WishlistModal user1")).toBeInTheDocument();
  });

  it("removes book successfully", async () => {
    const user = userEvent.setup();

    window.HOST_WISHLISTS = {
      wishlist1: ["book1"],
    };

    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    renderComponent();

    // Open remove modal
    await user.click(screen.getAllByRole("button")[1]);

    // Click Remove
    await user.click(
      screen.getByRole("button", {
        name: /^remove$/i,
      })
    );

    await waitFor(() => {
      expect(showToast).toHaveBeenCalledWith(
        "Book removed from wishlist.",
        "success"
      );
    });

    expect(fetch).toHaveBeenCalled();
  });

  it("shows error toast when removing book fails", async () => {
    const user = userEvent.setup();

    window.HOST_WISHLISTS = {
      wishlist1: ["book1"],
    };

    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
    });

    renderComponent();

    await user.click(screen.getAllByRole("button")[1]);

    await user.click(
      screen.getByRole("button", {
        name: /^remove$/i,
      })
    );

    await waitFor(() => {
      expect(showToast).toHaveBeenCalledWith(
        "Failed to remove book.",
        "success"
      );
    });
  });

  it("does not reopen modal after book is already added", async () => {
    const user = userEvent.setup();

    (addToCart as ReturnType<typeof vi.fn>).mockResolvedValue({});

    renderComponent();

    await user.click(screen.getByRole("button", { name: /add to cart/i }));
    await user.click(screen.getByRole("button", { name: /confirm add/i }));

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /go to cart/i })
      ).toBeInTheDocument()
    );

    await user.click(
      screen.getByRole("button", { name: /go to cart/i })
    );

    expect(screen.queryByText("AddToCartModal")).not.toBeInTheDocument();
  });

  it("shows Removing state while wishlist deletion is pending", async () => {
    window.HOST_WISHLISTS = {
      wishlist1: ["book1"],
    };

    (useMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      mutate: vi.fn(),
      isPending: true,
    });

    renderComponent();

    const user = userEvent.setup();

    await user.click(screen.getAllByRole("button")[1]);

    expect(
      screen.getByRole("button", {
        name: /removing/i,
      })
    ).toBeDisabled();
  });

  it("closes remove modal using header close button", async () => {
    const user = userEvent.setup();

    window.HOST_WISHLISTS = {
      wishlist1: ["book1"],
    };

    renderComponent();

    await user.click(screen.getAllByRole("button")[1]);

    await user.click(
      screen.getByRole("button", {
        name: /close modal/i,
      })
    );

    expect(
      screen.queryByText(/remove book/i)
    ).not.toBeInTheDocument();
  });

  it("closes wishlist modal", async () => {
    const user = userEvent.setup();

    renderComponent();

    await user.click(screen.getAllByRole("button")[1]);

    expect(
      screen.getByText("WishlistModal user1")
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: /close wishlist/i,
      })
    );

    expect(
      screen.queryByText("WishlistModal user1")
    ).not.toBeInTheDocument();
  });

  it.skip("closes remove modal on Escape key", async () => {
    const user = userEvent.setup();

    window.HOST_WISHLISTS = {
      wishlist1: ["book1"],
    };

    renderComponent();

    await user.click(screen.getAllByRole("button")[1]);

    const dialog = screen.getByRole("dialog");

    dialog.focus();

    await user.keyboard("{Escape}");

    expect(
      screen.queryByText(/remove book/i)
    ).not.toBeInTheDocument();
  });

});

// 32-34,60,87-119,139,169-172,195-205           87-119,139,169-172,195-205   139,169-172,205 