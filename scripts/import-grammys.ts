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

// Parse the grammys.txt file to extract nominees and winners
function parseGrammyFile(filePath: string): { nominees: Set<string>, winners: Set<string> } {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  const nominees = new Set<string>();
  const winners = new Set<string>();
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line) continue;
    
    // Skip category headers (lines that don't have quotes or WINNER prefix)
    if (!line.includes('"') && !line.startsWith('WINNER:') && !line.includes(',')) {
      continue;
    }
    
    let isWinner = false;
    let workingLine = line;
    
    // Check if this is a winner
    if (line.startsWith('WINNER:')) {
      isWinner = true;
      workingLine = line.replace('WINNER:', '').trim();
    }
    
    // Extract artists from the line
    // Format: "Song/Album Title," Artist1, Artist2 & Artist3
    // or: Album Title, Artist1, Artist2
    
    let artistsPart = '';
    
    // If line has quotes, extract everything after the closing quote
    if (workingLine.includes('"')) {
      const quoteEndIndex = workingLine.lastIndexOf('"');
      if (quoteEndIndex !== -1) {
        artistsPart = workingLine.substring(quoteEndIndex + 1).trim();
        // Remove leading comma if present
        if (artistsPart.startsWith(',')) {
          artistsPart = artistsPart.substring(1).trim();
        }
      }
    } else {
      // No quotes, so split by comma and take everything after first comma
      const parts = workingLine.split(',');
      if (parts.length > 1) {
        artistsPart = parts.slice(1).join(',').trim();
      }
    }
    
    if (!artistsPart) continue;
    
    // Split artists by common separators
    const artistList: string[] = [];
    
    // First split by " & " and ", "
    let tempArtists = [artistsPart];
    
    // Split by " & "
    tempArtists = tempArtists.flatMap(a => a.split(' & '));
    
    // Split by ", " but be careful with commas in names
    tempArtists = tempArtists.flatMap(a => {
      // Only split if there's a clear artist separator
      if (a.includes(', ') && !a.match(/^[A-Z][a-z]+, [A-Z][a-z]+$/)) {
        return a.split(', ');
      }
      return [a];
    });
    
    // Clean up each artist name
    for (let artist of tempArtists) {
      artist = artist.trim();
      
      // Remove "featuring" and everything after
      artist = artist.split(/\s+featuring\s+/i)[0];
      artist = artist.split(/\s+feat\.\s+/i)[0];
      artist = artist.split(/\s+ft\.\s+/i)[0];
      
      // Remove parenthetical content
      artist = artist.replace(/\s*\[.*?\]\s*/g, '').trim();
      artist = artist.replace(/\s*\(.*?\)\s*/g, '').trim();
      
      // Skip if empty or too long
      if (!artist || artist.length < 2 || artist.length > 100) continue;
      
      // Skip common non-artist words
      if (['and', 'the', 'various artists', 'cast'].includes(artist.toLowerCase())) continue;
      
      artistList.push(artist);
    }
    
    // Add to appropriate sets
    for (const artist of artistList) {
      nominees.add(artist);
      if (isWinner) {
        winners.add(artist);
      }
    }
  }
  
  return { nominees, winners };
}

async function importGrammyData() {
  try {
    console.log('Parsing grammys.txt...');
    const grammyFilePath = path.join(process.cwd(), 'grammys.txt');
    const { nominees, winners } = parseGrammyFile(grammyFilePath);
    
    console.log(`Found ${nominees.size} unique nominees`);
    console.log(`Found ${winners.size} unique winners`);
    
    // Reset all Grammy fields first
    await sql`UPDATE artists SET is_grammy_2026_nominee = false, is_grammy_2026_winner = false`;
    
    // Get all artists from database
    const allArtists = await sql`SELECT spotify_id, scraper_name FROM artists`;
    console.log(`Total artists in database: ${allArtists.length}`);
    
    let nomineeMatches = 0;
    let winnerMatches = 0;
    
    // Match artists by name (case-insensitive, fuzzy matching)
    for (const artist of allArtists) {
      const artistName = artist.scraper_name.toLowerCase().trim();
      
      let isNominee = false;
      let isWinner = false;
      
      // Check for exact or partial matches
      for (const nominee of nominees) {
        const nomineeName = nominee.toLowerCase().trim();
        if (artistName === nomineeName || 
            artistName.includes(nomineeName) || 
            nomineeName.includes(artistName)) {
          isNominee = true;
          break;
        }
      }
      
      for (const winner of winners) {
        const winnerName = winner.toLowerCase().trim();
        if (artistName === winnerName || 
            artistName.includes(winnerName) || 
            winnerName.includes(artistName)) {
          isWinner = true;
          break;
        }
      }
      
      // Update the artist if they're a nominee or winner
      if (isNominee || isWinner) {
        await sql`
          UPDATE artists 
          SET is_grammy_2026_nominee = ${isNominee},
              is_grammy_2026_winner = ${isWinner}
          WHERE spotify_id = ${artist.spotify_id}
        `;
        
        if (isNominee) nomineeMatches++;
        if (isWinner) winnerMatches++;
        
        console.log(`✓ ${artist.scraper_name}: nominee=${isNominee}, winner=${isWinner}`);
      }
    }
    
    console.log(`\n✅ Import complete!`);
    console.log(`   Matched ${nomineeMatches} nominees`);
    console.log(`   Matched ${winnerMatches} winners`);
    
  } catch (error) {
    console.error('Error importing Grammy data:', error);
  } finally {
    await sql.end();
  }
}

importGrammyData();
