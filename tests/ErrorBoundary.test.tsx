import React from "react";
import { render, screen } from "@testing-library/react";
import ErrorBoundary from "../src/components/ErrorBoundary";

function Bomb() {
  throw new Error("boom");
}

test("ErrorBoundary catches errors and shows fallback", () => {
  const consoleError = console.error;
  console.error = () => {};
  render(
    <ErrorBoundary>
      <Bomb />
    </ErrorBoundary>
  );
  expect(screen.getByRole("alert")).toBeInTheDocument();
  console.error = consoleError;
});
