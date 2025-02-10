const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");

const client = new BedrockRuntimeClient({ region: "us-east-1" });

exports.handler = async (event) => {
  const { ingredients, cuisine } = JSON.parse(event.body);
  
  try {
    const params = {
      modelId: "amazon.deepseek-r1-20240515",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        prompt: `Generate a ${cuisine} recipe using: ${ingredients.join(', ')}`,
        max_tokens: 1000,
        temperature: 0.7
      })
    };

    const command = new InvokeModelCommand(params);
    const response = await client.send(command);
    const result = JSON.parse(Buffer.from(response.body).toString());
    
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipe: result.outputs[0].text,
        model: "deepseek-r1"
      })
    };
  } catch (error) {
    console.error("Bedrock Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "Recipe generation failed",
        details: error.message
      })
    };
  }
};
