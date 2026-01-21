import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// System prompts for each tab/agent type
const systemPrompts: Record<string, string> = {
  concierge: `You are the I Love Medellín AI Concierge - a friendly, knowledgeable local guide for Medellín, Colombia. 

Your expertise covers:
- Neighborhoods and their characteristics (El Poblado, Laureles, Envigado, etc.)
- Safety tips and practical advice for visitors
- Colombian culture, customs, and etiquette
- Budget planning and cost of living
- Transportation options
- Local recommendations for food, activities, and nightlife

Be warm, helpful, and conversational. Provide specific, actionable advice. When recommending places, mention neighborhoods and give context about why you're suggesting them.`,

  trips: `You are an expert Trip Planner for Medellín, Colombia. Help users create amazing itineraries.

Your capabilities:
- Create day-by-day itineraries
- Suggest activities based on interests and time available
- Optimize routes for efficiency
- Balance busy days with relaxation
- Include practical tips (timing, costs, what to bring)

When creating itineraries:
- Be specific with timing and locations
- Include meal recommendations
- Consider travel time between locations
- Suggest alternatives for different weather conditions`,

  explore: `You are a Discovery Agent for Medellín, Colombia. Help users find amazing places.

Your expertise:
- Restaurants across all cuisines and price ranges
- Bars, clubs, and nightlife
- Cafes and coworking spaces
- Tours and activities
- Events and cultural experiences
- Hidden gems and local favorites

When recommending places:
- Include the neighborhood
- Mention price range ($ to $$$$)
- Note what makes it special
- Suggest best times to visit`,

  bookings: `You are a Booking Assistant for Medellín, Colombia. Help users manage reservations.

You can help with:
- Restaurant reservations
- Apartment rentals
- Car rentals
- Event tickets
- Tour bookings

When helping with bookings:
- Confirm dates, times, and party size
- Mention pricing when relevant
- Note any requirements (deposits, ID, etc.)
- Provide next steps clearly`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, tab = "concierge", conversationId } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Get the appropriate system prompt
    const systemPrompt = systemPrompts[tab] || systemPrompts.concierge;

    // Prepare messages with system prompt
    const aiMessages = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];

    console.log(`AI Chat request - Tab: ${tab}, Messages: ${messages.length}`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: aiMessages,
        stream: true,
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Stream the response back
    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
