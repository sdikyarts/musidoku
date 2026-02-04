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
function normalizeArtistName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function main() {
  try {
    // Read Grammy data file
    const grammyFilePath = path.join(process.cwd(), 'data', 'grammys.txt');
    
    if (!fs.existsSync(grammyFilePath)) {
      console.error('Grammy data file not found at:', grammyFilePath);
      process.exit(1);
    }
    
    const grammyContent = fs.readFileSync(grammyFilePath, 'utf-8');
    const { nominees, winners } = parseGrammyData(grammyContent);
    
    console.log(`Found ${nominees.size} nominees and ${winners.size} winners`);
    
    // Get all artists from database
    const artists = await sql`SELECT spotify_id, scraper_name FROM artists`;
    
    let nomineeCount = 0;
    let winnerCount = 0;
    
    // Match and update artists
    for (const artist of artists) {
      const normalizedDbName = normalizeArtistName(artist.scraper_name);
      
      let isNominee = false;
      let isWinner = false;
      
      // Check if artist is a nominee
      for (const nominee of nominees) {
        if (normalizeArtistName(nominee) === normalizedDbName) {
          isNominee = true;
          break;
        }
      }
      
      // Check if artist is a winner
      for (const winner of winners) {
        if (normalizeArtistName(winner) === normalizedDbName) {
          isWinner = true;
          break;
        }
      }
      
      // Update database if needed
      if (isNominee || isWinner) {
        await sql`
          UPDATE artists 
          SET 
            is_grammy_2026_nominee = ${isNominee},
            is_grammy_2026_winner = ${isWinner}
          WHERE spotify_id = ${artist.spotify_id}
        `;
        
        if (isNominee) nomineeCount++;
        if (isWinner) winnerCount++;
        
        console.log(`Updated ${artist.scraper_name}: nominee=${isNominee}, winner=${isWinner}`);
      }
    }
    
    console.log(`\nUpdated ${nomineeCount} nominees and ${winnerCount} winners in database`);
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

main();
