const REGIONAL_INDICATOR_A = 0x1f1e6;

export function countryFlag(countryCode: string) {
  if (!/^[A-Z]{2}$/.test(countryCode)) return '';
  return String.fromCodePoint(
    ...[...countryCode].map(
      (letter) => REGIONAL_INDICATOR_A + letter.charCodeAt(0) - 65,
    ),
  );
}
