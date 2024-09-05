import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { marked } from "marked";
import dotenv from "dotenv";
import process from 'process';
dotenv.config({ path: './.env' });

const apiKey = process.env.API_KEY;

const app = express();
const PORT = 3001;

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.use(cors());
app.use(express.json());

const sendEvent = (res, response) => {
  // console.log(response);
  res.send(response);
};

app.get("/recipeStream", async (req, res) => {
  try {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const { ingredients, mealType, cuisine, cookingTime, complexity } =
      req.query;

    const prompt = [];
    prompt.push("Generate a recipe that incorporates the following details:");
    prompt.push(`[Ingredients: ${ingredients}]`);
    prompt.push(`[Meal Type: ${mealType}]`);
    prompt.push(`[Cuisine Preference: ${cuisine}]`);
    prompt.push(`[Cooking Time: ${cookingTime}]`);
    prompt.push(`[Complexity: ${complexity}]`);
    prompt.push();
    prompt.push("Highlight recipe name in bold");

    prompt.push(
      "Please provide a detailed recipe, including steps for preparation and cooking. Only use the ingredients provided."
    );
    prompt.push(
      "The recipe should highlight the fresh and vibrant flavors of the ingredients."
    );
    prompt.push(
      "Also give the recipe a suitable name in its local language based on cuisine preference."
    );
    // const prompt1 = "Generate a simple recipe for a vegetable salad.";

    const result = await model.generateContent(prompt);

    const response = result.response;

    if (
      response &&
      response.candidates &&
      response.candidates[0] &&
      response.candidates[0].content &&
      response.candidates[0].content.parts
    ) {
      const generatedText = marked(
        response.candidates[0].content.parts.map((part) => part.text).join("\n")
      );
      // console.log("Generated Text:", generatedText);
      sendEvent(res, generatedText);
    } else {
      console.log("No valid response structure found.");
    }
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Failed to generate content" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
