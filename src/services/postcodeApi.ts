export interface PostcodeLocation {
  latitude: number;
  longitude: number;
}

export async function lookupPostcode(postcode: string): Promise<PostcodeLocation> {
  const formattedPostcode = postcode.replace(/\s+/g, '').toLowerCase();
  const response = await fetch(`https://api.postcodes.io/postcodes/${formattedPostcode}`);
  
  if (!response.ok) {
    throw new Error('Invalid postcode or service unavailable');
  }

  const data = await response.json();
  
  if (!data.result || !data.result.latitude || !data.result.longitude) {
    throw new Error('Location data not found for this postcode');
  }

  return {
    latitude: data.result.latitude,
    longitude: data.result.longitude
  };
}