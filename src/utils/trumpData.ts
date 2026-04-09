export interface TrumpStats {
  charisma: number;
  stamina: number;
  intellect: number;
  vibe: number;
  social: number;
  sobriquet: string;
  weightClass: string;
  signatureMove: string;
  trustFactor: number;
}

/**
 * 🛡️ BIO SANITIZATION PROTOCOL:
 * Recursively unwraps multiple layers of JSON strings to extract the narrative text.
 * Defensive against double-stringified database rows and quoted fragments.
 */
export const sanitizeBio = (bio: any): string => {
  if (!bio) return "";
  
  let current = bio;
  
  // 🔄 Recursive Unwrap: Handle strings that might be JSON-encoded multiple times
  try {
    let limit = 5; // Safety brake
    while (typeof current === 'string' && limit > 0) {
      const trimmed = current.trim();
      if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('"') && trimmed.endsWith('"'))) {
        current = JSON.parse(trimmed);
        limit--;
      } else {
        break;
      }
    }
  } catch (e) {
    // Fallback on parse failure: use current state
  }

  // 💎 Extraction: If we reached an object, pull the 'text' field
  if (current && typeof current === 'object') {
    return current.text || current.bio || JSON.stringify(current);
  }

  return typeof current === 'string' ? current : String(current);
};

export const mapToTrumpStats = (profile: { name: string; bio: string; status: string; is_verified?: boolean }): TrumpStats => {
  const bio = profile.bio.toLowerCase();
  const name = profile.name.toUpperCase().split(' ')[0];
  
  // 1. Calculate Intellect
  let intellect = 70;
  if (bio.includes('ai') || bio.includes('engineer') || bio.includes('doctor') || bio.includes('founder') || bio.includes('iit')) intellect = 95;
  else if (bio.includes('analyst') || bio.includes('banker') || bio.includes('researcher')) intellect = 85;
  
  // 2. Calculate Stamina
  let stamina = 65;
  if (bio.includes('trekking') || bio.includes('cycling') || bio.includes('raced') || bio.includes('mountain') || bio.includes('fitness')) stamina = 92;
  else if (bio.includes('traveler') || bio.includes('nomad')) stamina = 80;

  // 3. Calculate Charisma based on Status
  let charisma = 75;
  if (profile.status === 'Imperial') charisma = 98;
  else if (profile.status === 'Vanguard') charisma = 88;
  else if (profile.status === 'Sealed') charisma = 82;

  // 4. Calculate Vibe & Social
  const vibe = bio.includes('minimal') ? 90 : bio.includes('art') ? 85 : 78;
  const social = bio.includes('conversation') || bio.includes('travel') ? 88 : bio.includes('chess') || bio.includes('piano') ? 45 : 65;

  // 5. Generate Sobriquet
  let sobriquet = `THE ${name} PROTOCOL`;
  if (intellect > 90) sobriquet = `THE NEURAL ${name}`;
  else if (stamina > 90) sobriquet = `THE TITANIC ${name}`;
  else if (charisma > 90) sobriquet = `THE SOVEREIGN ${name}`;
  else if (bio.includes('art') || bio.includes('architect')) sobriquet = `THE AESTHETIC ${name}`;

  // 6. Weight Class
  let weightClass = 'Middleweight Visionary';
  if (profile.status === 'Imperial') weightClass = 'Heavyweight Monarch';
  else if (intellect > 90) weightClass = 'Heavyweight Intellect';
  else if (stamina > 90) weightClass = 'Light-Heavyweight Endurance';

  // 7. Signature Move
  let signatureMove = 'Standard Engagement';
  if (bio.includes('trekking')) signatureMove = 'Ladakh Summit Reach';
  else if (bio.includes('piano')) signatureMove = 'Concerto Resonance';
  else if (bio.includes('chess')) signatureMove = 'Grandmaster Opening';
  else if (bio.includes('baker')) signatureMove = 'Sourdough Catalyst';
  else if (bio.includes('lawyer')) signatureMove = 'Sovereign Verdict';

  // 8. Trust Factor
  const trustFactor = profile.is_verified ? 99 : 42;

  return {
    charisma,
    stamina,
    intellect,
    vibe,
    social,
    trustFactor,
    sobriquet: sobriquet.toUpperCase(),
    weightClass: weightClass.toUpperCase(),
    signatureMove: signatureMove.toUpperCase()
  };
};
