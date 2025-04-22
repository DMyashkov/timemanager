import { useState } from "react";

interface UseChatGPTReturn {
  sendMessage: (message: string, systemPrompt?: string) => Promise<string>;
  isLoading: boolean;
  error: Error | null;
}

// Flag to control mock response usage
const USE_MOCK_RESPONSE = false;

// Flag to control constant response usage
const USE_CONSTANT_RESPONSE = false;

// Mock response for development
const MOCK_RESPONSE = {
  tasks: [
    {
      title: "Review project documentation",
      description: "Go through the latest updates",
      priority: "medium",
    },
    {
      title: "Team standup meeting",
      description: "Daily sync with the team",
      priority: "high",
    },
  ],
  tags: [
    {
      title: "Work",
      colorPreset: "green",
    },
    {
      title: "Project X",
      colorPreset: "blue",
    },
  ],
  focusTags: [19827382],
};

// Constant response from ChatGPT
const CONSTANT_RESPONSE = {
  id: "chatcmpl-BP2NveybQFJ68jErYlIa12M06R3k4",
  object: "chat.completion",
  created: 1745307067,
  model: "gpt-3.5-turbo-0125",
  choices: [
    {
      index: 0,
      message: {
        role: "assistant",
        content:
          '{\n  "tasks": [\n    {\n      "title": "Call Mom",\n      "description": "Call my mom tomorrow.",\n      "priority": "medium"\n    }\n  ],\n  "tags": [],\n  "focusTags": []\n}',
        refusal: null,
        annotations: [],
      },
      logprobs: null,
      finish_reason: "stop",
    },
  ],
  usage: {
    prompt_tokens: 172,
    completion_tokens: 50,
    total_tokens: 222,
    prompt_tokens_details: {
      cached_tokens: 0,
      audio_tokens: 0,
    },
    completion_tokens_details: {
      reasoning_tokens: 0,
      audio_tokens: 0,
      accepted_prediction_tokens: 0,
      rejected_prediction_tokens: 0,
    },
  },
  service_tier: "default",
  system_fingerprint: null,
};

export function useChatGPT(): UseChatGPTReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sendMessage = async (
    message: string,
    systemPrompt?: string,
  ): Promise<string> => {
    setIsLoading(true);
    setError(null);

    const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
    if (!apiKey) {
      const error = new Error("OpenAI API key is not configured");
      setError(error);
      setIsLoading(false);
      throw error;
    }

    try {
      console.log("Sending message to ChatGPT:", { message, systemPrompt });

      // Use mock response only when explicitly enabled
      if (USE_MOCK_RESPONSE) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return JSON.stringify(MOCK_RESPONSE);
      }

      // Use constant response when enabled
      if (USE_CONSTANT_RESPONSE) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return CONSTANT_RESPONSE.choices[0].message.content;
      }

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo-0125",
            messages: [
              ...(systemPrompt
                ? [{ role: "system", content: systemPrompt }]
                : []),
              { role: "user", content: message },
            ],
            temperature: 0.7,
            max_tokens: 150,
          }),
        },
      );

      const responseText = await response.text();
      console.log("Raw API response:", responseText);

      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse error response:", e);
      }

      if (!response.ok) {
        console.error("ChatGPT API error:", {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
          rawResponse: responseText,
        });

        const errorMessage =
          errorData?.error?.message || response.statusText || "Unknown error";
        throw new Error(`Failed to get response from ChatGPT: ${errorMessage}`);
      }

      const data = JSON.parse(responseText);
      console.log("Received response from ChatGPT:", data);
      return data.choices[0].message.content;
    } catch (err) {
      console.error("Error in ChatGPT API call:", {
        error: err,
        message: err instanceof Error ? err.message : "Unknown error",
        stack: err instanceof Error ? err.stack : undefined,
      });
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendMessage,
    isLoading,
    error,
  };
}

