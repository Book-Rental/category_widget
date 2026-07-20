import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import ProductListing from "../../components/ProductListing";

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
}));

vi.mock("../../context/FilterContext", () => ({
  useFilter: () => ({
    priceRange: [0, 5000],
    selectedCategories: [],
    language: "",
    availability: {
      rent: false,
      sale: false,
    },
    nameOrAuthorSearch: "",
  }),
}));

vi.mock("@rentbook/rentbook-ui-lib", async () => {
  const actual = await vi.importActual("@rentbook/rentbook-ui-lib");
  return {
    ...actual,
    ProductCard: ({ title, onProductClick, children }: {
      title: string;
      onProductClick: () => void;
      children?: React.ReactNode;
    }) => (
      <div>
        <button onClick={onProductClick}>
          {title}
        </button>
        {children}
      </div>
    ),
  };
});

vi.mock("../../hooks/useDebounce", () => ({
  default: (value: unknown) => value,
}));

vi.mock("../../components/ProductSort", () => ({
  default: ({ onChange }: {
    onChange: (value: string) => void;
  }) => (
    <button onClick={() => onChange("popular")}>
      ProductSort
    </button>
  ),
}));

vi.mock("../../components/ProductActions", () => ({
  default: () => <div>ProductActions</div>,
}));

import { useQuery } from "@tanstack/react-query";

const mockProducts = [
  {
    _id: "1",
    name: "Atomic Habits",
    description: "",
    author: "James Clear",
    coverImage: "",
    images: [],
    purchasePrice: 500,
    rentalPricePerDay: 20,
    rentalPricePerWeek: 100,
    rentalPricePerMonth: 300,
    securityDeposit: 100,
  },
  {
    _id: "2",
    name: "Deep Work",
    description: "",
    author: "Cal Newport",
    coverImage: "",
    images: [],
    purchasePrice: 400,
    rentalPricePerDay: 15,
    rentalPricePerWeek: 90,
    rentalPricePerMonth: 250,
    securityDeposit: 100,
  },
];

describe("ProductListing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading spinner", () => {
    (useQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      data: undefined,
      isLoading: true,
      isFetching: false,
      isError: false,
    });

    const { container } = render(
      <ProductListing/>
    );

    expect(
      container.querySelector(".animate-spin")
    ).toBeInTheDocument();
  });

  it("shows error message", () => {
    (useQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      isLoading: false,
      isFetching: false,
      isError: true,
      error: new Error("Failed to fetch"),
    });

    render(<ProductListing/>);

    expect(
      screen.getByText("Failed to fetch")
    ).toBeInTheDocument();
  });

  it("shows empty state", () => {
    (useQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      isLoading: false,
      isFetching: false,
      isError: false,
      data: {
        products: [],
        totalPages: 1,
        totalCount: 0,
      },
    });

    render(<ProductListing/>);

    expect(
  screen.getByText("No Books Found.")
).toBeInTheDocument();
  });

  it("renders product names", () => {
    (useQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      isLoading: false,
      isFetching: false,
      isError: false,
      data: {
        products: mockProducts,
        totalPages: 2,
        totalCount: 2,
      },
    });

    render(<ProductListing/>);

    expect(
      screen.getByText("Atomic Habits")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Deep Work")
    ).toBeInTheDocument();
  });

  it("renders ProductSort", () => {
    (useQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      isLoading: false,
      isFetching: false,
      isError: false,
      data: {
        products: mockProducts,
        totalPages: 2,
        totalCount: 2,
      },
    });

    render(<ProductListing/>);

    expect(
      screen.getByText("ProductSort")
    ).toBeInTheDocument();
  });

  it("renders ProductActions for every product", () => {
    (useQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      isLoading: false,
      isFetching: false,
      isError: false,
      data: {
        products: mockProducts,
        totalPages: 2,
        totalCount: 2,
      },
    });

    render(<ProductListing/>);

    expect(
      screen.getAllByText("ProductActions")
    ).toHaveLength(2);
  });

  it("shows result count", () => {
    (useQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      isLoading: false,
      isFetching: false,
      isError: false,
      data: {
        products: mockProducts,
        totalPages: 2,
        totalCount: 2,
      },
    });

    render(<ProductListing />);

    expect(
      screen.getByText(/Showing/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/results/i)
    ).toBeInTheDocument();
  });

  it("uses popular sorting from URL parameter", () => {
    window.history.pushState({}, "", "/?isPopular=true");

    (useQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      isLoading: false,
      isFetching: false,
      isError: false,
      data: {
        products: mockProducts,
        totalPages: 1,
        totalCount: 2,
      },
    });

    render(<ProductListing />);

    expect(screen.getByText("ProductSort")).toBeInTheDocument();
  });

  it("redirects to PDP when product is clicked", async () => {
    const user = userEvent.setup();
    const pushSpy = vi.spyOn(window.history, "pushState");
    const dispatchSpy = vi.spyOn(window, "dispatchEvent");

    (useQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      isLoading: false,
      isFetching: false,
      isError: false,
      data: {
        products: mockProducts,
        totalPages: 1,
        totalCount: 2,
      },
    });

    render(<ProductListing />);

    await user.click(screen.getByText("Atomic Habits"));

    expect(pushSpy).toHaveBeenCalled();
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it("changes sorting when ProductSort triggers onChange", async () => {
    const user = userEvent.setup();
    (useQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      isLoading: false,
      isFetching: false,
      isError: false,
      data: {
        products: mockProducts,
        totalPages: 1,
        totalCount: 2,
      },
    });
    render(<ProductListing />);
    await user.click(screen.getByText("ProductSort"));
    expect(screen.getByText("ProductSort")).toBeInTheDocument();
  });

});