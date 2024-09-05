// import express from "express";
// import cors from "cors";
// import axios from 'axios';
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { Marked, marked } from 'marked';
// const app = express();
// const PORT = 3001;

// app.use(cors());

// app.get("/recipeStream", (req, res) => {
//   res.setHeader("Content-Type", "text/event-stream");
//   res.setHeader("Cache-Control", "no-cache");
//   res.setHeader("Connection", "keep-alive");

//   const { ingredients, mealType, cuisine, cookingTime, complexity } = req.query;

// //   const sendEvent = (response) => {
// //     console.log(response);
// //     res.send(response);
// //   };

//   const prompt = [];
//   prompt.push("Generate a recipe that incorporates the following details:");
//   prompt.push(`[Ingredients: ${ingredients}]`);
//   prompt.push(`[Meal Type: ${mealType}]`);
//   prompt.push(`[Cuisine Preference: ${cuisine}]`);
//   prompt.push(`[Cooking Time: ${cookingTime}]`);
//   prompt.push(`[Complexity: ${complexity}]`);
//   prompt.push();

//   prompt.push(
//     "Please provide a detailed recipe, including steps for preparation and cooking. Only use the ingredients provided."
//   );
//   prompt.push(
//     "The recipe should highlight the fresh and vibrant flavors of the ingredients."
//   );
//   prompt.push(
//     "Also give the recipe a suitable name in its local language based on cuisine preference."
//   );

//   console.log('after prompt')
//   run(prompt, (generatedText) => {
//     res.write(`data: ${generatedText}\n\n`);
//     res.write('event: end\ndata: Recipe generation complete!\n\n');
//     res.end();
//   });

//   req.on("close", () => {
//     res.end();
//   });
// });

// const API_KEY = 'AIzaSyC2jaynhKTkOx3C2ir3zAJuDzTqEsQvNrE';
// const genAI = new GoogleGenerativeAI('API_KEY');

// export async function run(prompt, callback) {
//     try {
//       // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
//       const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
//       const result = await model.generateContent(prompt);
//       console.log('reached run');
//       const response = result.response;
//       if (response && response.candidates && response.candidates[0] && response.candidates[0].content && response.candidates[0].content.parts) {
//         const generatedText = marked(response.candidates[0].content.parts.map(part => part.text).join("\n"));
//         console.log("Generated Text:", generatedText);
//         callback(generatedText);  // Send the generated text to the client
//       } else {
//         console.log("No valid response structure found.");
//       }
//     } catch (error) {
//       console.error("Error generating content:", error);
//     }
// }

// // const API_KEY = process.env.GOOGLE_API_KEY;
// // const genAI = new GoogleGenerativeAI("API_KEY");

// // const GEMINI_API_URL = 'https://api.gemini.com/v1/generate';
// // const GEMINI_API_KEY = 'AIzaSyC2jaynhKTkOx3C2ir3zAJuDzTqEsQvNrE';

// // async function generateRecipe(prompt, callback) {
// //     try {
// //         // Send the prompt to Gemini API
// //         const response = await axios.post(GEMINI_API_URL, {
// //           prompt: prompt,
// //           max_tokens: 150, // You can adjust this value based on your needs
// //         }, {
// //           headers: {
// //             'Authorization': `Bearer ${GEMINI_API_KEY}`,
// //             'Content-Type': 'application/json'
// //           }
// //         });

// //         // Stream the response text back to the client
// //         const recipeText = response.data.choices[0].text;

// //         res.write(`data: ${recipeText}\n\n`);
// //         res.write('event: end\ndata: Recipe generation complete!\n\n');
// //         res.end();
// //       } catch (error) {
// //         console.error('Error communicating with Gemini API:', error);
// //         res.write('event: end\ndata: An error occurred while generating the recipe.\n\n');
// //         res.end();
// //       }
// // }

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { marked } from "marked";
import dotenv from "dotenv";
import process from 'process';
dotenv.config();

// get api key
const apiKey = process.env.API_KEY;

const app = express();
const PORT = 3001;

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
console.log(apiKey);

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
