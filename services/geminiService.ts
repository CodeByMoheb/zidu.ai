import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

// Conditionally initialize the AI client.
// This prevents the app from crashing on start-up if the API key is not set,
// which is a common issue in local development environments.
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const checkApiKey = () => {
    if (!ai) {
        // Provide a user-friendly error message that guides them on how to fix their local setup.
        throw new Error("API Key is not configured. Please set up your API_KEY environment variable for local development.");
    }
}

const fileToGenerativePart = (base64: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64.substring(base64.indexOf(',') + 1),
      mimeType
    },
  };
};

const generateSingleImage = async (contents: any): Promise<string> => {
    checkApiKey(); // Check for the API key before making a call.
    const response = await ai!.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: contents,
        config: {
            responseModalities: [Modality.IMAGE],
        }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
    }
    // Return a specific error if a single image generation fails within a batch
    throw new Error("A sub-task for image generation failed.");
}

export const generateMemoryHugImage = async (
  personName: string,
  childhoodImageBase64: string,
  childhoodImageType: string,
  currentImageBase64: string,
  currentImageType: string,
  childhoodYear: string,
  currentYear: string
): Promise<string[]> => {
    checkApiKey(); // Check for the API key at the start of the public function.
    const childhoodImagePart = fileToGenerativePart(childhoodImageBase64, childhoodImageType);
    const currentImagePart = fileToGenerativePart(currentImageBase64, currentImageType);
  
    const prompt = `Create a highly realistic, heart-touching, and emotional AI-generated photo. The photo must show two versions of the same person hugging each other warmly and lovingly.

    **Crucial Instructions:**
    1.  **Face Accuracy:** The faces of the child and the adult MUST be highly accurate and closely resemble the faces in the two uploaded images. This is the most important requirement.
    2.  **Child Version:** The child version should be based on the first uploaded image.
    3.  **Adult Version:** The adult version should be based on the second uploaded image.
    4.  **Background Text:** In the background, perfectly centered in the middle, the name '${personName}' should appear as large, beautiful text. It should be softly blended into the scenery but still clearly legible.
    5.  **Years Text:** Directly below the name, also centered, display the text '${childhoodYear} — ${currentYear}'.
    6.  **Overall Style:** The background should be emotional and artistic, like a sunset, a nostalgic home garden, or have dreamy soft tones.

    The final image must evoke a deep sense of warmth, nostalgia, and the connection between one's past and present self.`;

    const contents = {
        parts: [
            childhoodImagePart,
            currentImagePart,
            { text: prompt }
        ]
    };
    
    try {
        // Create three concurrent requests to generate three image variations
        const imagePromises = [
            generateSingleImage(contents),
            generateSingleImage(contents),
            generateSingleImage(contents)
        ];
        return await Promise.all(imagePromises);
    } catch (error) {
        console.error("Failed to generate one or more memory hug images:", error);
        if (error instanceof Error && error.message.includes("API Key is not configured")) {
            throw error;
        }
        throw new Error("Could not generate all image variations. Please try again.");
    }
};

export const generateImageWithImagen = async (prompt: string): Promise<string[]> => {
    checkApiKey();
    const response = await ai!.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
            numberOfImages: 3,
            outputMimeType: 'image/jpeg',
            aspectRatio: '1:1',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        return response.generatedImages.map(img => `data:image/jpeg;base64,${img.image.imageBytes}`);
    }
    throw new Error("No image generated from Imagen model.");
};

export const editImageWithText = async (
    imageBase64: string,
    imageMimeType: string,
    prompt: string
): Promise<string[]> => {
    checkApiKey();
    const imagePart = fileToGenerativePart(imageBase64, imageMimeType);
    const contents = {
        parts: [
            imagePart,
            { text: prompt }
        ]
    };

    try {
         // Create three concurrent requests to generate three edited variations
        const imagePromises = [
            generateSingleImage(contents),
            generateSingleImage(contents),
            generateSingleImage(contents)
        ];
        return await Promise.all(imagePromises);
    } catch (error) {
        console.error("Failed to generate one or more edited images:", error);
        if (error instanceof Error && error.message.includes("API Key is not configured")) {
            throw error;
        }
        throw new Error("Could not generate all edited image variations. Please try again.");
    }
};