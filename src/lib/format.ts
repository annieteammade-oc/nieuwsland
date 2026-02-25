export function formatDutchDate(dateInput: string) {
  return new Intl.DateTimeFormat("nl-BE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateInput));
}

export function formatDutchDateTime(dateInput: string) {
  return new Intl.DateTimeFormat("nl-BE", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateInput));
}

export function formatTimeAgo(dateInput: string) {
  const diff = Date.now() - new Date(dateInput).getTime();
  const minutes = Math.floor(diff / (1000 * 60));

  if (minutes < 60) {
    return `${minutes} min geleden`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} u geleden`;
  }

  const days = Math.floor(hours / 24);
  return `${days} d geleden`;
}

