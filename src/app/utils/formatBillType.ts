function formatBillType(billType: string | null | undefined): string {
  if (!billType || typeof billType !== "string") {
    return "";
  }

  // Replace underscores with spaces and capitalize each word
  return billType
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export default formatBillType;