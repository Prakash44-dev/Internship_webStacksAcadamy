exports.generateDishDescription = async ({
  name,
  category,
  spiceLevel,
  price,
}) => {
  const resolvedSpiceLevel = spiceLevel || "medium";
  const prompt = `
You are a professional food classification assistant.

Generate ONLY valid JSON.
No markdown.
No explanation text.

IMPORTANT RULES:
- Tags must be accurate restaurant-style tags
- Do NOT misclassify dishes
- Do NOT label main courses as desserts
- Allergens must be realistic
- Serves must be realistic (1 or 2)
- bestFor must be meal timings only

Dish Name: ${name}
Category: ${category}
Spice Level: ${resolvedSpiceLevel}
Base Price: ${price}

Return JSON in this EXACT format:
{
  "description": "string",
  "tags": ["string"],
  "allergens": ["string"],
  "serves": "string",
  "bestFor": ["string"]
}
`;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
      max_tokens: 300,
    }),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(
      responseData?.error?.message || "Failed to generate AI description",
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
    description: parsed.description || "",
    tags: Array.isArray(parsed.tags) ? parsed.tags : [],
    allergens: Array.isArray(parsed.allergens) ? parsed.allergens : [],
    serves: parsed.serves || "",
    bestFor: Array.isArray(parsed.bestFor) ? parsed.bestFor : [],
  };
};
