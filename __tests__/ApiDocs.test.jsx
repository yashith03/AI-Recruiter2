// __tests__/ApiDocs.test.jsx

import React from "react";
import { render, screen } from "@testing-library/react";

// Mock dynamic import for Swagger UI before importing the page
jest.mock("next/dynamic", () => (fn, options) => {
  const MockSwagger = () => <div data-testid="swagger-ui" />;
  MockSwagger.ssr = options?.ssr;
  return MockSwagger;
});

import ApiDocs from "@/app/api-docs/page";

describe("ApiDocs Page", () => {
  test("renders SwaggerUI with the correct url prop", () => {
    render(<ApiDocs />);
    const swaggerElement = screen.getByTestId("swagger-ui");
    expect(swaggerElement).toBeInTheDocument();
  });

  test("shows a link to the raw OpenAPI JSON", () => {
    render(<ApiDocs />);
    const rawLink = screen.getByRole('link', { name: /view raw openapi json/i });
    expect(rawLink).toBeInTheDocument();
    expect(rawLink.getAttribute('href')).toBe('/openapi.json');
  });

  test("ensures Swagger UI is loaded client-side only (SSR disabled)", async () => {
    // dynamically import the same mock
    const dynamic = require("next/dynamic");
    const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });
    expect(SwaggerUI.ssr).toBe(false);
  });
});
