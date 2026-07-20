import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
} from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Facet from "../../components/Facet";
import { FilterProvider } from "../../context/FilterContext";

const renderFacet = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <FilterProvider>
        <Facet />
      </FilterProvider>
    </QueryClientProvider>
  );
};

describe("Facet", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    vi.spyOn(window, "dispatchEvent");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders filter headings", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [],
      }),
    });

    renderFacet();

    expect(screen.getByText("Filters")).toBeInTheDocument();
    expect(screen.getByText("Categories")).toBeInTheDocument();
    expect(screen.getByText("Language")).toBeInTheDocument();
    expect(
      screen.getByText("Author / Book Name")
    ).toBeInTheDocument();
    expect(screen.getByText("Price Range")).toBeInTheDocument();
    expect(screen.getByText("Availability")).toBeInTheDocument();
  });

  it("loads categories from API", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [
          {
            _id: "1",
            name: "Novel",
          },
          {
            _id: "2",
            name: "Science",
          },
        ],
      }),
    });

    renderFacet();

    expect(await screen.findByText("Novel")).toBeInTheDocument();
    expect(screen.getByText("Science")).toBeInTheDocument();
  });

  it("shows error message when category API fails", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
    });

    renderFacet();

    expect(
      await screen.findByText("Failed to load categories.")
    ).toBeInTheDocument();
  });

  it("allows searching by author or book name", async () => {
    const user = userEvent.setup();

    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [],
      }),
    });

    renderFacet();

    const input = screen.getByPlaceholderText(
      "Search for Author or Book Name"
    );

    await user.type(input, "Harry Potter");

    expect(input).toHaveValue("Harry Potter");
  });

  it("allows selecting language", async () => {
    const user = userEvent.setup();

    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [],
      }),
    });

    renderFacet();

    const dropdown = screen.getByRole("combobox");

    await user.selectOptions(dropdown, "English");

    expect(dropdown).toHaveValue("English");
  });

  it("allows selecting category", async () => {
    const user = userEvent.setup();

    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [
          {
            _id: "1",
            name: "Novel",
          },
        ],
      }),
    });

    renderFacet();

    await screen.findByText("Novel");

    const checkboxes = screen.getAllByRole("checkbox");

    await user.click(checkboxes[0]);

    expect(checkboxes[0]).toBeChecked();
  });

  it("dispatches loading event", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [],
      }),
    });

    renderFacet();

    await waitFor(() => {
      expect(window.dispatchEvent).toHaveBeenCalled();
    });
  });

  it("renders availability checkboxes", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [],
      }),
    });

    renderFacet();

    const checkboxes = screen.getAllByRole("checkbox");

    expect(checkboxes).toHaveLength(1);
  });

  it("renders Clear all button", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [],
      }),
    });

    renderFacet();

    expect(screen.getByText("Clear all")).toBeInTheDocument();
  });

  it("allows unselecting a category", async () => {
    const user = userEvent.setup();
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [
          {
            _id: "1",
            name: "Novel",
          },
        ],
      }),
    });

    renderFacet();
    await screen.findByText("Novel");
    const categoryCheckbox = screen.getAllByRole("checkbox")[0];
    await user.click(categoryCheckbox);
    expect(categoryCheckbox).toBeChecked();
    await user.click(categoryCheckbox);
    expect(categoryCheckbox).not.toBeChecked();
  });

  it("allows selecting Available for Rent", async () => {
    const user = userEvent.setup();
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [],
      }),
    });

    renderFacet();

    const checkboxes = screen.getAllByRole("checkbox");

    const rentCheckbox = checkboxes[checkboxes.length - 1];

    await user.click(rentCheckbox);

    expect(rentCheckbox).toBeChecked();

    await user.click(rentCheckbox);

    expect(rentCheckbox).not.toBeChecked();
  });

  it("uses empty array when API returns no data property", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({}), // no data property
    });

    renderFacet();

    await waitFor(() => {
      expect(screen.getByText("Categories")).toBeInTheDocument();
    });

    expect(screen.queryByText("Novel")).not.toBeInTheDocument();
  });

});