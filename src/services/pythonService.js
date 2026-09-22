const BASE_URL = process.env.REACT_APP_ALGORITHM_API;

export const getRandomQuestion = async (postData) => {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating subtopic:', error);
    throw error;
  }
};
