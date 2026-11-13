// "Raju's Chaat Corner" -> "raju-s-chaat-corner"
export function toSlug(text) {
  const slug = text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // anything that is not a letter or number becomes "-"
    .replace(/^-+|-+$/g, ''); // remove "-" at the start and end

  return slug || 'cart'; // e.g. a name written only in Hindi letters
}
