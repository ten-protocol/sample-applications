export default function formatAddress(address: string) {
  const afterX = address.substring(2);
  const firstFourCharacters = afterX.substring(0, 4);
  const lastFourCharacters = afterX.slice(-4);

  return `0x${firstFourCharacters}...${lastFourCharacters}`;
}
