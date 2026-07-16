export async function POST(req: Request) {
  try {
    const {
      manager_email,
      week,
      year,
      sales_amount,
      transaction_count,
      avg_transaction_value,
      bundle_attach_rate,
      refund_rate,
      top_products,
    } = await req.json();

    // Validate required fields
    if (!manager_email || !week || !year || !sales_amount) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    // In production, save to Supabase
    // For now, just return success
    const metrics = {
      manager_email,
      week,
      year,
      sales_amount,
      transaction_count,
      avg_transaction_value,
      bundle_attach_rate,
      refund_rate,
      top_products,
      synced_at: new Date().toISOString(),
    };

    console.log("Synced metrics:", metrics);

    return Response.json({
      success: true,
      message: `Metrics synced for ${manager_email} - Week ${week}`,
      metrics,
    });
  } catch (error) {
    console.error("Sync error:", error);
    return Response.json({ error: "Sync failed" }, { status: 500 });
  }
}
