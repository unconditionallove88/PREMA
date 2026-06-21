/**
 * @fileOverview AI Retry Utility.
 * Implements exponential backoff for GenAI calls to handle rate limits (429).
 */

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries = 5,
  delay = 1000
): Promise<T> {
  let attempt = 0;

  while (attempt < retries) {
    try {
      return await fn();
    } catch (error: any) {
      // Check for rate limiting (429)
      if (error?.status === 429 && attempt < retries - 1) {
        const waitTime = delay * Math.pow(2, attempt);
        console.warn(`Rate limited. Retrying in ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        attempt++;
      } else {
        throw error;
      }
    }
  }
  throw new Error("Max retries reached");
}
