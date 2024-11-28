
// Function to store Base64 audio data in session storage
export function storeAudio(base64Audio: string, key: string) {
  try {
    // Store the Base64 string in local storage for later use
    const localAudio = localStorage.setItem(key, base64Audio);
    console.log("Audio data stored in local storage.");
    return localAudio;
  } catch (error) {
    console.error("Error storing audio data:", error);
  }
}

// Function to retrieve Base64 audio data from session storage
export function retrieveAudioFromSession(key: string) {
  try {
    const base64Audio = sessionStorage.getItem(key);
    if (base64Audio) {
      console.log("Audio data retrieved from session storage.");
      return base64Audio;
    } else {
      console.warn("No audio data found in session storage.");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving audio data from session storage:", error);
    return null;
  }
}