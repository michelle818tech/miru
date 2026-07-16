import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(req: Request) {
  try {
    const { products, actions } = await req.json();

    if (!products || !actions) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    const prompt = `You are a strict KPI quality assessment tool for Mirus Skincare managers.

Review this manager's weekly reflection. Check if the text has SPECIFICITY and ACTIONABILITY.

PRODUCTS FOCUS SECTION:
${products}

ACTIONS TAKEN SECTION:
${actions}

REQUIREMENTS for APPROVED:
✓ Specific product names (not just "products" or "items")
✓ Numbers/metrics (sales amounts, units, percentages)
✓ Dates or timeframes
✓ Concrete actions (not vague verbs like "worked" or "helped")
✓ At least 3 sentences per section

BLOCKS if:
✗ Generic phrases like "increased sales", "worked hard", "managed team"
✗ No product names
✗ No numbers
✗ No dates/timeframes
✗ Less than 3 sentences
✗ Vague explanations (e.g., "Gave content manager a list of slow-moving products")

Your response MUST be ONLY one of these:
- "APPROVED" (if meets all requirements)
- "REJECTED: [specific list of issues]" (if fails any requirement)

Be strict. Vague explanations should be rejected.`;

    const message = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 200,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const response =
      message.content[0].type === "text" ? message.content[0].text : "";
    const approved = response.includes("APPROVED");

    return Response.json({
      approved,
      feedback: response,
    });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: "Assessment failed" }, { status: 500 });
  }
}
