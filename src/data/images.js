/**
 * Dish8 — Image utilities
 *
 * Provides cuisine hero images and per-dish image URLs.
 *
 * Strategy:
 *   1. Cuisine hero/card images use hand-picked Unsplash photo URLs (free,
 *      no API key, hotlinking explicitly allowed by Unsplash).
 *   2. Individual dish images use Unsplash Source-style URLs with search
 *      keywords. As a fallback, LoremFlickr provides keyword-based food
 *      images with no authentication.
 *
 * All URLs are publicly accessible and require no API keys.
 *
 * Sources:
 *   - Unsplash (unsplash.com) — free license, hotlinking encouraged
 *   - LoremFlickr (loremflickr.com) — Creative Commons, no auth
 *   - Foodish API (foodish-api.com) — free, no auth, limited categories
 */

// ---------------------------------------------------------------------------
// 1. Cuisine hero / card images
//    Each URL points to a specific, high-quality Unsplash photo.
//    Format: https://images.unsplash.com/photo-{id}?w=800&h=500&fit=crop
//    The w/h/fit params let Unsplash CDN resize on the fly.
// ---------------------------------------------------------------------------

export const CUISINE_IMAGES = {
  italian:
    // Neapolitan pizza — classic Italian cuisine shot
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=500&fit=crop&q=80",

  chinese:
    // Dim sum dumplings in bamboo steamer
    "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&h=500&fit=crop&q=80",

  japanese:
    // Sushi platter — vibrant nigiri and maki
    "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&h=500&fit=crop&q=80",

  indian:
    // Colorful Indian curry spread with naan
    "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=500&fit=crop&q=80",

  mexican:
    // Loaded tacos with fresh toppings
    "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&h=500&fit=crop&q=80",

  thai:
    // Thai green curry in bowl
    "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=800&h=500&fit=crop&q=80",

  french:
    // Elegant French pastries and croissants
    "https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=800&h=500&fit=crop&q=80",

  korean:
    // Korean bibimbap in stone bowl
    "https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=800&h=500&fit=crop&q=80",

  vietnamese:
    // Pho noodle soup — aromatic broth with herbs
    "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&h=500&fit=crop&q=80",

  greek:
    // Greek salad with feta, olives, tomatoes
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=500&fit=crop&q=80",

  spanish:
    // Paella — colorful seafood rice
    "https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=800&h=500&fit=crop&q=80",

  lebanese:
    // Falafel plate with hummus and salad
    "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800&h=500&fit=crop&q=80",

  ethiopian:
    // Ethiopian injera with colorful stews
    "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&h=500&fit=crop&q=80",

  turkish:
    // Turkish kebab platter
    "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&h=500&fit=crop&q=80",

  moroccan:
    // Moroccan tagine — traditional clay pot
    "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=800&h=500&fit=crop&q=80",

  brazilian:
    // Brazilian churrasco / grilled meats
    "https://images.unsplash.com/photo-1558030006-450675393462?w=800&h=500&fit=crop&q=80",

  peruvian:
    // Ceviche — fresh seafood with lime
    "https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=800&h=500&fit=crop&q=80",

  caribbean:
    // Colorful Caribbean jerk chicken plate
    "https://images.unsplash.com/photo-1532465614-6cc8d45f647f?w=800&h=500&fit=crop&q=80",

  german:
    // Bratwurst with pretzel and mustard
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=500&fit=crop&q=80",
};

// ---------------------------------------------------------------------------
// 2. Cuisine-aware keyword map
//    Maps cuisine IDs to relevant search keywords that produce good results
//    when used with image search services.
// ---------------------------------------------------------------------------

const CUISINE_KEYWORDS = {
  italian: "italian",
  chinese: "chinese",
  japanese: "japanese",
  indian: "indian curry",
  mexican: "mexican",
  thai: "thai",
  french: "french cuisine",
  korean: "korean",
  vietnamese: "vietnamese",
  greek: "greek mediterranean",
  spanish: "spanish",
  lebanese: "lebanese middle eastern",
  ethiopian: "ethiopian",
  turkish: "turkish",
  moroccan: "moroccan",
  brazilian: "brazilian",
  peruvian: "peruvian",
  caribbean: "caribbean jamaican",
  german: "german",
};

// ---------------------------------------------------------------------------
// 3. Deterministic hash (for consistent images per dish name)
//    This ensures the same dish always gets the same image without needing
//    a server or API key.
// ---------------------------------------------------------------------------

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// ---------------------------------------------------------------------------
// 4. Well-known Unsplash photo IDs for common dish types
//    These are verified, high-quality food photos on Unsplash.
// ---------------------------------------------------------------------------

const DISH_PHOTO_MAP = {
  // Italian
  "bruschetta": "1572695157366-5e585ab2b69f",
  "caprese salad": "1592417817098-8fd3d9eb14a5",
  "arancini": "1565299624946-b28f40a0ae38",
  "spaghetti carbonara": "1612874742237-6526221588e3",
  "lasagna bolognese": "1574894709920-11b28e7367e3",
  "osso buco": "1544025162-d76694265947",
  "risotto ai funghi": "1476124369491-e7addf5db371",
  "margherita pizza": "1565299624946-b28f40a0ae38",
  "chicken parmigiana": "1632778149955-e80f8ceca2e8",
  "polenta": "1476124369491-e7addf5db371",
  "garlic bread": "1573140401552-3fab0b24306f",
  "panzanella": "1540189549336-e6e99c3679fe",

  // Chinese
  "spring rolls": "1563245372-f21724e3856d",
  "hot and sour soup": "1547592166-23ac45744acd",
  "dim sum platter": "1563245372-f21724e3856d",
  "kung pao chicken": "1525755662160-40a4fbc52728",
  "mapo tofu": "1547592166-23ac45744acd",
  "peking duck": "1518983498-d5bd36d1a6b3",
  "char siu pork": "1544025162-d76694265947",
  "chow mein": "1569718212165-3a8278d5f624",
  "sweet and sour pork": "1525755662160-40a4fbc52728",
  "fried rice": "1512058564366-18510be2db87",
  "stir-fried bok choy": "1540420773420-3366772f4999",
  "scallion pancakes": "1569718212165-3a8278d5f624",

  // Japanese
  "edamame": "1540420773420-3366772f4999",
  "miso soup": "1547592166-23ac45744acd",
  "gyoza": "1563245372-f21724e3856d",
  "chicken teriyaki": "1632778149955-e80f8ceca2e8",
  "tonkotsu ramen": "1569718212165-3a8278d5f624",
  "sushi platter": "1579871494447-9811cf80d66c",
  "wagyu steak": "1544025162-d76694265947",
  "tempura udon": "1569718212165-3a8278d5f624",
  "katsu curry": "1585937421612-70a008356fbe",
  "pickled ginger": "1540420773420-3366772f4999",
  "rice": "1512058564366-18510be2db87",
  "seaweed salad": "1540420773420-3366772f4999",

  // Indian
  "samosa": "1601050690597-df0568f70950",
  "pakora": "1601050690597-df0568f70950",
  "mulligatawny soup": "1547592166-23ac45744acd",
  "butter chicken": "1585937421612-70a008356fbe",
  "lamb biryani": "1563379091339-03b21ab4a4f8",
  "palak paneer": "1585937421612-70a008356fbe",
  "tandoori chicken": "1632778149955-e80f8ceca2e8",
  "chole bhature": "1601050690597-df0568f70950",
  "rogan josh": "1585937421612-70a008356fbe",
  "naan": "1573140401552-3fab0b24306f",
  "raita": "1540420773420-3366772f4999",
  "aloo gobi": "1585937421612-70a008356fbe",

  // Mexican
  "guacamole & chips": "1565299585323-38d6b0865b47",
  "queso fundido": "1565299585323-38d6b0865b47",
  "elote": "1565299585323-38d6b0865b47",
  "tacos al pastor": "1565299585323-38d6b0865b47",
  "chicken mole": "1565299585323-38d6b0865b47",
  "carnitas": "1544025162-d76694265947",
  "enchiladas verdes": "1565299585323-38d6b0865b47",
  "burrito bowl": "1565299585323-38d6b0865b47",
  "chiles rellenos": "1565299585323-38d6b0865b47",
  "mexican rice": "1512058564366-18510be2db87",
  "refried beans": "1565299585323-38d6b0865b47",
  "esquites": "1565299585323-38d6b0865b47",

  // Thai
  "tom yum goong": "1547592166-23ac45744acd",
  "satay skewers": "1555939594-58d7cb561ad1",
  "thai fish cakes": "1555939594-58d7cb561ad1",
  "pad thai": "1569718212165-3a8278d5f624",
  "green curry": "1562565652-a0d8f0c59eb4",
  "massaman curry": "1585937421612-70a008356fbe",
  "basil fried rice": "1512058564366-18510be2db87",
  "pad see ew": "1569718212165-3a8278d5f624",
  "khao soi": "1569718212165-3a8278d5f624",
  "papaya salad": "1540420773420-3366772f4999",
  "sticky rice": "1512058564366-18510be2db87",
  "thai iced tea": "1544145945-f90425340c7e",

  // French
  "french onion soup": "1547592166-23ac45744acd",
  "escargots": "1555939594-58d7cb561ad1",
  "pate en croute": "1555939594-58d7cb561ad1",
  "coq au vin": "1544025162-d76694265947",
  "duck confit": "1544025162-d76694265947",
  "beef bourguignon": "1544025162-d76694265947",
  "ratatouille": "1540420773420-3366772f4999",
  "bouillabaisse": "1547592166-23ac45744acd",
  "steak frites": "1544025162-d76694265947",
  "pommes dauphinoise": "1476124369491-e7addf5db371",
  "haricots verts": "1540420773420-3366772f4999",
  "salade lyonnaise": "1540189549336-e6e99c3679fe",

  // Korean
  "kimchi jeon": "1553163147-622ab57be1c7",
  "tteokbokki": "1553163147-622ab57be1c7",
  "korean fried chicken": "1632778149955-e80f8ceca2e8",
  "bibimbap": "1553163147-622ab57be1c7",
  "bulgogi": "1544025162-d76694265947",
  "japchae": "1569718212165-3a8278d5f624",
  "kimchi jjigae": "1547592166-23ac45744acd",
  "galbi": "1544025162-d76694265947",
  "sundubu jjigae": "1547592166-23ac45744acd",
  "kongnamul": "1540420773420-3366772f4999",
  "kimchi": "1553163147-622ab57be1c7",
  "japchae noodles": "1569718212165-3a8278d5f624",

  // Vietnamese
  "fresh spring rolls": "1563245372-f21724e3856d",
  "banh mi": "1573140401552-3fab0b24306f",
  "pho": "1582878826629-29b7ad1cdc43",
  "bun cha": "1569718212165-3a8278d5f624",
  "com tam": "1512058564366-18510be2db87",
  "bun bo hue": "1569718212165-3a8278d5f624",
  "ca kho to": "1518983498-d5bd36d1a6b3",
  "lemongrass chicken": "1632778149955-e80f8ceca2e8",
  "vietnamese coffee": "1544145945-f90425340c7e",
  "pickled vegetables": "1540420773420-3366772f4999",
  "jasmine rice": "1512058564366-18510be2db87",
  "morning glory": "1540420773420-3366772f4999",
};

// ---------------------------------------------------------------------------
// 5. Public exports — used by components
// ---------------------------------------------------------------------------

/**
 * Get the hero/card image URL for a cuisine.
 * Falls back to a generic food image if the cuisine is unknown.
 *
 * @param {string} cuisineId - e.g. "italian", "japanese"
 * @returns {string} Direct image URL
 */
export function getCuisineImageUrl(cuisineId) {
  return (
    CUISINE_IMAGES[cuisineId] ||
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=500&fit=crop&q=80"
  );
}

/**
 * Get an image URL for a specific dish.
 *
 * Resolution order:
 *   1. Check the hand-picked DISH_PHOTO_MAP for a known Unsplash photo ID
 *   2. Fall back to LoremFlickr with dish name + cuisine as keywords
 *      (deterministic via ?lock= so the same dish always shows the same image)
 *
 * @param {string} dishName  - e.g. "Spaghetti Carbonara"
 * @param {string} cuisineId - e.g. "italian"
 * @returns {string} Direct image URL
 */
export function getDishImageUrl(dishName, cuisineId) {
  const key = dishName.toLowerCase();

  // 1. Try hand-picked Unsplash photo
  if (DISH_PHOTO_MAP[key]) {
    return `https://images.unsplash.com/photo-${DISH_PHOTO_MAP[key]}?w=400&h=300&fit=crop&q=80`;
  }

  // 2. Fall back to LoremFlickr with keyword search
  //    The ?lock= parameter ensures deterministic results per dish name.
  const hash = simpleHash(key);
  const keywords = encodeURIComponent(
    `${dishName},${CUISINE_KEYWORDS[cuisineId] || "food"} food`
  );
  return `https://loremflickr.com/400/300/${keywords}?lock=${hash}`;
}

/**
 * Get a dish image URL with the Foodish API (limited categories).
 * Useful for random food images in specific categories.
 *
 * Available categories: biryani, burger, butter-chicken, dessert, dosa,
 * idly, pasta, pizza, rice, samosa
 *
 * @param {string} category - One of the available Foodish categories
 * @returns {string} API endpoint that returns JSON with { image: "url" }
 */
export function getFoodishApiUrl(category) {
  const validCategories = [
    "biryani", "burger", "butter-chicken", "dessert",
    "dosa", "idly", "pasta", "pizza", "rice", "samosa",
  ];
  const cat = validCategories.includes(category) ? category : "pizza";
  return `https://foodish-api.com/api/images/${cat}`;
}

/**
 * Fetch a random dish image from the Foodish API.
 * Returns a direct image URL string.
 *
 * @param {string} category - Foodish category name
 * @returns {Promise<string>} Direct image URL
 */
export async function fetchFoodishImage(category) {
  try {
    const res = await fetch(getFoodishApiUrl(category));
    const data = await res.json();
    return data.image;
  } catch {
    // Fallback to a generic food image
    return "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop&q=80";
  }
}
