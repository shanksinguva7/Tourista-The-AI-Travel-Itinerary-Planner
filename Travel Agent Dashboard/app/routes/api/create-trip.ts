import type { ActionFunctionArgs } from "react-router";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createApi } from "unsplash-js";
import { database, appwriteConfig } from "~/appwrite/client";
import { createProduct } from "~/lib/stripe";
import { ID } from "appwrite";

export const action = async ({ request }: ActionFunctionArgs) => {
    const {
        country,
        numberOfDays,
        travelStyle,
        interests,
        budget,
        groupType,
        userId,
    } = await request.json();

    const prompt = `Generate a ${numberOfDays}-day travel itinerary for ${country} with the following preferences:
- Travel Style: ${travelStyle}
- Interests: ${interests}
- Budget: ${budget}
- Group Type: ${groupType}

Return ONLY a valid JSON object (no markdown, no code blocks) with this exact structure:
{
  "name": "Trip name",
  "description": "A brief 2-3 sentence description of the trip",
  "estimatedPrice": "$X,XXX - $X,XXX",
  "duration": ${numberOfDays},
  "budget": "${budget}",
  "country": "${country}",
  "travelStyle": "${travelStyle}",
  "interests": "${interests}",
  "groupType": "${groupType}",
  "itinerary": [
    {
      "day": 1,
      "location": "City name",
      "activities": [
        { "time": "Morning", "description": "Activity description" },
        { "time": "Afternoon", "description": "Activity description" },
        { "time": "Evening", "description": "Activity description" }
      ]
    }
  ],
  "bestTimeToVisit": ["Month range and reason"],
  "weatherInfo": ["Weather description for the season"]
}`;

    try {
        const geminiKey = process.env.GEMINI_API_KEY ?? import.meta.env.GEMINI_API_KEY;
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        let tripData: any;
        try {
            const cleaned = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
            tripData = JSON.parse(cleaned);
        } catch {
            console.error("Failed to parse AI response:", responseText);
            return { error: "Failed to parse trip data" };
        }

        const unsplash = createApi({
            accessKey: process.env.UNSPLASH_ACCESS_KEY ?? import.meta.env.UNSPLASH_ACCESS_KEY,
        });
        const unsplashResponse = await unsplash.search.getPhotos({
            query: `${country} ${interests} ${travelStyle} travel`,
            perPage: 3,
        });
        const imageUrls =
            unsplashResponse.response?.results?.map((photo) => photo.urls.regular) ?? [];

        const tripDocument = await database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.tripCollectionId,
            ID.unique(),
            {
                tripDetails: JSON.stringify(tripData),
                imageUrls,
                createdAt: new Date().toISOString(),
                userId,
            }
        );

        const rawPrice = tripData.estimatedPrice?.replace(/[^0-9]/g, "") || "1000";
        const price = parseInt(rawPrice.slice(0, rawPrice.length / 2) || rawPrice) || 1000;

        const paymentLink = await createProduct(
            tripData.name,
            tripData.description,
            imageUrls,
            price,
            tripDocument.$id
        );

        await database.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.tripCollectionId,
            tripDocument.$id,
            { payment_link: paymentLink.url }
        );

        return { id: tripDocument.$id };
    } catch (e) {
        console.error("Error generating trip:", e);
        return { error: "Failed to generate trip" };
    }
};
