export function pascalCase(val: string): string {
  return val
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_\-\s]+/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => {
      const normalized = word.replace(/[^A-Za-z0-9]/g, "");
      if (!normalized) return "";
      return normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase();
    })
    .join(" ");
}

export function getPossibleEndDate(
  remainingHours: number,
  startDate = new Date()
) {
  const hoursPerDay = 8;
  let remaining = remainingHours;

  const date = new Date(startDate);

  while (remaining > 0) {
    const day = date.getDay();

    // Monday to Friday
    if (day >= 1 && day <= 5) {
      const hoursConsumed = Math.min(remaining, hoursPerDay);

      remaining -= hoursConsumed;
    }

    // Move to next day if may remaining hours pa
    if (remaining > 0) {
      date.setDate(date.getDate() + 1);
    }
  }

  return date;
};