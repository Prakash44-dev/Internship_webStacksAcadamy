const normalizeSentiment = (sentiment) => {
  const normalized = String(sentiment || "neutral").trim().toLowerCase();

  if (normalized === "positive") return "Positive";
  if (normalized === "negative") return "Negative";
  return "Neutral";
};

exports.analyzeReviewsWithAI = async (reviews) => {
  try {
    const reviewTexts = reviews
      .map((review) => review.Comment || review.comment || review.reviewText || "")
      .filter(Boolean)
      .join("\n---\n");

    if (!reviewTexts) {
      return {
        sentiment: "Neutral",
        summaryBullets: ["Not enough review text available yet."],
        topMentions: [],
      };
    }

    const prompt = `
Analyze these restaurant reviews and return ONLY valid JSON.
No markdown.
No explanation text.

Return exactly this format:
{
  "sentiment": "positive",
  "summaryBullets": ["point 1", "point 2", "point 3"],
  "topMentions": ["keyword1", "keyword2", "keyword3"]
}

Rules:
- sentiment must be one of positive, negative, neutral
- summaryBullets should be short, helpful, and based only on the reviews
- topMentions should contain up to 3 short keywords or phrases

Reviews:
${reviewTexts}
`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
          max_tokens: 250,
        }),
      },
    );

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(
        responseData?.error?.message || "Failed to analyze restaurant reviews",
      );
    }

    const content = responseData?.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("AI service returned an empty response");
    }

    const normalizedContent = content
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();

    const parsed = JSON.parse(normalizedContent);

    return {
      sentiment: normalizeSentiment(parsed.sentiment),
      summaryBullets: Array.isArray(parsed.summaryBullets)
        ? parsed.summaryBullets.filter(Boolean).slice(0, 4)
        : [],
      topMentions: Array.isArray(parsed.topMentions)
        ? parsed.topMentions.filter(Boolean).slice(0, 3)
        : [],
    };
  } catch (error) {
    throw new Error("Failed to analyze reviews");
  }
};
