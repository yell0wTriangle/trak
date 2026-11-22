import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/components/AuthProvider";
import { DemoBar } from "@/components/DemoBar";
import { mockStore } from "@/lib/mock/mock-store";
import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/lib/supabase/client", () => ({
  createClient: vi.fn(() => ({
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
    },
  })),
}));

vi.mock("@/lib/notify", () => ({
  notify: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("@/lib/hooks/useMediaQuery", () => ({
  useMediaQuery: vi.fn(() => true),
}));

function renderDemoBar() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DemoBar />
      </AuthProvider>
    </QueryClientProvider>,
  );
}

describe("DemoBar", () => {
  beforeEach(() => {
    localStorage.clear();
    mockStore.clearData();
    Object.defineProperty(navigator, "onLine", {
      value: true,
      configurable: true,
    });
  });

  it("renders nothing outside guest mode", async () => {
    mockStore.reset();
    renderDemoBar();

    await waitFor(() =>
      expect(screen.queryByText(/sample/i)).not.toBeInTheDocument(),
    );
  });

  it("does not show Start fresh after guest data is cleared", async () => {
    localStorage.setItem("kanso_guest_mode", "true");
    mockStore.clearData();
    renderDemoBar();

    await waitFor(() =>
      expect(
        screen.queryByRole("button", { name: /start fresh/i }),
      ).not.toBeInTheDocument(),
    );
  });

  it("shows Start fresh while sample data is loaded", async () => {
    localStorage.setItem("kanso_guest_mode", "true");
    mockStore.reset();
    renderDemoBar();

    expect(
      await screen.findByRole("button", { name: /start fresh/i }),
    ).toBeInTheDocument();
  });

  it("renders guest sample text with whitespace-nowrap to preserve mobile padding", async () => {
    localStorage.setItem("kanso_guest_mode", "true");
    mockStore.reset();
    renderDemoBar();

    const mobileText = await screen.findByText("Guest sample");
    const desktopText = screen.getByText("Guest sample data");

    expect(mobileText).toHaveClass("sm:hidden");
    expect(desktopText).toHaveClass("hidden", "sm:inline");
    expect(mobileText.parentElement).toHaveClass("whitespace-nowrap");
  });

  it("is a pill centred in the content column on desktop, like OfflineIndicator", async () => {
    localStorage.setItem("kanso_guest_mode", "true");
    mockStore.reset();
    renderDemoBar();

    const wrapper = await screen.findByTestId("demo-bar");
    const card = wrapper.firstElementChild as HTMLElement;

    expect(wrapper.className).toContain("md:absolute");
    expect(wrapper.className).toContain("md:top-auto");
    expect(wrapper.className).toContain("md:bottom-6");
    expect(card.className).toContain("md:w-auto");
    expect(card.className).toContain("md:rounded-lg");
  });

  it("hides while offline", async () => {
    localStorage.setItem("kanso_guest_mode", "true");
    mockStore.reset();
    Object.defineProperty(navigator, "onLine", {
      value: false,
      configurable: true,
    });
    renderDemoBar();

    await waitFor(() =>
      expect(screen.queryByText(/start fresh/i)).not.toBeInTheDocument(),
    );
  });

  it("prompts before clearing guest data", async () => {
    localStorage.setItem("kanso_guest_mode", "true");
    mockStore.reset();
    renderDemoBar();

    fireEvent.click(await screen.findByRole("button", { name: /start fresh/i }));
    fireEvent.change(screen.getByPlaceholderText(/type 'delete'/i), {
      target: { value: "delete" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /delete account data/i }),
    );
    await waitFor(() => expect(mockStore.getTasks()).toEqual([]));
    expect(localStorage.getItem("kanso_guest_data_v11")).toBeNull();
    expect(
      screen.queryByRole("button", { name: /reload sample/i }),
    ).not.toBeInTheDocument();
  });
});
