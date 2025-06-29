const fs = require('fs');
const path = require('path');

// Read the flashcards file as text and parse it
const flashcardsPath = path.join(__dirname, '..', 'data', 'flashcards.js');
const flashcardsContent = fs.readFileSync(flashcardsPath, 'utf8');

// Extract the data using regex (simple approach)
const dataMatch = flashcardsContent.match(/export const flashcardsData = ({[\s\S]*?});/);
if (!dataMatch) {
  throw new Error('Could not extract flashcardsData from file');
}

// Use eval to get the data object (in CI environment this is safe)
const flashcardsData = eval('(' + dataMatch[1] + ')');

// Validation logic
let totalCards = 0;
let totalUnits = 0;

Object.entries(flashcardsData).forEach(([subject, data]) => {
  console.log(`📚 ${data.name}: ${data.units.length} units`);
  totalUnits += data.units.length;
  
  const subjectCards = data.units.reduce((sum, unit) => sum + unit.cards.length, 0);
  totalCards += subjectCards;
  console.log(`   📋 ${subjectCards} cards total`);
  
  // Validate structure
  data.units.forEach(unit => {
    if (!unit.cards || unit.cards.length === 0) {
      throw new Error(`Unit ${unit.name} has no cards`);
    }
    unit.cards.forEach(card => {
      if (!card.question || !card.answer) {
        throw new Error(`Invalid card in unit ${unit.name}`);
      }
    });
  });
});

console.log(`\n🎯 Summary:`);
console.log(`   📚 Total subjects: ${Object.keys(flashcardsData).length}`);
console.log(`   📖 Total units: ${totalUnits}`);
console.log(`   📋 Total cards: ${totalCards}`);
console.log(`✅ Data integrity check passed`);