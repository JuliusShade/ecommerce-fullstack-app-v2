import jwt from "jsonwebtoken";

// Function to decode the JWT token
export const decodeJwtToken = (token) => {
  try {
    // Decode the token
    const decoded = jwt.decode(token, { complete: true });

    // Log the decoded information
    console.log("Decoded Token: ", decoded);

    // Extract user information from the decoded token
    const userProfile = decoded?.payload;

    if (userProfile) {
      console.log("User Profile: ", userProfile);

      // Now, you can send the user information to your backend for user creation or session initiation.
      // Implement your backend logic here.
    } else {
      console.log("User Profile not found in the decoded token.");
    }
  } catch (error) {
    console.error("Error decoding JWT token: ", error);
  }
};
