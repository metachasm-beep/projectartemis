import { calculateIntegrity } from './integrityCalculator';

describe('calculateIntegrity', () => {
  it('returns 0 for empty profile', () => {
    expect(calculateIntegrity({})).toBe(0);
  });

  it('calculates partial score correctly', () => {
    const profile = {
      full_name: 'Aspirant One', // 10
      city: 'Delhi',            // 10
      is_verified: false
    };
    expect(calculateIntegrity(profile)).toBe(20);
  });

  it('caps score at 100 for fully complete profile', () => {
    const profile = {
      full_name: 'Aspirant Perfect', // 10
      bio: 'This is a beautifully written bio that exceeds fifty characters easily to demonstrate high narrative integrity.', // 20
      city: 'Mumbai', // 10
      is_verified: true, // 30
      photos: ['https://example.com/photo1.jpg'], // 20
      occupation: 'Architect' // 10
      // Total = 100
    };
    expect(calculateIntegrity(profile)).toBe(100);
  });
});
