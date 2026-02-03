import postgres from 'postgres';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const sql = postgres(connectionString);

// Parse Grammy data from grammys.txt
function parseGrammyData(content: string): { nominees: Set<string>, winners: Set<string> } {
  const nominees = new Set<string>();
  const winners = new Set<string>();
  
  const lines = content.split('\n');
  let currentCategory = '';
  let isWinnerLine = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line) continue;
    
    // Check if this is a category header (all caps or starts with "Best")
    if (line.match(/^[A-Z\s&,'/]+$/) || line.startsWith('Best ')) {
      currentCategory = line;
      isWinnerLine = true; // First entry after category is usually the winner
      continue;
    }
    
    // Extract artist names from the line
    // Pattern: "Song/Album Title" – Artist Name(s)
    const artistMatch = line.match(/["""]([^"""]+)["""]?\s*[–—-]\s*([^(]+)/);
    if (artistMatch) {
      const artistsPart = artistMatch[2].trim();
      
      // Split by common separators: &, featuring, and, with, ,
      const artistNames = artistsPart
        .split(/\s+(?:&|featuring|and|with|,)\s+/i)
        .map(name => name.trim())
        .filter(name => name.length > 0);
      
      artistNames.forEach(artist => {
        // Clean up artist name
        const cleanName = artist
          .replace(/\s+featuring.*$/i, '')
          .replace(/\s+\(.*\)$/, '')
          .trim();
        
        if (cleanName) {
          nominees.add(cleanName);
          if (isWinnerLine) {
            winners.add(cleanName);
          }
        }
      });
      
      isWinnerLine = false;
    }
    
    // Also check for artist names in parentheses at the end
    const parenMatch = line.match(/\(([^)]+)\)\s*$/);
    if (parenMatch) {
      const artistsPart = parenMatch[1];
      const artistNames = artistsPart
        .split(/\s+(?:&|featuring|and|with|,)\s+/i)
        .map(name => name.trim())
        .filter(name => name.length > 0 && !name.match(/^[A-Z]$/)); // Skip single letters
      
      artistNames.forEach(artist => {
        const cleanName = artist.trim();
        if (cleanName && cleanName.length > 2) {
          nominees.add(cleanName);
          if (isWinnerLine) {
            winners.add(cleanName);
          }
        }
      });
    }
  }
  
  return { nominees, winners };
}

// Normalize artist name for matching
function normali