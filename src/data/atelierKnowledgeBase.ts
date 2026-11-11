/**
 * BASAVA Atelier — Master Leathercraft Encyclopedic Knowledge Base & Agent Training Corpus
 * Handcrafted in Bengaluru, Bharat.
 * 
 * This repository serves as the definitive, encyclopedic domain knowledge base
 * powering "The Bespoke Designer" AI consultation assistant and custom leather studio.
 */

export interface LeatherGradeSpec {
  id: string;
  name: string;
  kannadaName: string;
  thickness: string;
  tanningMethod: string;
  tanneryRegion: string;
  botanicalTannins: string;
  fiberDensity: string;
  characteristics: string;
  agingBehavior: string;
  tensileStrength: string;
  idealFor: string[];
  careRecommendation: string;
}

export interface SilhouetteSpec {
  style: string;
  title: string;
  kannadaTitle: string;
  dimensionsCm: { width: number; height: number; depth: number };
  handleDropCm?: number;
  strapLengthCm?: number;
  deviceFit: string;
  weightGrams: number;
  recommendedLeather: string;
  internalVolumeLiters: number;
  ergonomicNotes: string;
  hardwareFittings: string[];
}

export interface TanneryRegionSpec {
  region: string;
  state: string;
  heritage: string;
  specialty: string;
  sustainableProcess: string;
}

export interface DeviceSpec {
  name: string;
  dimensionsMm: { length: number; width: number; thickness: number };
  recommendedBagStyles: string[];
  minimumPocketWidthCm: number;
}

export const ATELIER_PHILOSOPHY = {
  brand: "BASAVA",
  tagline: "Rooted in craft. Made for living.",
  kannadaBrand: "ಬಸವ",
  location: "Bengaluru, Karnataka, India",
  workshopHeritage: "Artisanal leathercraft atelier blending ancient Vijayanagara saddlery techniques with modern Scandinavian architectural geometry.",
  guidingPrinciples: [
    "Zero synthetic substrates: Absolutely no PU, PVC, bonded leather, or pleather; 100% genuine hides harvested strictly as agricultural and food by-products.",
    "Eco-conscious botanical pit tanning: Slow 30-to-45 day infusion using Acacia nilotica (babul bark) and Terminalia chebula (myrobalan/harda nuts), preserving Kaveri and Palar riverways from heavy metal pollutants.",
    "Dual-needle traditional saddle stitching: Hand-punched with diamond awls at 45° angles, sewn with high-twist Lin Câblé linen thread sealed in wild Nilgiri forest beeswax.",
    "Solid sand-cast Moradabad brass metallurgy: 100% virgin copper-zinc alloy cast in green sand molds; never pot-metal zinc alloys that snap, chip, or flake.",
    "Heirloom personalization: 24K hot-stamped gold foil or deep blind heat-compressed monogramming using hand-cast brass typography.",
    "Internal structural longevity: Handspun 240 GSM organic Khadi cotton and Mysore mulberry silk linings that breathe and never delaminate.",
  ],
  turnaroundTime: "Catalogue collection: 5–8 business days; Bespoke custom commissions: 10–14 business days.",
  pricePhilosophy: "Fair-wage transparent workshop pricing directly connecting discerning patrons with master leather crafters without luxury retail markups.",
};

export const TANNERY_REGIONS: Record<string, TanneryRegionSpec> = {
  ambur_vaniyambadi: {
    region: "Ambur & Vaniyambadi (Palar Valley)",
    state: "Tamil Nadu",
    heritage: "Over 160 years of vegetable tanning heritage dating back to the mid-19th century.",
    specialty: "Full-grain aniline steerhide and wattle-tanned calfskin with exceptional supple drape.",
    sustainableProcess: "Zero Liquid Discharge (ZLD) closed-loop water treatment, powered by solar arrays.",
  },
  ranipet_dindigul: {
    region: "Ranipet & Dindigul",
    state: "Tamil Nadu",
    heritage: "Historic center for heavy bark tanning using native Acacia nilotica (babul) tree bark.",
    specialty: "High-density heavy bridle leather, belt strapping, and firm structured satchel panel hides.",
    sustainableProcess: "100% botanical pit leaching; zero synthetic phenolics or chromium compounds.",
  },
  mysore_hunsur: {
    region: "Mysore & Hunsur",
    state: "Karnataka",
    heritage: "Royal saddlery suppliers to the Mysore Kingdom's royal cavalry and palanquins.",
    specialty: "Hot-stuffed oil pull-up hides saturated with cold-pressed castor, neem, and Nilgiri beeswax.",
    sustainableProcess: "Small-batch drum conditioning using indigenous botanical oils and solar drying.",
  },
  kanpur_jalandhar: {
    region: "Kanpur & Jalandhar",
    state: "Uttar Pradesh & Punjab",
    heritage: "North Indian heavy saddlery and equestrian harness leather tradition.",
    specialty: "Thick 3.5mm–4.0mm heavy full-grain steerhide for reinforced bag bottoms and load-bearing handles.",
    sustainableProcess: "Natural pit aging in oak-bark and quebracho liquor over 60 continuous days.",
  },
};

export const HIDE_ANATOMY_SCIENCE = {
  layers: [
    {
      name: "Epidermis & Papillary Grain (Topmost Layer)",
      description: "The outermost natural surface containing intact hair follicle patterns, natural oil glands, and dense collagen mesh.",
      significance: "Provides 100% of the bag's scratch resistance, water repellent barrier, and unique patina development capacity.",
    },
    {
      name: "Corium Junction (Sub-Grain Layer)",
      description: "The transition zone where dense grain fibers weave diagonally into the larger collagen bundles of the corium.",
      significance: "Determines grain break. In premium full-grain, bending produces tight, micro-wrinkles; loose grain creates coarse bagging.",
    },
    {
      name: "Reticular Corium (Deep Core)",
      description: "Thick, multidirectional collagen protein bundles offering enormous tensile strength (up to 250 kg/cm²).",
      significance: "Prevents tears under heavy loads (e.g. 16\" laptops, camera gear, and travel contents).",
    },
    {
      name: "Flesh Layer (Sueded Underside)",
      description: "The fibrous inner back, split or skived to exact precision gauges depending on the bag panel component.",
      significance: "Calipers: 0.8 mm for card slots & linings, 1.2 mm for accordion gussets, 1.8–2.2 mm for exterior body panels, 3.8 mm for handles.",
    },
  ],
  grainTest: "The Finger Break Test: When genuine vegetable full-grain leather is curved inwards, fine microscopic wrinkle lines appear that instantly vanish when released. Cheap split or corrected leather will wrinkle like cardboard or crack.",
  naturalMarkings: [
    "Neck growth wrinkles: Evidence of the hide's natural movement; adds textural character to bag flaps.",
    "Healed briar scratches: Minor healed thorn marks in the wild pasture; hallmark of unadulterated full-grain.",
    "Fat lines: Wavy striations formed by the hide's natural fat reserves; visible on authentic pull-up leathers.",
  ],
};

export const LEATHER_GRADES: Record<string, LeatherGradeSpec> = {
  "full-grain": {
    id: "full-grain",
    name: "Full-Grain Heirloom Leather (Purna Charma)",
    kannadaName: "ಪೂರ್ಣ-ಧಾನ್ಯದ ಚರ್ಮ",
    thickness: "1.8 mm – 2.2 mm (Body) / 3.8 mm (Straps)",
    tanningMethod: "Slow 45-day botanical pit tanning in babul bark and Indian myrobalan nut liquor.",
    tanneryRegion: "Ambur & Ranipet, Palar Valley",
    botanicalTannins: "Acacia nilotica (Babul) + Terminalia chebula (Harda)",
    fiberDensity: "Maximum (100% intact papillary collagen matrix)",
    tensileStrength: "Exceeds 250 kg/cm² load capacity",
    characteristics: "The uncorrected topmost layer of the hide with complete natural hair pores and follicle formations intact. Extremely resilient, breathes dynamically, and exhibits luxurious structural weight.",
    agingBehavior: "Develops an aristocratic, deeply saturated amber patina over 5 to 25 years. Deepens in tone from skin contact, sunlight, and humidity, self-healing surface scuffs with natural oils.",
    idealFor: ["Executive Briefcases", "Heritage Daily Carryall Totes", "45L Weekender Duffles", "Architectural Structured Satchels"],
    careRecommendation: "Nourish every 4–6 months with organic Nilgiri beeswax and lanolin balm. Buff with natural horsehair brush.",
  },
  "top-grain": {
    id: "top-grain",
    name: "Top-Grain Fine Leather (Shuddha Charma)",
    kannadaName: "ಉನ್ನತ ದರ್ಜೆಯ ನಯವಾದ ಚರ್ಮ",
    thickness: "1.4 mm – 1.6 mm",
    tanningMethod: "Semi-vegetable drum tanning with micro-buffed surface and natural carnauba wax seal.",
    tanneryRegion: "Vaniyambadi, Tamil Nadu",
    botanicalTannins: "Mimosa wattle extract + gentle vegetable oils",
    fiberDensity: "High (approx. 85% of full-grain)",
    tensileStrength: "Exceeds 180 kg/cm² load capacity",
    characteristics: "Subtly leveled outer grain producing a remarkably uniform, silky hand-feel and consistent color saturation while preserving genuine leather breathability.",
    agingBehavior: "Ages gracefully with gentle darkening; maintains clean crisp architectural lines without stretching or sagging across years of daily use.",
    idealFor: ["Structured Top-Handle Handbags", "Minimalist Work Satchels", "Sleek Evening Clutches", "Accordion Wallets"],
    careRecommendation: "Wipe with soft lint-free microfiber cloth; apply lightweight emulsion leather cream once annually.",
  },
  "pull-up": {
    id: "pull-up",
    name: "Mysore Oil Pull-Up Leather (Taila Charma)",
    kannadaName: "ಮೈಸೂರು ಎಣ್ಣೆ ಪುಲ್-ಅಪ್ ಚರ್ಮ",
    thickness: "1.8 mm – 2.0 mm",
    tanningMethod: "Hot-stuffed in heated wooden drums with melted Nilgiri beeswax, cold-pressed castor, and organic oils.",
    tanneryRegion: "Mysore & Hunsur, Karnataka",
    botanicalTannins: "Acacia bark + Castor oil + Pure beeswax",
    fiberDensity: "Very High (oil-conditioned fibers glide without friction)",
    tensileStrength: "Exceeds 220 kg/cm² load capacity",
    characteristics: "When folded, flexed, or pulled, the internal oils displace across the collagen fibers, revealing dynamic lighter undertones and authentic vintage marbling. Highly tactile.",
    agingBehavior: "Rapid, glorious patina development. Light scuffs, fingernail marks, and creases buff out instantly under finger friction and body heat.",
    idealFor: ["Urban Explorer Slings", "Field Messenger Bags", "Vintage Laptop Carriers", "Passport Travel Organizers"],
    careRecommendation: "Minimal intervention needed. Simply rub surface scuffs with thumb pressure to draw up underlying oils.",
  },
  "suede": {
    id: "suede",
    name: "Nilgiri Velvet Suede & Roughout",
    kannadaName: "ವೆಲ್ವೆಟ್ ಸ್ಯೂಡ್ ಚರ್ಮ",
    thickness: "1.2 mm – 1.4 mm",
    tanningMethod: "Fine-buffed flesh split conditioned with vegetable protein binders.",
    tanneryRegion: "Ranipet & Ambur",
    botanicalTannins: "Wattle bark extract",
    fiberDensity: "Medium-Fine (plush open-fiber nap)",
    tensileStrength: "Exceeds 130 kg/cm² load capacity",
    characteristics: "Plush, velvety nap with deep matte light absorption. Rich, warm hand-feel that offers dramatic visual contrast when paired with polished full-grain panels.",
    agingBehavior: "Softens luxuriously; develops an authentic burnished glaze along high-contact seams, corners, and flap edges.",
    idealFor: ["Contrast Side Gussets", "Interior Pocket Linings", "Evening Wristlets", "Slouchy Shoulder Hobo Bags"],
    careRecommendation: "Brush with brass suede brush to restore nap. Protect with fluorocarbon-free botanical water repellent spray.",
  },
  "canvas-leather": {
    id: "canvas-leather",
    name: "Heavy 18oz Duck Canvas & Bridle Leather Hybrid",
    kannadaName: "ಕ್ಯಾನ್ವಾಸ್ ಮತ್ತು ಚರ್ಮದ ಜೋಡಿ",
    thickness: "18 oz Organic Cotton Duck + 3.5 mm Heavy Saddle Leather Straps",
    tanningMethod: "Waterproof paraffin-waxed cotton canvas paired with babul pit-tanned full-grain steerhide.",
    tanneryRegion: "Bengaluru Loom & Ranipet Tannery",
    botanicalTannins: "Acacia bark (for leather trims)",
    fiberDensity: "Dual-medium heavy hybrid weave",
    tensileStrength: "Exceeds 300 kg/cm² combined tensile resistance",
    characteristics: "Ultralight, monsoon-ready hybrid construction combining the waterproof durability of waxed canvas with the architectural backbone of full-grain saddle leather.",
    agingBehavior: "Canvas develops timeless wabi-sabi marbling creases; leather handles and corners deepen into dark amber patinas.",
    idealFor: ["Monsoon Tech Briefcases", "Expedition Weekender Duffles", "Daily Cycling Backpacks", "Field Satchels"],
    careRecommendation: "Spot clean canvas with cold water; do not wash with detergents. Condition leather strapping twice yearly.",
  },
};

export const SILHOUETTE_SPECS: Record<string, SilhouetteSpec> = {
  laptop: {
    style: "laptop",
    title: "Executive Laptop Briefcase / Tech Carrier",
    kannadaTitle: "ತಾಂತ್ರಿಕ ಲ್ಯಾಪ್ಟಾಪ್ ಬ್ರೀಫ್ಕೇಸ್",
    dimensionsCm: { width: 39, height: 29, depth: 8.5 },
    handleDropCm: 12,
    strapLengthCm: 125,
    deviceFit: "Engineered specifically for 14\" and 16\" MacBook Pro, 15.6\" Dell XPS, 13\" iPad Pro with Magic Keyboard, charger brick, notebook, and passport.",
    weightGrams: 980,
    internalVolumeLiters: 9.6,
    recommendedLeather: "Full-Grain or Mysore Pull-Up in Dark Chocolate Brown or Midnight Onyx Black",
    ergonomicNotes: "Dual hand-rolled leather handles eliminate palm fatigue; detachable 40mm wide padded shoulder strap distributes 5kg tech load across the shoulder clavicle.",
    hardwareFittings: ["Solid brass #8 YKK Excella zipper", "Moradabad cast D-rings", "Tensile swivel trigger snaps", "4 solid base feet"],
  },
  tote: {
    style: "tote",
    title: "Heritage Carryall Daily Tote",
    kannadaTitle: "ಕ್ಯಾರಿಯಾಲ್ ಹೆರಿಟೇಜ್ ಟೋಟ್ ಬ್ಯಾಗ್",
    dimensionsCm: { width: 38, height: 32, depth: 13 },
    handleDropCm: 25,
    strapLengthCm: 0,
    deviceFit: "Fits 13\"/14\" MacBook Pro vertically or horizontally, 1-litre water canteen, umbrella, hardcover book, cosmetic organizer, and sunglasses.",
    weightGrams: 780,
    internalVolumeLiters: 15.8,
    recommendedLeather: "Full-Grain or Top-Grain in Royal Saddle Tan or Mysore Cognac",
    ergonomicNotes: "Generous 25 cm shoulder drop fits comfortably over heavy winter blazers or coats without slipping off the shoulder.",
    hardwareFittings: ["Cast brass bridge rivets", "Hanging artisan medallion", "Reinforced brass magnetic bridge clasp", "4 protective base studs"],
  },
  crossbody: {
    style: "crossbody",
    title: "Structured Everyday Crossbody",
    kannadaTitle: "ಪ್ರತಿದಿನದ ಕ್ರಾಸ್‌ಬಾಡಿ ಬ್ಯಾಗ್",
    dimensionsCm: { width: 24, height: 18, depth: 7 },
    handleDropCm: 0,
    strapLengthCm: 120,
    deviceFit: "Fits all modern smartphones (iPhone 16 Pro Max / Galaxy S24 Ultra), continental leather wallet, AirPods Pro, passport, keys, and lip balm.",
    weightGrams: 420,
    internalVolumeLiters: 3.0,
    recommendedLeather: "Top-Grain or Nilgiri Suede in Mysore Cognac or Imperial Burgundy",
    ergonomicNotes: "7-hole adjustable brass roller buckle strap allows seamless transition from hip carry to high chest placement.",
    hardwareFittings: ["Sand-cast brass turn-lock clasp", "Solid D-rings", "Brass adjustment roller buckle"],
  },
  sling: {
    style: "sling",
    title: "Minimalist Urban Chest Sling",
    kannadaTitle: "ನಗರ ಎದೆಯ ಸ್ಲಿಂಗ್ ಬ್ಯಾಗ್",
    dimensionsCm: { width: 18, height: 30, depth: 6 },
    handleDropCm: 0,
    strapLengthCm: 110,
    deviceFit: "Accommodates iPad Mini / Kindle Oasis, smartphone, magnetic power bank, leather card sleeve, key fob, and earbuds.",
    weightGrams: 360,
    internalVolumeLiters: 3.2,
    recommendedLeather: "Mysore Pull-Up or Textured Leather in Nilgiri Olive Green or Midnight Onyx Black",
    ergonomicNotes: "Dual ambidextrous lower brass D-rings permit instant clipping for left-shoulder or right-shoulder diagonal cross-body carry.",
    hardwareFittings: ["Heavy gauge diagonal brass zipper", "Cast swivel clip", "Ergonomic leather strap keeper"],
  },
  handbag: {
    style: "handbag",
    title: "Architectural Top-Handle Satchel",
    kannadaTitle: "ಶಿಲ್ಪಕಲೆಯ ಕೈಚೀಲ",
    dimensionsCm: { width: 30, height: 23, depth: 11 },
    handleDropCm: 10,
    strapLengthCm: 115,
    deviceFit: "iPad 11\", continental wallet, sunglasses hardcase, cosmetics pouch, car keys, and smartphone.",
    weightGrams: 640,
    internalVolumeLiters: 7.6,
    recommendedLeather: "Top-Grain Smooth Leather in Royal Saddle Tan or Hampi Sand Beige",
    ergonomicNotes: "Molded leather base with 4 solid brass purse feet prevents leather abrasion when resting on marble, granite, or wood surfaces.",
    hardwareFittings: ["Sand-cast brass handle arches", "Concealed magnetic lock", "Detachable strap trigger clasps", "4 dome purse feet"],
  },
  shoulder: {
    style: "shoulder",
    title: "Relaxed Contoured Shoulder Hobo",
    kannadaTitle: "ಸಡಿಲ ಹೆಗಲಿನ ಬ್ಯಾಗ್",
    dimensionsCm: { width: 34, height: 28, depth: 10 },
    handleDropCm: 22,
    strapLengthCm: 0,
    deviceFit: "13\" MacBook Air, tablet, makeup clutch, reading glasses, notebook, and smartphone.",
    weightGrams: 590,
    internalVolumeLiters: 9.5,
    recommendedLeather: "Mysore Pull-Up or Top-Grain Leather in Mysore Cognac or Dark Chocolate Brown",
    ergonomicNotes: "Anatomically curved crescent base conforms naturally against the ribcage and hip when walking.",
    hardwareFittings: ["Solid brass side O-rings", "Top recessed zipper", "Interior zipper pull"],
  },
  messenger: {
    style: "messenger",
    title: "Heritage Postman Satchel / Messenger",
    kannadaTitle: "ಪಾರಂಪರಿಕ ಸಂದೇಶವಾಹಕ ಚೀಲ",
    dimensionsCm: { width: 38, height: 28, depth: 10 },
    handleDropCm: 5,
    strapLengthCm: 130,
    deviceFit: "15\" laptop, A4 document portfolios, hardcover books, tech accessories, and thermal flask.",
    weightGrams: 1050,
    internalVolumeLiters: 10.6,
    recommendedLeather: "Full-Grain Saddle Leather in Royal Saddle Tan or Dark Chocolate Brown",
    ergonomicNotes: "Wide 45mm leather strap with padded sliding shoulder rest balances heavy academic or office loads.",
    hardwareFittings: ["Dual front brass quick-release push clips behind decorative roller buckles", "Rear trolley pass-through strap"],
  },
  clutch: {
    style: "clutch",
    title: "Fold-Over Envelope Dinner Clutch",
    kannadaTitle: "ಹೊದಿಕೆ ಮಾದರಿಯ ಕ್ಲಚ್",
    dimensionsCm: { width: 26, height: 16, depth: 3.5 },
    handleDropCm: 0,
    strapLengthCm: 18,
    deviceFit: "iPhone 16 Pro Max, cardholder, lipstick, compact mirror, car keys, and mints.",
    weightGrams: 230,
    internalVolumeLiters: 1.4,
    recommendedLeather: "Smooth Top-Grain or Mysore Mulberry Silk Lined in Imperial Burgundy or Midnight Onyx Black",
    ergonomicNotes: "Detachable wristlet strap loops seamlessly onto solid brass D-ring for hands-free cocktail receptions.",
    hardwareFittings: ["Solid brass magnetic envelope snap", "Miniature brass wristlet D-ring", "Solid brass zipper pull"],
  },
  wristlet: {
    style: "wristlet",
    title: "Artisanal Zip Wristlet Wallet",
    kannadaTitle: "ಕೈಗವಸು ಜಿಪ್ ವಾಲೆಟ್",
    dimensionsCm: { width: 21, height: 12, depth: 2 },
    handleDropCm: 0,
    strapLengthCm: 16,
    deviceFit: "Smartphone, 6 credit cards, currency bills, coins, keys, and lip balm.",
    weightGrams: 160,
    internalVolumeLiters: 0.5,
    recommendedLeather: "Full-Grain or Mysore Pull-Up in Royal Saddle Tan or Nilgiri Olive Green",
    ergonomicNotes: "Fits comfortably inside larger carryall totes or clips onto belt loops.",
    hardwareFittings: ["#5 YKK Excella brass zipper", "Solid brass swivel clip", "Brass key ring"],
  },
  travel: {
    style: "travel",
    title: "Artisanal 45-Litre Weekender Duffle",
    kannadaTitle: "45-ಲೀಟರ್ ವೀಕೆಂಡರ್ ಪ್ರಯಾಣದ ಚೀಲ",
    dimensionsCm: { width: 52, height: 30, depth: 25 },
    handleDropCm: 16,
    strapLengthCm: 135,
    deviceFit: "3–4 days of clothing, two pairs of shoes in dedicated compartment, 16\" laptop, toiletry kit, cables, and books.",
    weightGrams: 1650,
    internalVolumeLiters: 39.0,
    recommendedLeather: "Full-Grain Saddle Leather or Canvas-Leather Hybrid in Royal Saddle Tan",
    ergonomicNotes: "Reinforced luggage trolley pass-through strap fits over rolling suitcase handles; heavy-duty strap pad.",
    hardwareFittings: ["Two-way heavy #10 brass zipper", "Reinforced cast D-rings", "Heavy swivel trigger clasps", "6 solid base feet"],
  },
  backpack: {
    style: "backpack",
    title: "Executive Minimalist Leather Backpack",
    kannadaTitle: "ಕಾರ್ಯನಿರ್ವಾಹಕ ಚರ್ಮದ ಬ್ಯಾಕ್‌ಪ್ಯಾಕ್",
    dimensionsCm: { width: 30, height: 40, depth: 14 },
    handleDropCm: 6,
    strapLengthCm: 85,
    deviceFit: "16\" MacBook Pro, tablet, tech cable organizer, notebook, sunglasses, 1L water bottle, and light jacket.",
    weightGrams: 1100,
    internalVolumeLiters: 16.8,
    recommendedLeather: "Full-Grain Dark Chocolate Brown with breathable Khadi padded back panel",
    ergonomicNotes: "Anatomically contoured S-curve leather shoulder straps prevent neck pinch during long metro commutes.",
    hardwareFittings: ["Two-way brass zip track", "Adjustable strap brass slides", "Top grab handle rivets", "Hidden anti-theft back pocket zip"],
  },
  custom: {
    style: "custom",
    title: "Bespoke Atelier Commission",
    kannadaTitle: "ಗ್ರಾಹಕರ ಅಗತ್ಯಕ್ಕೆ ತಕ್ಕಂತೆ ತಯಾರಿಸಿದ ಚೀಲ",
    dimensionsCm: { width: 32, height: 26, depth: 10 },
    handleDropCm: 15,
    strapLengthCm: 120,
    deviceFit: "Engineered to client's exact device and daily carrying specifications.",
    weightGrams: 800,
    internalVolumeLiters: 8.3,
    recommendedLeather: "Full-Grain Purna Charma in client's chosen heritage shade",
    ergonomicNotes: "Tailored to client's stature, shoulder slope, and carrying ergonomics.",
    hardwareFittings: ["Hand-selected solid brass hardware suite", "Personalized artisan plate"],
  },
};

export const DEVICE_SIZING_MATRIX: Record<string, DeviceSpec> = {
  macbook_pro_14: {
    name: "Apple MacBook Pro 14\" (M1/M2/M3/M4)",
    dimensionsMm: { length: 312.6, width: 221.2, thickness: 15.5 },
    recommendedBagStyles: ["laptop", "tote", "messenger", "backpack"],
    minimumPocketWidthCm: 34,
  },
  macbook_pro_16: {
    name: "Apple MacBook Pro 16\" (M1/M2/M3/M4)",
    dimensionsMm: { length: 355.7, width: 248.1, thickness: 16.8 },
    recommendedBagStyles: ["laptop", "backpack", "messenger", "travel"],
    minimumPocketWidthCm: 38,
  },
  macbook_air_13: {
    name: "Apple MacBook Air 13\" (M2/M3)",
    dimensionsMm: { length: 304.1, width: 215.0, thickness: 11.3 },
    recommendedBagStyles: ["laptop", "tote", "shoulder", "backpack", "messenger"],
    minimumPocketWidthCm: 33,
  },
  dell_xps_15: {
    name: "Dell XPS 15 / XPS 16",
    dimensionsMm: { length: 358.0, width: 240.0, thickness: 18.0 },
    recommendedBagStyles: ["laptop", "backpack", "messenger"],
    minimumPocketWidthCm: 38.5,
  },
  thinkpad_x1: {
    name: "Lenovo ThinkPad X1 Carbon 14\"",
    dimensionsMm: { length: 315.6, width: 222.5, thickness: 15.3 },
    recommendedBagStyles: ["laptop", "tote", "backpack", "messenger"],
    minimumPocketWidthCm: 34.5,
  },
  ipad_pro_13: {
    name: "Apple iPad Pro 13\" (with Magic Keyboard)",
    dimensionsMm: { length: 281.6, width: 215.5, thickness: 14.5 },
    recommendedBagStyles: ["laptop", "tote", "handbag", "shoulder", "backpack"],
    minimumPocketWidthCm: 31,
  },
};

export const SADDLE_STITCH_SPEC = {
  technique: "Traditional Two-Needle Hand Saddle Stitch (French: Cousu Sellier)",
  distinctionVsMachine: "In a sewing machine lockstitch, two threads loop together in the middle. If one stitch is severed, the entire seam unravels continuously like a zipper. In BASAVA's traditional two-needle hand saddle stitch, two independent needles pass through the exact same hole from opposite directions, forming a locked figure-eight knot. Even if one stitch is completely severed, the opposite thread holds the seam firmly under tension indefinitely.",
  thread: "Lin Câblé Waxed French Linen Thread #532 (0.63 mm) or #432 (0.80 mm)",
  waxFormula: "100% natural wild Nilgiri forest beeswax hand-drawn across raw flax fibers to lubricate passage and seal the puncture hole against moisture.",
  holePunch: "Vergez Blanchard or KS Blade pricking irons at 45° slant (7 to 9 Stitches Per Inch / SPI), pierced with a diamond-section alêne losange awl.",
  visualSignature: "Signature 45° herringbone slant angle; hand-hammered with a smooth boxwood mallet to flatten the stitches into the hide grain.",
};

export const EDGE_FINISHING_SPEC = {
  method: "Glass-Burnished Vegetable Edge (Tokonole & Nilgiri Beeswax)",
  steps: [
    "Step 1: Beveling raw edges with French edger #2 or #3 to create uniform 45° chamfers.",
    "Step 2: Progressive wet-sanding across 4 grits: 240 grit -> 400 grit -> 800 grit -> 1200 grit Japanese water sandpaper.",
    "Step 3: Hand application of Japanese Tokonole natural gum tragacanth binder.",
    "Step 4: Rapid manual friction burnishing with high-density Indian rosewood slicker at 120 strokes/min until natural hide proteins fuse into a glassy sheen.",
    "Step 5: Molten Nilgiri beeswax rubdown buffed with virgin wool felt.",
    "Step 6: Heated brass bone folder at 65°C to press a decorative, fiber-locking creasing line 1.5mm from the border.",
  ],
  durability: "Unlike mass-market rubber edge paint that peels off after 18 months, burnished edges are permanent hide fibers that can be re-buffed forever.",
};

export const COLOUR_PALETTE_GUIDE = [
  {
    name: "Royal Saddle Tan",
    hex: "#8A5D3B",
    kannadaName: "ರಾಜ ಸ್ಯಾಡಲ್ ಕಂದು",
    story: "The quintessential Indian heritage tone. Tanned with Acacia bark, this warm honey-amber shade darkens over years of sun and touch into an aristocratic caramel patina.",
    pairing: "Best paired with solid antique brass hardware and warm ivory Khadi lining.",
    vibe: "Timeless, aristocratic, equestrian, heritage-defining.",
  },
  {
    name: "Dark Chocolate Brown",
    hex: "#3D2314",
    kannadaName: "ಗಾಢ ಚಾಕೊಲೇಟ್ ಕಂದು",
    story: "Deep, formal, and authoritative. Evokes roasted Arabica coffee beans from Chikmagalur hills. Rich natural oil content ensures a deep, luminous luster.",
    pairing: "Pairs magnificently with antique brass and 24K gold foil monogramming.",
    vibe: "Executive, formal, boardroom-ready, confident.",
  },
  {
    name: "Mysore Cognac",
    hex: "#9E472A",
    kannadaName: "ಮೈಸೂರು ಕಾಗ್ನ್ಯಾಕ್",
    story: "Vibrant warm copper and amber undertones inspired by Mysore palace woodwork. Features pronounced grain marble that reflects light dynamically.",
    pairing: "Stunning with solid brass buckles and blind heat debossed initials.",
    vibe: "Artistic, expressive, warm, rich in depth.",
  },
  {
    name: "Midnight Onyx Black",
    hex: "#1A1A1A",
    kannadaName: "ಮಧ್ಯರಾತ್ರಿಯ ಕಪ್ಪು",
    story: "Deep raven black with subtle natural hide pore reflection. Modern, minimalist, and versatile for black-tie ceremonies or executive boardrooms.",
    pairing: "Complemented by polished silver or brushed 24K gold leaf debossing.",
    vibe: "Sleek, architectural, contemporary, commanding.",
  },
  {
    name: "Nilgiri Olive Green",
    hex: "#4A5240",
    kannadaName: "ನೀಲಗಿರಿ ಆಲಿವ್ ಹಸಿರು",
    story: "Muted botanical green reminiscent of mist-covered Nilgiri tea estates. Understated, distinguished, and rarely found in mass-market stores.",
    pairing: "Striking when accented with antique brass rivets and natural ecru linen stitching.",
    vibe: "Botanical, distinguished, serene, subtle luxury.",
  },
  {
    name: "Imperial Burgundy",
    hex: "#5C1D24",
    kannadaName: "ರಾಜ ವೈನ್ ಕೆಂಪು",
    story: "Deep vintage wine red inspired by royal Karnataka velvet textiles. Sophisticated and ceremonial, radiating quiet opulence.",
    pairing: "Pairs with 24K gold leaf deboss and raw mulberry silk lining.",
    vibe: "Festive, royal, celebratory, heirloom grandeur.",
  },
  {
    name: "Hampi Sand Beige",
    hex: "#C7B299",
    kannadaName: "ಹಂಪಿ ಮರಳು ಬಣ್ಣ",
    story: "Warm sun-drenched granite sandstone tone inspired by the architectural ruins of Vijayanagara. Calming, contemporary, and airy.",
    pairing: "Best with soft leather lining and brushed gold hardware.",
    vibe: "Monochromatic, relaxed, modern, refined.",
  },
];

export const HARDWARE_METALLURGY = {
  "antique-brass": {
    name: "Solid Sand-Cast Antique Brass (ಪ್ರಾಚೀನ ಹಿತ್ತಾಳೆ)",
    alloy: "65% Virgin Copper & 35% Zinc Alloy (CuZn35)",
    foundry: "Moradabad, Uttar Pradesh (Generational Sand-Casting Guild)",
    process: "Molten virgin brass poured into moist green sand molds at 950°C, hand-filed to eliminate casting flash, barrel-tumbled with walnut shell grit, and aged with natural sulfur patina.",
    tensileLoad: "Swivel trigger snaps tested to 45 kg (440 N); D-rings tested to 85 kg (830 N)",
    benefits: "100% solid through and through. Non-magnetic, rust-proof, zero cheap zinc pot metal beneath.",
  },
  "gold": {
    name: "24K Brushed Gold Leaf Finish",
    alloy: "Solid brass base with heavy 24-karat gold electro-deposition (3 microns)",
    foundry: "Moradabad foundry with precision electro-finishing",
    process: "Sealed with micro-crystalline wax barrier to resist fingerprint acids, sweat, and atmospheric oxidation.",
    tensileLoad: "Matches solid brass structural integrity (45 kg load capacity)",
    benefits: "Radiant, warm celebratory glow suited for festive and bridal bespoke commissions.",
  },
  "silver": {
    name: "Polished Nickel & Sterling Plate",
    alloy: "Solid virgin brass substrate plated with high-purity architectural nickel",
    foundry: "Precision polishing workshop in Bengaluru",
    process: "Triple-stage mirror hand buffing with jeweler's rouge.",
    tensileLoad: "45 kg load capacity",
    benefits: "Crisp contemporary contrast against black, burgundy, and olive leathers.",
  },
  "matte-black": {
    name: "Tactical Matte Black PVD",
    alloy: "Solid brass core with Physical Vapor Deposition titanium carbonitride coating",
    foundry: "Vacuum chamber PVD facility",
    process: "Ion bombardment in high-vacuum chamber at 400°C for molecular surface integration.",
    tensileLoad: "45 kg load capacity",
    benefits: "Stealth executive aesthetic with extreme surface hardness (2500 Vickers); zero reflection.",
  },
};

export const MONOGRAMMING_SPEC = {
  methods: [
    {
      id: "gold-foil",
      title: "24K Hot-Stamped Gold Leaf Foil",
      desc: "Cast brass typographic die heated to exactly 110°C, pressing genuine metallic gold foil ribbon deep into the collagen fiber mesh.",
      durability: "Permanently bonded under hydraulic pressure; will not peel with normal daily use.",
      supportedCharacters: "A-Z, 0-9, periods, ampersands (&), and sacred Indian glyphs (ॐ, ಶ್ರೀ, ಲಕ್ಷ್ಮೀ).",
      maxCharacters: 6,
    },
    {
      id: "blind-deboss",
      title: "Aristocratic Blind Heat Deboss",
      desc: "Heated steel typographic die without foil at 120°C, creating a clean 1.2 mm deep indentation that naturally darkens from the hide's compressed oils.",
      durability: "Permanent structural indentation that lasts the lifetime of the hide.",
      supportedCharacters: "A-Z, 0-9, and sacred characters.",
      maxCharacters: 6,
    },
  ],
  standardPlacements: [
    "Lower center front face (4 cm above bottom base seam)",
    "Hanging solid leather luggage fob / medallion",
    "Internal leather pocket patch featuring the artisan commission serial number",
  ],
};

export const CLIMATE_AND_CARE_MANUAL = {
  indianMonsoon: {
    season: "June to September (High Relative Humidity 85%+)",
    protocol: "Vegetable-tanned leather naturally breathes. If exposed to heavy rain, wipe with a dry soft cotton towel immediately and allow it to dry at room temperature in ambient shade. NEVER place near hair dryers, electric heaters, or under direct scorching sunlight, which dehydrates collagen and causes brittleness. Condition with Nilgiri beeswax balm before monsoon to create an invisible water-repellent shield.",
    moldRemediation: "If white surface bloom or mildew appears due to extreme storage humidity: Wipe gently with a 50/50 mixture of distilled water and raw apple cider vinegar. Let air dry completely in shade, then replenish with lanolin leather balm.",
    storage: "Always store in breathable cotton dust bags; NEVER seal in airtight plastic bags which trap moisture.",
  },
  summerHeat: {
    season: "March to May (Dry Heat & Low Humidity 20-30%)",
    protocol: "High UV sunlight initiates the natural darkening patina process. To prevent excessive drying of natural hide oils, massage with a pea-sized amount of leather cream every 90 days.",
  },
};

export const BESPOKE_WORKFLOW_STEPS = [
  { step: 1, name: "Consultation & Briefing", desc: "Digital dialogue with The Bespoke Designer to define silhouette, dimensions, laptop requirements, leather grade, and hardware." },
  { step: 2, name: "Concept Elevation & Blueprint", desc: "Generation of 4 orthographic views (Front, 3/4 Angle, Interior Layout, Macro Detail) with precise millimeter dimensions." },
  { step: 3, name: "Artisan Clicking & Grain Alignment", desc: "Master artisan hand-selects the hide, inspecting fiber direction and clicking panels along the natural spine line for symmetrical flex." },
  { step: 4, name: "Skiving & Reinforcement", desc: "Edges are skived on a Fortuna bell-knife skiving machine to ensure smooth folded seams without bulky build-up." },
  { step: 5, name: "Hand Saddle Stitching", desc: "Dual-needle traditional saddle stitch using Lin Câblé linen thread hand-coated in wild Nilgiri beeswax." },
  { step: 6, name: "Edge Burnishing & Creasing", desc: "Multi-stage wet-sanding up to 1200 grit, Tokonole burnishing, and 65°C hot iron border creasing." },
  { step: 7, name: "Hardware Fitting & 24K Hot-Stamping", desc: "Riveting Moradabad sand-cast brass hardware and hot-stamping 24K gold foil monogram initials." },
  { step: 8, name: "Provenance Certificate & Dispatch", desc: "Final quality inspection, beeswax buff, and sealing with an embossed wax certificate of provenance in a bespoke wooden keepsake box." },
];

export const FAQ_DATA = [
  {
    q: "How does full-grain leather handle Indian monsoon humidity and rain?",
    a: "Genuine vegetable-tanned full-grain leather breathes naturally through intact pores. If caught in rain, gently wipe with dry cotton and let dry at room temperature in ambient shade. Never place near hair dryers or heaters. Conditioning with our Nilgiri beeswax balm before monsoon creates natural water-shedding protection.",
  },
  {
    q: "What laptop sizes fit in the executive briefcase vs tote?",
    a: "Our Executive Briefcase is engineered with a padded high-density foam partition specifically measured for 14\" and 16\" MacBook Pro models (up to 36 cm length). The Heritage Tote comfortably fits 13\" and 14\" laptops along with chargers, files, and daily items.",
  },
  {
    q: "What is the crafting turnaround time for a bespoke commission?",
    a: "Because each bespoke piece is cut by hand, edge-burnished with natural beeswax, and saddle-stitched in our Bengaluru workshop, bespoke commissions typically take 10 to 14 days from design approval to dispatch.",
  },
  {
    q: "Can I engrave custom initials or Devanagari / Kannada symbols?",
    a: "Yes. Our atelier supports personalized hot-stamped 24K gold foil or blind heat debossing for English initials (e.g. 'RN', 'BV'), as well as traditional characters such as 'ॐ' and 'ಶ್ರೀ'.",
  },
  {
    q: "Why do you use hand saddle stitching instead of machine sewing?",
    a: "A machine lockstitch unravels completely if a single loop breaks. With our two-needle hand saddle stitch, two independent threads cross inside each awl hole; even if one thread is cut, the other holds the leather firmly under tension indefinitely.",
  },
  {
    q: "What makes Moradabad sand-cast brass better than standard bag hardware?",
    a: "Mass-market bags use die-cast zinc alloy (pot metal) with thin electroplating that wears off in months, revealing cheap grey metal beneath. BASAVA uses 100% solid virgin brass cast in Moradabad that will never peel, flake, or corrode, developing an authentic golden luster over decades.",
  },
  {
    q: "What is the difference between Full-Grain and Top-Grain leather?",
    a: "Full-grain retains the entire unblemished top epidermis with natural pore structure and fiber density, developing the deepest patina over 20+ years. Top-grain is lightly buffed for a silky, uniform finish and slightly lighter weight, ideal for structured, formal bags.",
  },
];
