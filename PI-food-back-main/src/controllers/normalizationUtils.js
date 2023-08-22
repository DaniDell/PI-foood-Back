// normalizationUtils.js
const removeHyperlinkTags = (text) => {
    const withoutLinksAndTags = text.replace(/<a\b[^>]*>|<\/a>|<b>|<\/b>/gi, '');
    return withoutLinksAndTags.replace(/spoonacular/gi, '');
  };
  
  
  const getPlainTextInstructions = (instructions) => {
    return instructions
      .map((i) =>
        i.steps.map((s) => `${s.number}) ${removeHyperlinkTags(s.step)}`).join("\n")
      )
      .join("\n");
  };
  
  const getPlainTextSummary = (summary) => {
    return removeHyperlinkTags(summary);
  };
  
  module.exports = {
    removeHyperlinkTags,
    getPlainTextInstructions,
    getPlainTextSummary,
  };
  