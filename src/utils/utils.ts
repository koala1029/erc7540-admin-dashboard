export const formatDate = (date: number): string => {
    return  new Date(date * 1000).toLocaleDateString('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    })
}

export function shortenAddress(address: string, chars = 4): string {
  if (!address || address.length < 2 * chars + 2) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}
