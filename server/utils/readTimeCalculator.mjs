const calculateReadingTime = (text) => {
  // Average reading speed: 200-250 words per minute
  const WORDS_PER_MINUTE = 225;
  const WORDS_PER_IMAGE = 10; // Estimate words for an image

  // Count words in the text
  const wordCount = text.trim().split(/\s+/).length;

  // Count potential images (assuming markdown-like image syntax)
  const imageCount = (text.match(/!\[.*?\]\(.*?\)/g) || []).length;

  // Calculate total word equivalent
  const totalWordEquivalent = wordCount + imageCount * WORDS_PER_IMAGE;

  // Calculate reading time in minutes, rounded up
  const readingTime = Math.ceil(totalWordEquivalent / WORDS_PER_MINUTE);

  return readingTime;
};

export default calculateReadingTime;
