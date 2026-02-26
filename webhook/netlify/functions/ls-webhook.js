const crypto = require("node:crypto");

// Stripe → Kit buyer tagging webhook handler
// Receives checkout.session.completed events, verifies signature, tags buyer in Kit

exports.handler = async function (event) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, stripe-signature",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: corsHeaders, body: "Method Not Allowed" };
  }

  // --- 1. VERIFY STRIPE WEBHOOK SIGNATURE ---
  const rawBody = event.body;
  const sigHeader = event.headers["stripe-signature"];

  if (!sigHeader) {
    console.error("[webhook] Missing stripe-signature header");
    return { statusCode: 401, headers: corsHeaders, body: "Unauthorized: Missing signature" };
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[webhook] STRIPE_WEBHOOK_SECRET env var not set");
    return { statusCode: 500, headers: corsHeaders, body: "Server Error: Missing webhook secret" };
  }

  // Parse Stripe signature header: t=timestamp,v1=signature
  const parts = {};
  sigHeader.split(",").forEach((item) => {
    const [key, value] = item.split("=");
    parts[key] = value;
  });

  const timestamp = parts["t"];
  const expectedSig = parts["v1"];

  if (!timestamp || !expectedSig) {
    console.error("[webhook] Malformed stripe-signature header");
    return { statusCode: 401, headers: corsHeaders, body: "Unauthorized: Malformed signature" };
  }

  // Stripe signs: timestamp + "." + rawBody
  const signedPayload = `${timestamp}.${rawBody}`;
  const computedSig = crypto
    .createHmac("sha256", webhookSecret)
    .update(signedPayload)
    .digest("hex");

  let signaturesMatch;
  try {
    signaturesMatch = crypto.timingSafeEqual(
      Buffer.from(computedSig, "hex"),
      Buffer.from(expectedSig, "hex")
    );
  } catch (err) {
    signaturesMatch = false;
  }

  if (!signaturesMatch) {
    console.error("[webhook] Invalid Stripe signature — rejecting");
    return { statusCode: 401, headers: corsHeaders, body: "Unauthorized: Invalid signature" };
  }

  // Reject if timestamp is older than 5 minutes (replay protection)
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - parseInt(timestamp)) > 300) {
    console.error("[webhook] Timestamp too old — possible replay attack");
    return { statusCode: 401, headers: corsHeaders, body: "Unauthorized: Timestamp expired" };
  }

  // --- 2. PARSE EVENT ---
  let stripeEvent;
  try {
    stripeEvent = JSON.parse(rawBody);
  } catch (err) {
    console.error("[webhook] Failed to parse JSON:", err.message);
    return { statusCode: 400, headers: corsHeaders, body: "Bad Request: Invalid JSON" };
  }

  if (stripeEvent.type !== "checkout.session.completed") {
    console.log(`[webhook] Ignoring event: ${stripeEvent.type}`);
    return { statusCode: 200, headers: corsHeaders, body: "Ignored" };
  }

  // --- 3. EXTRACT BUYER INFO ---
  const session = stripeEvent.data.object;
  const buyerEmail = session.customer_details?.email || session.customer_email;
  const amountTotal = session.amount_total; // in cents

  if (!buyerEmail) {
    console.error("[webhook] Missing buyer email in checkout session");
    return { statusCode: 400, headers: corsHeaders, body: "Bad Request: No email" };
  }

  console.log(`[webhook] checkout.session.completed — buyer: ${buyerEmail}, amount: ${amountTotal}`);

  // --- 4. MAP AMOUNT TO KIT TAG ---
  // $27 = 2700 cents (Starter), $47 = 4700 cents (Full Kit)
  const STARTER_AMOUNT = parseInt(process.env.STRIPE_STARTER_AMOUNT || "2700");
  const FULL_KIT_AMOUNT = parseInt(process.env.STRIPE_FULL_KIT_AMOUNT || "4700");

  let kitTagId;
  if (amountTotal === STARTER_AMOUNT) {
    kitTagId = process.env.KIT_TAG_ID_PURCHASED_STARTER;
  } else if (amountTotal === FULL_KIT_AMOUNT) {
    kitTagId = process.env.KIT_TAG_ID_PURCHASED_FULL_KIT;
  } else {
    console.warn(`[webhook] Unknown amount: ${amountTotal} cents. No tag mapping.`);
    return { statusCode: 200, headers: corsHeaders, body: "Unknown product amount" };
  }

  if (!kitTagId) {
    console.error("[webhook] Kit tag ID env var not set for this product");
    return { statusCode: 500, headers: corsHeaders, body: "Server Error: Missing tag config" };
  }

  const kitApiSecret = process.env.KIT_API_SECRET;
  if (!kitApiSecret) {
    console.error("[webhook] KIT_API_SECRET env var not set");
    return { statusCode: 500, headers: corsHeaders, body: "Server Error: Missing Kit secret" };
  }

  // --- 5. TAG BUYER IN KIT (product-specific tag) ---
  try {
    const res = await fetch(
      `https://api.convertkit.com/v3/tags/${kitTagId}/subscribe`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_secret: kitApiSecret, email: buyerEmail }),
      }
    );
    if (!res.ok) {
      const errText = await res.text();
      console.error(`[webhook] Kit tag error: ${res.status} — ${errText}`);
      return { statusCode: 500, headers: corsHeaders, body: "Kit API error" };
    }
    console.log(`[webhook] Product tag ${kitTagId} applied to ${buyerEmail}`);
  } catch (err) {
    console.error("[webhook] Kit API request failed:", err.message);
    return { statusCode: 500, headers: corsHeaders, body: "Kit API unreachable" };
  }

  // --- 6. TAG BUYER WITH GENERIC "buyer" TAG ---
  const buyerTagId = process.env.KIT_TAG_ID_BUYER;
  if (buyerTagId) {
    try {
      const res = await fetch(
        `https://api.convertkit.com/v3/tags/${buyerTagId}/subscribe`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ api_secret: kitApiSecret, email: buyerEmail }),
        }
      );
      if (res.ok) {
        console.log(`[webhook] Buyer tag ${buyerTagId} applied to ${buyerEmail}`);
      } else {
        console.error(`[webhook] Buyer tag error: ${res.status}`);
      }
    } catch (err) {
      console.error("[webhook] Buyer tag request failed:", err.message);
    }
  }

  return { statusCode: 200, headers: corsHeaders, body: "OK" };
};
