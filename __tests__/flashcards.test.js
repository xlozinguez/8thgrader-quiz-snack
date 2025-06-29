import { flashcardsData } from '../data/flashcards';

describe('Flashcards Data', () => {
  it('should have the correct structure', () => {
    expect(flashcardsData).toBeDefined();
    expect(typeof flashcardsData).toBe('object');
  });

  it('should contain civics and algebra subjects', () => {
    const subjects = Object.keys(flashcardsData);
    expect(subjects).toContain('civics');
    expect(subjects).toContain('algebra');
  });

  describe('Civics data', () => {
    const civics = flashcardsData.civics;

    it('should have the correct basic properties', () => {
      expect(civics.name).toBe('Civics');
      expect(civics.icon).toBe('🏛️');
      expect(civics.color).toBe('#2c3e50');
      expect(Array.isArray(civics.units)).toBe(true);
    });

    it('should have 9 units', () => {
      expect(civics.units).toHaveLength(9);
    });

    it('should have cards in each unit', () => {
      civics.units.forEach((unit, index) => {
        expect(unit.id).toBe(index + 1);
        expect(unit.name).toBeDefined();
        expect(Array.isArray(unit.cards)).toBe(true);
        expect(unit.cards.length).toBeGreaterThan(0);

        // Check card structure
        unit.cards.forEach(card => {
          expect(card.question).toBeDefined();
          expect(card.answer).toBeDefined();
          expect(typeof card.question).toBe('string');
          expect(typeof card.answer).toBe('string');
          expect(card.question.length).toBeGreaterThan(0);
          expect(card.answer.length).toBeGreaterThan(0);
        });
      });
    });

    it('should have approximately 180 total cards', () => {
      const totalCards = civics.units.reduce((total, unit) => total + unit.cards.length, 0);
      expect(totalCards).toBeCloseTo(180, -1); // Within 10 cards of 180
    });
  });

  describe('Algebra data', () => {
    const algebra = flashcardsData.algebra;

    it('should have the correct basic properties', () => {
      expect(algebra.name).toBe('Algebra');
      expect(algebra.icon).toBe('📐');
      expect(algebra.color).toBe('#8e44ad');
      expect(Array.isArray(algebra.units)).toBe(true);
    });

    it('should have 6 units', () => {
      expect(algebra.units).toHaveLength(6);
    });

    it('should have cards in each unit', () => {
      algebra.units.forEach((unit, index) => {
        expect(unit.id).toBe(index + 1);
        expect(unit.name).toBeDefined();
        expect(Array.isArray(unit.cards)).toBe(true);
        expect(unit.cards.length).toBeGreaterThan(0);

        // Check card structure
        unit.cards.forEach(card => {
          expect(card.question).toBeDefined();
          expect(card.answer).toBeDefined();
          expect(typeof card.question).toBe('string');
          expect(typeof card.answer).toBe('string');
          expect(card.question.length).toBeGreaterThan(0);
          expect(card.answer.length).toBeGreaterThan(0);
        });
      });
    });

    it('should have approximately 120 total cards', () => {
      const totalCards = algebra.units.reduce((total, unit) => total + unit.cards.length, 0);
      expect(totalCards).toBeCloseTo(120, -1); // Within 10 cards of 120
    });
  });

  it('should have unique unit IDs within each subject', () => {
    Object.values(flashcardsData).forEach(subject => {
      const unitIds = subject.units.map(unit => unit.id);
      const uniqueIds = new Set(unitIds);
      expect(uniqueIds.size).toBe(unitIds.length);
    });
  });

  it('should have non-empty questions and answers', () => {
    Object.values(flashcardsData).forEach(subject => {
      subject.units.forEach(unit => {
        unit.cards.forEach(card => {
          expect(card.question.trim()).not.toBe('');
          expect(card.answer.trim()).not.toBe('');
        });
      });
    });
  });
});