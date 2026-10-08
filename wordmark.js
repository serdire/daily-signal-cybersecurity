(function (root) {
  const fonts = [
    '"Manrope", "Segoe UI", sans-serif',
    'Georgia, "Times New Roman", serif',
    '"Courier New", monospace',
    '"Trebuchet MS", sans-serif',
    'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif',
    '"Palatino Linotype", "Book Antiqua", Palatino, serif',
    '"Lucida Console", Monaco, monospace',
    '"Arial Black", Gadget, sans-serif',
    '"Comic Sans MS", "Comic Sans", cursive',
    'system-ui, sans-serif'
  ];

  function styleIndex(date) {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
      throw new Error("Expected a valid date for the wordmark style");
    }
    return Math.floor((date.getUTCHours() * 60 + date.getUTCMinutes()) / 144);
  }

  root.DailySignalWordmark = { fonts, styleIndex };
  if (typeof module !== "undefined") module.exports = root.DailySignalWordmark;
})(globalThis);
