const BASE_URL = process.env.REACT_APP_MATHE_API;


export const updateUserData = async (postData) => {

    try {
      const response = await fetch(BASE_URL + "user/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData), 
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();;
      return data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
};


export const completeStudentProfile = async (postData) => {

  try {
    const response = await fetch(BASE_URL + "user/completeStudentProfile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData), 
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();;
    return data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};


export const updatePassword = async (postData) => {

  try {
    const response = await fetch(BASE_URL + "user/changePassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData), 
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.elements);
    }
    
    return data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const insertUser = async (postData) => {

  try {
    const response = await fetch(BASE_URL + "auth/singUp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData), 
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.elements);
    }
    return data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const requestNewPassword = async (postData) => {

  try {
    const response = await fetch(BASE_URL + "auth/requestNewPassword", {
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
    console.error('Error updating user:', error);
    throw error;
  }
};

export const recoverPassword = async (postData) => {
  try {
    const response = await fetch(BASE_URL + "auth/recoverPassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData), 
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.elements);
    }
    
    return data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const updateEmail = async (checkcode) => {
  try {
    const response = await fetch(BASE_URL+"auth/confirmEmail/"+checkcode);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getTeachingFile = async (postData) => {
  try {
    const response = await fetch(BASE_URL + "user/downloadFile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const pdfBlob = await response.blob();
    
    return pdfBlob;
  } catch (error) {
    console.error('Error creating subtopic:', error);
    throw error;
  }
};


