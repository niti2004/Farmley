/**
 * PRODUCT DATA
 * ------------------------------------------------------------------
 * Every piece of product-specific copy, numbers and links lives here.
 * Components/scripts read from window.PRODUCT — nothing about the
 * product should be hard-coded anywhere else.
 * ------------------------------------------------------------------
 */
window.PRODUCT = {
  brand: "Farmley",
  name: "Roasted Makhana",
  flavour: "Lemon Chilli",
  tagline: "Crunch first. Zest follows.",
  description:
    "An upgrade over plain makhana and every other guilt-tripping snack in the cupboard. Foxnuts roasted in olive oil, hit with lemon and chilli, and built for people who still want to snack like they mean it.",
  roastingMethod: "Roasted in olive oil",
  keyFeatures: [
    { label: "Roasted in olive oil", icon: "oil" },
    { label: "Trans fat free", icon: "leaf" },
    { label: "Plant protein", icon: "protein" },
    { label: "Guilt-free snacking", icon: "heart" }
  ],
  claims: ["Vegan protein", "No trans fat", "Roasted, not fried", "Guilt-free"],

  unit: "77 g",
  shelfLife: "9 months",
  countryOfOrigin: "India",
  fssai: "10419340000211",

  sizes: [
    { id: "77g", weight: "77 g", price: null, priceLabel: "Price varies", default: true }
  ],

  ingredients: [
    "Foxnut (Makhana)",
    "Olive Oil",
    "Iodised Salt",
    "Mixed Spices (Chilli, Cumin, Coriander)",
    "Sugar",
    "Lemon Powder",
    "Acidity Regulator (Citric Acid)",
    "Hydrolysed Vegetable Protein (Soya)",
    "Dehydrated Herbs",
    "Flavour Enhancer (E635)",
    "Yeast Extracts",
    "Natural & Nature-identical Flavouring Substances",
    "Permitted Food Colour (Paprika)",
    "Anticaking Agent (E551)",
    "Antioxidant (Ascorbic Acid)"
  ],

  nutrition: {
    servingSize: "100 g",
    energyKcal: 468,
    protein: 7.9,
    carbohydrates: 63.8,
    totalSugar: 1.8,
    addedSugar: 0.2,
    dietaryFiber: 11.3,
    totalFat: 20.1,
    saturatedFat: 3.4,
    transFat: 0,
    sodiumMg: 480.0,
    cholesterolMg: 0,
    dvPercent: {
      energy: 4.7,
      addedSugar: 0.1,
      totalFat: 6.0,
      saturatedFat: 3.1,
      sodium: 4.8
    }
  },

  manufacturer: {
    name: "Connedit Business Solutions Pvt. Ltd.",
    address:
      "Near FCI Godown, Belori, Mufassil Rani Patra, Belori Katihar S.H. P.S., Purnia, Bihar, India - 854301"
  },
  marketer: {
    name: "Connedit Business Solutions Pvt. Ltd.",
    address:
      "Near FCI Godown, Belori, Mufassil Rani Patra, Belori Katihar S.H. P.S., Purnia, Bihar, India - 854301"
  },
  customerCare: { email: "info@blinkit.com" },

  disclaimer:
    "Every effort is made to maintain the accuracy of all information. However, actual product packaging and materials may contain more and/or different information. It is recommended not to rely solely on the information presented here.",

  links: {
    officialCollection: "https://www.farmley.com/collections/roasted-and-flavoured-makhana",
    buyOnBlinkit:
      "https://blinkit.com/prn/farmley-lemon-chilli-flavoured-makhana/prid/774515?srsltid=AfmBOorr8dZZayKM5i_OrkQVCrKE26RLHjSFyrHJwZIORRjJ77tq0n80"
  },

  theme: {
    green: "#1B4332",
    greenDeep: "#0E2B1F",
    greenBright: "#2D6A4F",
    lemon: "#F5C218",
    lemonBright: "#FFDD4A",
    chilli: "#E63946",
    cream: "#FFF8E4",
    charcoal: "#12200F"
  }
};
