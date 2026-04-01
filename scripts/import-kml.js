/**
 * KML Importer for Wanderlist
 * 
 * Run: node scripts/import-kml.js path/to/your-map.kml
 * 
 * Requires: npm install @supabase/supabase-js
 */

const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

// Load env vars
require("dotenv").config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function parseKML(kmlContent) {
  const spots = [];
  
  // Extract folders (categories)
  const folderRegex = /<Folder>[\s\S]*?<name><!\[CDATA\[(.*?)\]\]><\/name>|<Folder>[\s\S]*?<name>(.*?)<\/name>/g;
  const placemarkRegex = /<Placemark>[\s\S]*?<\/Placemark>/g;
  
  // Split by folders
  const folderBlocks = kmlContent.split(/<Folder>/);
  
  for (const block of folderBlocks) {
    // Extract category name
    const nameMatch = block.match(/<name><!\[CDATA\[(.*?)\]\]><\/name>/) ||
                      block.match(/<name>(.*?)<\/name>/);
    if (!nameMatch) continue;
    
    const category = nameMatch[1].trim();
    
    // Extract placemarks
    const placemarks = block.match(/<Placemark>[\s\S]*?<\/Placemark>/g) || [];
    
    for (const placemark of placemarks) {
      // Extract name
      const spotNameMatch = placemark.match(/<name><!\[CDATA\[(.*?)\]\]><\/name>/) ||
                            placemark.match(/<name>(.*?)<\/name>/);
      if (!spotNameMatch) continue;
      
      const name = spotNameMatch[1].trim();
      
      // Extract coordinates
      const coordMatch = placemark.match(/<coordinates>\s*([-\d.]+),([-\d.]+)/);
      if (!coordMatch) continue;
      
      const longitude = parseFloat(coordMatch[1]);
      const latitude = parseFloat(coordMatch[2]);
      
      if (isNaN(latitude) || isNaN(longitude)) continue;
      
      spots.push({
        name,
        category,
        latitude,
        longitude,
        heart_count: 0,
      });
    }
  }
  
  return spots;
}

async function importSpots(kmlPath) {
  console.log(`Reading KML file: ${kmlPath}`);
  const kmlContent = fs.readFileSync(kmlPath, "utf-8");
  
  console.log("Parsing KML...");
  const spots = parseKML(kmlContent);
  console.log(`Found ${spots.length} spots`);
  
  // Remove duplicates by name + coordinates
  const unique = spots.filter((spot, index, self) =>
    index === self.findIndex(s => s.name === spot.name && s.latitude === spot.latitude)
  );
  console.log(`After dedup: ${unique.length} unique spots`);
  
  // Insert in batches of 100
  const batchSize = 100;
  let inserted = 0;
  
  for (let i = 0; i < unique.length; i += batchSize) {
    const batch = unique.slice(i, i + batchSize);
    const { error } = await supabase.from("spots").insert(batch);
    
    if (error) {
      console.error(`Error inserting batch ${i / batchSize + 1}:`, error.message);
    } else {
      inserted += batch.length;
      console.log(`Inserted ${inserted}/${unique.length} spots...`);
    }
  }
  
  console.log(`✅ Done! Imported ${inserted} spots into Supabase.`);
  
  // Print category summary
  const categories = {};
  unique.forEach(s => {
    categories[s.category] = (categories[s.category] || 0) + 1;
  });
  console.log("\nBy category:");
  Object.entries(categories).forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count} spots`);
  });
}

const kmlPath = process.argv[2];
if (!kmlPath) {
  console.error("Usage: node scripts/import-kml.js path/to/map.kml");
  process.exit(1);
}

importSpots(path.resolve(kmlPath)).catch(console.error);
