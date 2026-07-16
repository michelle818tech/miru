export async function POST(req: Request) {
  try {
    const { products, actions } = await req.json();

    if (!products || !actions) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    // Simple quality check without Claude
    const text = `${products} ${actions}`;
    const issues = [];

    if (!/anua|purito|black rouge|cosrx|benton/i.test(text)) {
      issues.push("No specific product names");
    }
    if (!/\d+/.test(text)) {
      issues.push("No numbers or metrics");
    }
    if (text.length < 100) {
      issues.push("Too short");
    }

    const approved = issues.length === 0;
    const feedback = approved ? "APPROVED" : `Issues: ${issues.join(", ")}`;

    return Response.json({ approved, feedback });
  } catch (error) {
    return Response.json({ error: "Assessment failed" }, { status: 500 });
  }
}
