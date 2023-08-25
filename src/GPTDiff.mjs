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
  const handleRequest = async () => {
    // Iterate over each chunk
    const promises = [];
    splitText(maxChunkSize, diffOutput).forEach(async (chunk) => {
      // Print "processing chunk number x and show the first 20 characters of the chunk"
      const promise = new Promise(async (resolve) => {
        const max_tokens = Math.ceil(4000 - chunk.length / 2);
        console.log(
          `Processing chunk ${numRequestsProcessed} with a length of ${chunk.length} and max tokens at ${max_tokens}`
        );
        try {
          // const prompt = `Give me a detailed bullet list "• " of all code changes in this diff:

          // ${chunk}`;
          const prompt = `Do not attempt to generate or complete the following code. 
            Give me a text to explain why in plain English of all code changes in this diff and group them together in a logical way:
            \`\`\`diff
            ${chunk}
            \`\`\``;
          const response = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],

            model: "gpt-3.5-turbo",
          });
          // const response = await openai.createCompletion({
          //   model: "text-davinci-003",
          //   prompt,
          //   temperature: 0.9,
          //   max_tokens,
          //   top_p: 1,
          //   frequency_penalty: 0,
          //   presence_penalty: 0,
          //   //stop: "",
          // });
          numRequestsProcessed++;
          const text = response.choices[0].message.content;
          resolve(text);
        } catch (error) {
          numRequestsProcessed++;
          resolve(error.message);
        }
      });
      promises.push(promise);
    });

    Promise.all(promises).then((values) => {
      responseText = values.join(" ");
      // Remove all empty lines
      responseText = responseText.replace(/^\s*[\r ]*\n/gm, "");
      console.log(responseText);
    });
  };

  await handleRequest();
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
