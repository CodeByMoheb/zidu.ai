import { GoogleGenAI, Modality } from "@google/genai";

// Use a singleton pattern that can be invalidated if the API key changes.
let aiClient: { instance: GoogleGenAI; apiKey: string } | null = null;
const FALLBACK_API_KEY = 'AIzaSyDb_5meg9UL9wX3tvs7DxNnSTQAYC1lenw';

/**
 * Retrieves the active API key from localStorage, or returns the fallback key.
 */
const getActiveApiKey = (): string => {
    return localStorage.getItem('zidu_active_api_key') || FALLBACK_API_KEY;
};


/**
 * Lazily initializes and returns the GoogleGenAI instance based on the
 * active API key. It creates a new instance if the active key has changed.
 */
const getGoogleAI = (): GoogleGenAI => {
    const apiKey = getActiveApiKey();

    // If we have an instance and its key is the current active one, return it.
    if (aiClient && aiClient.apiKey === apiKey) {
        return aiClient.instance;
    }
    
    // Otherwise, create a new instance with the new active key.
    console.log(`Initializing GoogleGenAI with key ending in ...${apiKey.slice(-4)}`);
    const newInstance = new GoogleGenAI({ apiKey });
    aiClient = { instance: newInstance, apiKey: apiKey };
    
    return newInstance;
};


const fileToGenerativePart = (base64: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64.substring(base64.indexOf(',') + 1),
      mimeType
    },
  };
};

const generateSingleImage = async (contents: any): Promise<string> => {
    const ai = getGoogleAI();
    const response = await ai.models.generateContent({
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
    getGoogleAI(); // Ensures client is initialized
    const childhoodImagePart = fileToGenerativePart(childhoodImageBase64, childhoodImageType);
    const currentImagePart = fileToGenerativePart(currentImageBase64, currentImageType);
  
    const prompt = `Generate a photorealistic, heart-touching, and emotional AI-generated photo. The photo must show two versions of the same person hugging each other warmly and lovingly, seamlessly composited together.

    **Crucial Instructions for Realism:**
    1.  **Analyze Source Images:** Before generating, meticulously analyze both uploaded images for key photographic details: lighting style (e.g., soft, hard, natural), skin textures, hair detail, and the overall grain or digital noise. The final generated image MUST replicate this photographic style to look authentic and not like a digital painting.
    2.  **Face Integrity:** The faces of the child and the adult MUST be highly accurate and closely resemble the faces in the two uploaded images. This is the most critical requirement. Preserve their unique features.
    3.  **Seamless Integration:** The two figures should be blended together with realistic shadows and lighting. Their interaction (the hug) must look physically plausible.
    4.  **Child & Adult Versions:** The child version should be based on the first uploaded image (from ${childhoodYear}), and the adult version should be based on the second uploaded image (from ${currentYear}).
    5.  **Background & Text:** The background should be emotional and artistic (like a sunset, a nostalgic home garden, or have dreamy soft tones), but it MUST match the lighting and style of the subjects. In the background, perfectly centered, the name '${personName}' should appear as large, beautiful text, softly blended into the scenery but legible. Directly below the name, also centered, display the text '${childhoodYear} — ${currentYear}'.

    The final image must not look like a collage. It must appear as a single, authentic photograph that evokes warmth, nostalgia, and the deep connection between one's past and present self.`;

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
        if (error instanceof Error) { // More robust error checking
            throw error;
        }
        throw new Error("Could not generate all image variations. Please try again.");
    }
};

export const generateImageWithImagen = async (prompt: string): Promise<string[]> => {
    const ai = getGoogleAI();
    const response = await ai.models.generateImages({
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
    getGoogleAI();
    const imagePart = fileToGenerativePart(imageBase64, imageMimeType);
    const fullPrompt = `Analyze the uploaded image's photographic style, including its lighting, grain, and texture. Then, perform the following edit while maintaining that exact realistic style: "${prompt}"`;

    const contents = {
        parts: [
            imagePart,
            { text: fullPrompt }
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
         if (error instanceof Error) {
            throw error;
        }
        throw new Error("Could not generate all edited image variations. Please try again.");
    }
};