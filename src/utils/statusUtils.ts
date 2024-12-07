export function getDecisionStatusColor(status: string): string {
  const lowerStatus = status.toLowerCase();
  if (lowerStatus.includes('approved') || lowerStatus.includes('granted')) {
    return 'text-green-600 font-medium';
  }
  if (lowerStatus.includes('refused') || lowerStatus.includes('rejected')) {
    return 'text-red-600 font-medium';
  }
  if (lowerStatus.includes('pending') || lowerStatus.includes('in progress')) {
    return 'text-yellow-600 font-medium';
  }
  if (lowerStatus.includes('withdrawn')) {
    return 'text-gray-600 font-medium';
  }
  return 'text-gray-600 font-medium';
}