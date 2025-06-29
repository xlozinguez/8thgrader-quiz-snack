// Basic tests to verify app structure and data integrity
describe('8th Grade Quiz App', () => {
  it('should pass basic sanity check', () => {
    expect(true).toBe(true);
  });

  it('should import flashcards data', () => {
    const { flashcardsData } = require('../data/flashcards');
    expect(flashcardsData).toBeDefined();
    expect(typeof flashcardsData).toBe('object');
  });

  it('should have valid flashcard structure', () => {
    const { flashcardsData } = require('../data/flashcards');
    
    // Check that civics exists
    expect(flashcardsData.civics).toBeDefined();
    expect(flashcardsData.civics.name).toBe('Civics');
    expect(flashcardsData.civics.units).toBeDefined();
    expect(Array.isArray(flashcardsData.civics.units)).toBe(true);
    
    // Check that algebra exists
    expect(flashcardsData.algebra).toBeDefined();
    expect(flashcardsData.algebra.name).toBe('Algebra');
    expect(flashcardsData.algebra.units).toBeDefined();
    expect(Array.isArray(flashcardsData.algebra.units)).toBe(true);
  });

  it('should have cards in units', () => {
    const { flashcardsData } = require('../data/flashcards');
    
    // Check civics cards
    flashcardsData.civics.units.forEach(unit => {
      expect(unit.cards).toBeDefined();
      expect(Array.isArray(unit.cards)).toBe(true);
      expect(unit.cards.length).toBeGreaterThan(0);
      
      unit.cards.forEach(card => {
        expect(card.question).toBeDefined();
        expect(card.answer).toBeDefined();
        expect(typeof card.question).toBe('string');
        expect(typeof card.answer).toBe('string');
      });
    });
    
    // Check algebra cards
    flashcardsData.algebra.units.forEach(unit => {
      expect(unit.cards).toBeDefined();
      expect(Array.isArray(unit.cards)).toBe(true);
      expect(unit.cards.length).toBeGreaterThan(0);
      
      unit.cards.forEach(card => {
        expect(card.question).toBeDefined();
        expect(card.answer).toBeDefined();
        expect(typeof card.question).toBe('string');
        expect(typeof card.answer).toBe('string');
      });
    });
  });

  it('should have approximately correct number of cards', () => {
    const { flashcardsData } = require('../data/flashcards');
    
    const civicsTotal = flashcardsData.civics.units.reduce((total, unit) => total + unit.cards.length, 0);
    const algebraTotal = flashcardsData.algebra.units.reduce((total, unit) => total + unit.cards.length, 0);
    
    // Civics should have around 180 cards
    expect(civicsTotal).toBeGreaterThan(150);
    expect(civicsTotal).toBeLessThan(220);
    
    // Algebra should have around 120 cards
    expect(algebraTotal).toBeGreaterThan(100);
    expect(algebraTotal).toBeLessThan(150);
  });

  it('should be able to import App component', () => {
    // This will fail if there are syntax errors in App.js
    expect(() => {
      require('../App');
    }).not.toThrow();
  });

  it('should be able to import screen components', () => {
    // This will fail if there are syntax errors in the components
    expect(() => {
      require('../screens/HomeScreen');
      require('../screens/SubjectScreen');
      require('../screens/QuizScreen');
      require('../screens/ResultsScreen');
    }).not.toThrow();
  });
});