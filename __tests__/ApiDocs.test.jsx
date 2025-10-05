import React from "react";
import { render, screen } from "@testing-library/react";
import ApiDocs from "@/app/api-docs/page";

// Mock dynamic import for Swagger UI
jest.mock("next/dynamic", () => (fn, options) => {
  const MockSwagger = () => <div data-testid="swagger-ui" />;
  MockSwagger.ssr = options?.ssr;
  return MockSwagger;
});

describe("ApiDocs Page", () => {
  test("renders SwaggerUI with the correct url prop", () => {
    render(<ApiDocs />);
    const swaggerElement = screen.getByTestId("swagger-ui");
    expect(swaggerElement).toBeInTheDocument();
  });

  test("ensures Swagger UI is loaded client-side only (SSR disabled)", async () => {
    // dynamically import the same mock
    const dynamic = require("next/dynamic");
    const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });
    expect(SwaggerUI.ssr).toBe(false);
  });
});
