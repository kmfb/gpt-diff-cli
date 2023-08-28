import OpenAI from "openai";

// Max chunk size
const maxChunkSize = 3000;
let numRequestsProcessed = 1;
let responseText = "";
// Set the OpenAI API key to use
const apiKey = process.env.API_KEY;
// Set the OpenAI API key to use
const baseURL = process.env.BASE_URL || `https://api.openai.com/v1`;
const openai = new OpenAI({
  apiKey, // defaults to process.env["OPENAI_API_KEY"],
  baseURL,
});

async function handleByGPT(diffOutput) {
  const processChunk = async (previousOutput, chunk) => {
    const max_tokens = Math.ceil(4000 - chunk.length / 2);
    console.log(
      `Processing chunk ${numRequestsProcessed} with a length of ${chunk.length} and max tokens at ${max_tokens}`
    );

    const prompt = `
    Given the previous context and the following code diff, provide a concise explanation in plain English of the changes. Summarize and group them logically:
    \`\`\`diff
    ${chunk}
    \`\`\`
  `;

    const messages = [
      { role: "system", content: "You are a helpful assistant." },
    ];

    if (previousOutput) {
      messages.push({ role: "user", content: previousOutput });
    }

    messages.push({ role: "user", content: prompt });

    try {
      const response = await openai.chat.completions.create({
        messages: messages,
        model: "gpt-3.5-turbo",
      });

      numRequestsProcessed++;
      return response.choices[0].message.content;
    } catch (error) {
      numRequestsProcessed++;
      return error.message;
    }
  };

  const chunks = splitText(maxChunkSize, diffOutput);
  let previousOutput = "";
  const results = [];

  for (let chunk of chunks) {
    const result = await processChunk(previousOutput, chunk);
    results.push(result);
    previousOutput = result; // Store the output to be used for the next chunk
  }

  // If you want to summarize the combined output, you can use another call to the model here.
  const combinedOutput = results.join(" ");
  const summaryPrompt = `
    Summarize the following set of explanations about code changes. Ensure it's concise and captures the main points:
    ${combinedOutput}
`;

  let summary;
  try {
    const summaryResponse = await openai.chat.completions.create({
      messages: [{ role: "user", content: summaryPrompt }],
      model: "gpt-3.5-turbo",
    });
    summary = summaryResponse.choices[0].message.content;
  } catch (error) {
    summary = error.message;
  }

  console.log("Summary:", summary);
}

export { handleByGPT };

// Split the diff output into chunks of X characters
// Define the split_text function
function splitText(chunkSize, text) {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.substring(i, i + chunkSize));
  }
  return chunks;
}
