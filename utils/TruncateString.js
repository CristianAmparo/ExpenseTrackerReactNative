export function TruncatedString(string) {
  if (typeof string !== "string") return ""; // Ensure it's a string, otherwise return empty
  return string.length > 20 ? string.slice(0, 20) + "..." : string;
}
