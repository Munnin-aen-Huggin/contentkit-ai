const crypto = require("node:crypto");

// Lemon Squeezy → Kit buyer tagging webhook handler
// Receives order_created events, verifies HMAC signature, tags buyer in Kit

exports.handler = async function (event) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-signature",
  };

  // Handle OPTIONS preflight (Netlify health checks)
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: "",
    };
  }

  // Only accept POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: "Method Not Allowed",
    };
  }

  // --- 1. VERIFY WEBHOOK SIGNATURE ---
  // CRITICAL: Verify BEFORE parsing JSON — raw body must match what LS signed
  const rawBody = event.body;
  const signature = event.headers["x-signature"];

  if (!signature) {
    console.error("[ls-webhook] Missing x-signature header");
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: "Unauthorized: Missing signature",
    };
  }

  const webhookSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[ls-webhook] LEMONSQUEEZY_WEBHOOK_SECRET env var not set");
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: "Internal Server Error: Missing webhook secret config",
    };
  }

  const computedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  let signaturesMatch;
  try {
    signaturesMatch = crypto.timingSafeEqual(
      Buffer.from(computedSignature, "hex"),
      Buffer.from(signature, "hex")
    );
  } catch (err) {
    // Buffer.from throws if lengths differ — treat as mismatch
    signaturesMatch = false;
  }

  if (!signaturesMatch) {
    console.error("[ls-webhook] Invalid signature — rejecting request");
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: "Unauthorized: Invalid signature",
    };
  }

  // --- 2. PARSE EVENT AND CHECK EVENT TYPE ---
  let data;
  try {
    data = JSON.parse(rawBody);
  } catch (err) {
    console.error("[ls-webhook] Failed to parse request body as JSON:", err.message);
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: "Bad Request: Invalid JSON",
    };
  }

  const eventName = data?.meta?.event_name;
  if (eventName !== "order_created") {
    console.log(`[ls-webhook] Ignoring event: ${eventName}`);
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: "Ignored",
    };
  }

  // --- 3. EXTRACT BUYER INFO ---
  const attributes = data?.data?.attributes;
  const buyerEmail = attributes?.user_email;
  // product_id lives inside first_order_item
  const productId = String(attributes?.first_order_item?.product_id ?? "");

  if (!buyerEmail) {
    console.error("[ls-webhook] Missing buyer email in payload");
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: "Bad Request: Missing buyer email",
    };
  }

  console.log(`[ls-webhook] order_created — buyer: ${buyerEmail}, productId: ${productId}`);

  // --- 4. MAP PRODUCT ID TO KIT TAG ID ---
  const productTagMap = {
    [process.env.LS_PRODUCT_ID_STARTER]: process.env.KIT_TAG_ID_PURCHASED_STARTER,
    [process.env.LS_PRODUCT_ID_FULL_KIT]: process.env.KIT_TAG_ID_PURCHASED_FULL_KIT,
  };

  const kitTagId = productTagMap[productId];

  if (!kitTagId) {
    console.warn(
      `[ls-webhook] Unknown product ID: ${productId}. No tag mapping found. Env: STARTER=${process.env.LS_PRODUCT_ID_STARTER}, FULL_KIT=${process.env.LS_PRODUCT_ID_FULL_KIT}`
    );
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: "Unknown product",
    };
  }

  const kitApiSecret = process.env.KIT_API_SECRET;
  if (!kitApiSecret) {
    console.error("[ls-webhook] KIT_API_SECRET env var not set");
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: "Internal Server Error: Missing Kit API secret config",
    };
  }

  // --- 5. TAG BUYER IN KIT (product-specific tag) ---
  // This is the CRITICAL tag — return 500 on failure so Lemon Squeezy retries
  let productTagResponse;
  try {
    productTagResponse = await fetch(
      `https://api.convertkit.com/v3/tags/${kitTagId}/subscribe`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_secret: kitApiSecret,
          email: buyerEmail,
        }),
      }
    );
  } catch (err) {
    console.error("[ls-webhook] Kit API request failed (product tag):", err.message);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: "Internal Server Error: Kit API unreachable",
    };
  }

  if (!productTagResponse.ok) {
    const errorText = await productTagResponse.text();
    console.error(
      `[ls-webhook] Kit API error (product tag) — status: ${productTagResponse.status}, body: ${errorText}`
    );
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: "Internal Server Error: Kit API returned error for product tag",
    };
  }

  console.log(`[ls-webhook] Product tag ${kitTagId} applied to ${buyerEmail}`);

  // --- 6. TAG BUYER IN KIT (generic "buyer" tag) ---
  // Supplementary tag — log failure but still return 200 (product tag already applied)
  const buyerTagId = process.env.KIT_TAG_ID_BUYER;
  if (!buyerTagId) {
    console.warn("[ls-webhook] KIT_TAG_ID_BUYER env var not set — skipping generic buyer tag");
  } else {
    try {
      const buyerTagResponse = await fetch(
        `https://api.convertkit.com/v3/tags/${buyerTagId}/subscribe`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            api_secret: kitApiSecret,
            email: buyerEmail,
          }),
        }
      );

      if (!buyerTagResponse.ok) {
        const errorText = await buyerTagResponse.text();
        console.error(
          `[ls-webhook] Kit API error (buyer tag) — status: ${buyerTagResponse.status}, body: ${errorText}`
        );
        // Don't return 500 — product tag was applied successfully
      } else {
        console.log(`[ls-webhook] Generic buyer tag ${buyerTagId} applied to ${buyerEmail}`);
      }
    } catch (err) {
      console.error("[ls-webhook] Kit API request failed (buyer tag):", err.message);
      // Don't return 500 — product tag was applied successfully
    }
  }

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: "OK",
  };
};
