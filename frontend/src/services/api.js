const API_URL = process.env.REACT_APP_API_URL || 'https://<your-api-id>.execute-api.us-east-1.amazonaws.com/prod/recipes';

export const generateRecipe = async (ingredients, cuisine) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ingredients: Array.isArray(ingredients) ? ingredients : ingredients.split(',').map(i => i.trim()),
        cuisine: cuisine || 'general'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'API request failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error.message || 'Failed to generate recipe');
  }
};
