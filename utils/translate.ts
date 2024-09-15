// import { Translate } from '@google-cloud/translate/build/src/v2';

// const translate = new Translate({
//   credentials: {
//     // Replace with your Google Cloud API credentials
//     client_email: 'your-client-email@your-project.iam.gserviceaccount.com',
//     private_key: 'your-private-key',
//   },
// });

// interface TranslationResult {
//   text: string;
//   detectedSourceLanguage: string;
// }

// export async function translateText(
//   text: string,
//   targetLanguage: string = 'en'
// ): Promise<TranslationResult> {
//   try {
//     const [translation] = await translate.translate(text, targetLanguage);
//     const detectedSourceLanguage = await getDetectedLanguage(text);

//     return {
//       text: translation,
//       detectedSourceLanguage,
//     };
//   } catch (error) {
//     console.error('Error translating text:', error);
//     throw error;
//   }
// }

// async function getDetectedLanguage(text: string): Promise<string> {
//   try {
//     const [detection] = await translate.detect(text);
//     return detection.language;
//   } catch (error) {
//     console.error('Error detecting language:', error);
//     throw error;
//   }
// }