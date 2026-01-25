import { generateWithFallback } from "@/services/ai/providerSwitcher";
import { GroqProvider } from "@/services/ai/providers/groqProvider";
import { NvidiaProvider } from "@/services/ai/providers/nvidiaProvider";
import { OpenRouterProvider } from "@/services/ai/providers/openRouterProvider";

// Mock the provider classes
jest.mock("@/services/ai/providers/groqProvider");
jest.mock("@/services/ai/providers/nvidiaProvider");
jest.mock("@/services/ai/providers/openRouterProvider");

describe("Provider Switcher", () => {
    let mockGroqGenerate, mockNvidiaGenerate, mockOpenRouterGenerate;

    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();

        // Setup mock implementations
        mockGroqGenerate = jest.fn();
        mockNvidiaGenerate = jest.fn();
        mockOpenRouterGenerate = jest.fn();

        GroqProvider.mockImplementation(() => {
            return {
                name: 'groq',
                generate: mockGroqGenerate
            };
        });
        NvidiaProvider.mockImplementation(() => {
            return {
                name: 'nvidia',
                generate: mockNvidiaGenerate
            };
        });
        OpenRouterProvider.mockImplementation(() => {
            return {
                name: 'openrouter',
                generate: mockOpenRouterGenerate
            };
        });
    });

    it("should return result from the first provider if it succeeds", async () => {
        mockGroqGenerate.mockResolvedValue("Success from Groq");

        const result = await generateWithFallback("test prompt");

        expect(result).toBe("Success from Groq");
        expect(mockGroqGenerate).toHaveBeenCalledWith("test prompt");
        expect(mockNvidiaGenerate).not.toHaveBeenCalled();
        expect(mockOpenRouterGenerate).not.toHaveBeenCalled();
    });

    it("should fall back to the second provider if the first fails", async () => {
        mockGroqGenerate.mockRejectedValue(new Error("Groq failed"));
        mockNvidiaGenerate.mockResolvedValue("Success from Nvidia");

        const result = await generateWithFallback("test prompt");

        expect(result).toBe("Success from Nvidia");
        expect(mockGroqGenerate).toHaveBeenCalled();
        expect(mockNvidiaGenerate).toHaveBeenCalledWith("test prompt");
        expect(mockOpenRouterGenerate).not.toHaveBeenCalled();
    });

    it("should fall back to the third provider if the first two fail", async () => {
        mockGroqGenerate.mockRejectedValue(new Error("Groq failed"));
        mockNvidiaGenerate.mockRejectedValue(new Error("Nvidia failed"));
        mockOpenRouterGenerate.mockResolvedValue("Success from OpenRouter");

        const result = await generateWithFallback("test prompt");

        expect(result).toBe("Success from OpenRouter");
        expect(mockGroqGenerate).toHaveBeenCalled();
        expect(mockNvidiaGenerate).toHaveBeenCalled();
        expect(mockOpenRouterGenerate).toHaveBeenCalledWith("test prompt");
    });

    it("should throw an error if all providers fail", async () => {
        mockGroqGenerate.mockRejectedValue(new Error("Groq failed"));
        mockNvidiaGenerate.mockRejectedValue(new Error("Nvidia failed"));
        mockOpenRouterGenerate.mockRejectedValue(new Error("OpenRouter failed"));

        await expect(generateWithFallback("test prompt")).rejects.toThrow("All AI providers failed");

        expect(mockGroqGenerate).toHaveBeenCalled();
        expect(mockNvidiaGenerate).toHaveBeenCalled();
        expect(mockOpenRouterGenerate).toHaveBeenCalled();
    });
    
    it("should skip providers returning empty response", async () => {
        mockGroqGenerate.mockResolvedValue(""); // Empty response
        mockNvidiaGenerate.mockResolvedValue("Success from Nvidia");
        
        const result = await generateWithFallback("test prompt");
        
        expect(result).toBe("Success from Nvidia");
        expect(mockGroqGenerate).toHaveBeenCalled();
        expect(mockNvidiaGenerate).toHaveBeenCalled();
    });
});
