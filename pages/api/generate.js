import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const name = req.body.name || '';
  if (name.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid name",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(name),
      temperature: 0.6,
      stop: "\n"
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(name) {
  const capitalizedName = name.split(/\s+/).map(s=>s[0].toUpperCase() + s.slice(1).toLowerCase()).join(' ');

  return `Come up with a witty rhyming retort based on a phrase, as in the following examples:
  Super Man? More like Pooper Man!
  Star Trek? More like Star Wreck!
  Joe Biden? More like Slow Biden!
  Donald Trump? More like Donald Dump!
  Star Wars? More like Star Snores!
  Lord of the Rings? More like Bored of the Things!
  Alien Invasion? More like Stay-In vacation!
  Cloud Computing? More like Crowd Confusing!
  ${capitalizedName}? More like`;
}
