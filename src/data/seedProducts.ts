// ============================================================
// seedProducts.ts — Pre-loaded medicine catalogue with prices
// All 40 products have real market prices (₹) and MRP.
// ============================================================
import type { Product } from "../types";

const now = new Date().toISOString();

function p(
  id: string,
  name: string,
  category: string,
  manufacturer: string,
  description: string,
  stockQty: number | null,
  availability: "available" | "not-available" | null,
  imageUrl: string,
  price: number | null,
  mrp: number | null = null
): Product {
  const prefixMap: Record<string, string> = {
    "ethical-brand": "ETH",
    "generic": "GEN",
    "paediatric": "PED",
    "paediatrician": "PDN",
    "surgical": "SUR",
    "personal-care": "PER",
    "baby-care": "BAB"
  };
  const prefix = prefixMap[category] || "PRD";
  const numStr = id.split("-")[1] || "0000";
  const sku = `${prefix}-${numStr}`;

  return {
    id, sku, name, category, manufacturer, description,
    price, mrp,
    stockQuantity: stockQty,
    availabilityStatus: availability,
    imageDataUrl: imageUrl,
    imageSourceType: "URL",
    createdAt: now,
    updatedAt: now,
  };
}

export const SEED_PRODUCTS: Product[] = [

  // ━━━━ ETHICAL / BRAND ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  p("seed-001", "Dolo 650 Tablet", "ethical-brand", "Micro Labs Ltd",
    "Paracetamol 650mg. Relieves fever, headache and mild to moderate pain. Take after food if stomach upset.",
    120, null,
    "https://www.netmeds.com/images/product-v1/600x600/1039459/dolo_650mg_tablet_15s_0.jpg",
    30, 35),

  p("seed-002", "Crocin Advance 500mg Tablet", "ethical-brand", "GSK Consumer Healthcare",
    "Paracetamol 500mg. Fast-acting pain and fever relief. Suitable for adults and children above 12 years.",
    85, null,
    "https://www.netmeds.com/images/product-v1/600x600/14768/crocin_advance_500mg_tablet_20s_0.jpg",
    32, 38),

  p("seed-003", "Augmentin 625 Duo Tablet", "ethical-brand", "GSK Pharmaceuticals",
    "Amoxycillin 500mg + Clavulanic Acid 125mg. Broad-spectrum antibiotic. Prescription required.",
    42, null,
    "https://www.netmeds.com/images/product-v1/600x600/32817/augmentin_625_duo_tablet_10s_0.jpg",
    220, 245),

  p("seed-004", "Pan 40 Tablet", "ethical-brand", "Alkem Laboratories",
    "Pantoprazole 40mg. Reduces stomach acid. Used for GERD, gastric ulcers and acidity.",
    200, null,
    "https://www.netmeds.com/images/product-v1/600x600/14843/pan_40mg_tablet_15s_0.jpg",
    65, 75),

  p("seed-005", "Azithral 500 Tablet", "ethical-brand", "Alembic Pharmaceuticals",
    "Azithromycin 500mg. Antibiotic for respiratory, skin and soft tissue infections.",
    65, null,
    "https://www.netmeds.com/images/product-v1/600x600/14745/azithral_500mg_tablet_5s_0.jpg",
    85, 95),

  p("seed-006", "Combiflam Tablet", "ethical-brand", "Sanofi India Ltd",
    "Ibuprofen 400mg + Paracetamol 325mg. Combined pain, fever and inflammation relief.",
    155, null,
    "https://www.netmeds.com/images/product-v1/600x600/14779/combiflam_tablet_20s_0.jpg",
    28, 33),

  p("seed-007", "Metformin 500mg Tablet", "ethical-brand", "Sun Pharmaceutical Industries",
    "Metformin Hydrochloride 500mg. First-line medication for Type 2 Diabetes management.",
    300, null,
    "https://www.netmeds.com/images/product-v1/600x600/14803/metformin_500mg_tablet_10s_0.jpg",
    18, 22),

  p("seed-008", "Telma 40 Tablet", "ethical-brand", "Glenmark Pharmaceuticals",
    "Telmisartan 40mg. Angiotensin receptor blocker for hypertension control.",
    90, null,
    "https://www.netmeds.com/images/product-v1/600x600/14834/telma_40mg_tablet_14s_0.jpg",
    112, 125),

  p("seed-009", "Atorva 10 Tablet", "ethical-brand", "Zydus Cadila",
    "Atorvastatin 10mg. Statin to lower LDL cholesterol and reduce cardiovascular risk.",
    175, null,
    "https://www.netmeds.com/images/product-v1/600x600/14747/atorva_10mg_tablet_15s_0.jpg",
    72, 85),

  p("seed-010", "Allegra 120mg Tablet", "ethical-brand", "Sanofi India",
    "Fexofenadine 120mg. Non-sedating antihistamine for allergic rhinitis and urticaria.",
    110, null,
    "https://www.netmeds.com/images/product-v1/600x600/14740/allegra_120mg_tablet_10s_0.jpg",
    162, 180),

  p("seed-011", "Montair LC Tablet", "ethical-brand", "Cipla Ltd",
    "Montelukast 10mg + Levocetirizine 5mg. For allergic rhinitis and asthma.",
    78, null,
    "https://www.netmeds.com/images/product-v1/600x600/14809/montair_lc_tablet_10s_0.jpg",
    145, 160),

  p("seed-012", "Shelcal 500 Tablet", "ethical-brand", "Elder Pharmaceuticals",
    "Calcium Carbonate 1250mg (elemental Calcium 500mg) + Vitamin D3 250IU.",
    130, null,
    "https://www.netmeds.com/images/product-v1/600x600/14826/shelcal_500mg_tablet_15s_0.jpg",
    85, 95),

  // ━━━━ GENERIC ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  p("seed-013", "Paracetamol 500mg Tablet (Generic)", "generic", "Cipla Ltd",
    "Generic Paracetamol 500mg. Affordable fever and pain relief.",
    null, "available",
    "https://www.netmeds.com/images/product-v1/600x600/823340/paracetamol_500mg_tablet_10s_0.jpg",
    8, 12),

  p("seed-014", "Amoxicillin 500mg Capsule (Generic)", "generic", "Mankind Pharma",
    "Generic Amoxicillin 500mg. Broad-spectrum penicillin antibiotic for bacterial infections.",
    null, "available",
    "https://www.netmeds.com/images/product-v1/600x600/947785/amoxicillin_500mg_capsule_10s_0.jpg",
    22, 28),

  p("seed-015", "Omeprazole 20mg Capsule (Generic)", "generic", "Dr. Reddy's Laboratories",
    "Generic Omeprazole 20mg. Proton pump inhibitor for acidity, GERD and peptic ulcers.",
    null, "available",
    "https://www.netmeds.com/images/product-v1/600x600/835248/omeprazole_20mg_capsule_10s_0.jpg",
    15, 20),

  p("seed-016", "Cetirizine 10mg Tablet (Generic)", "generic", "Lupin Pharmaceuticals",
    "Generic Cetirizine 10mg. Antihistamine for allergic rhinitis, skin allergy and urticaria.",
    null, "available",
    "https://www.netmeds.com/images/product-v1/600x600/834476/cetirizine_10mg_tablet_10s_0.jpg",
    10, 15),

  // ━━━━ PAEDIATRIC ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  p("seed-017", "Calpol 120mg Paediatric Suspension", "paediatric", "GSK Consumer Healthcare",
    "Paracetamol 120mg/5ml. Children's fever and pain syrup. Strawberry flavour. Age 3 months–6 years.",
    null, "available",
    "https://www.netmeds.com/images/product-v1/600x600/14775/calpol_120mg_5ml_paediatric_suspension_60ml_0.jpg",
    52, 60),

  p("seed-018", "Dolo Syrup 125mg/5ml", "paediatric", "Micro Labs Ltd",
    "Paracetamol 125mg/5ml. Fever and pain relief for children. Pleasant mango flavour.",
    null, "available",
    "https://www.netmeds.com/images/product-v1/600x600/822530/dolo_125mg_5ml_syrup_60ml_0.jpg",
    28, 35),

  p("seed-019", "Zincovit Syrup", "paediatric", "Apex Laboratories",
    "Multivitamin + Zinc syrup. Supports immunity, growth and overall development in children.",
    null, "available",
    "https://www.netmeds.com/images/product-v1/600x600/14860/zincovit_syrup_200ml_0.jpg",
    115, 130),

  p("seed-020", "Otrivin Paediatric Nasal Drops", "paediatric", "Novartis Consumer Health",
    "Xylometazoline 0.05%. Relieves nasal congestion in infants and children (1 month–6 years).",
    null, "available",
    "https://www.netmeds.com/images/product-v1/600x600/14817/otrivin_paediatric_0_05_nasal_drops_10ml_0.jpg",
    72, 82),

  p("seed-021", "Polybion LC Syrup", "paediatric", "Merck Ltd",
    "Multivitamin + Mineral supplement syrup for children. Supports growth and immunity.",
    null, "available",
    "https://www.netmeds.com/images/product-v1/600x600/14822/polybion_lc_syrup_100ml_0.jpg",
    98, 110),

  // ━━━━ PAEDIATRICIAN ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  p("seed-022", "Augmentin DS 400mg Suspension", "paediatrician", "GSK Pharmaceuticals",
    "Amoxycillin 400mg + Clavulanate 57mg/5ml. Paediatrician-prescribed for bacterial infections in children.",
    null, "available",
    "https://www.netmeds.com/images/product-v1/600x600/14742/augmentin_duo_400mg_57mg_oral_suspension_30ml_0.jpg",
    155, 175),

  p("seed-023", "Montair LC Kid Tablet", "paediatrician", "Cipla Ltd",
    "Montelukast 4mg + Levocetirizine 2.5mg. Prescribed for allergic rhinitis and asthma in children.",
    null, "available",
    "https://www.netmeds.com/images/product-v1/600x600/14810/montair_lc_kid_tablet_10s_0.jpg",
    95, 108),

  p("seed-024", "Vitamin D3 Nano Drops (Child)", "paediatrician", "Mankind Pharma",
    "Cholecalciferol 800 IU/mL. Prevents vitamin D deficiency and rickets. Prescribed for infants.",
    null, "available",
    "https://www.netmeds.com/images/product-v1/600x600/986324/d_rise_800iu_nano_drops_30ml_0.jpg",
    125, 145),

  // ━━━━ SURGICAL ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  p("seed-025", "Omron Digital Thermometer (MC-246)", "surgical", "Omron Healthcare",
    "Clinical digital thermometer. Fever alarm, 60-second reading, 24-reading memory. °C/°F switchable.",
    null, "available",
    "https://www.netmeds.com/images/product-v1/600x600/14816/omron_mc_246_digital_thermometer_0.jpg",
    199, 250),

  p("seed-026", "Omron Blood Pressure Monitor (HEM-7120)", "surgical", "Omron Healthcare",
    "Fully automatic upper arm BP monitor. Large display, irregular heartbeat indicator, 60-reading memory.",
    null, "available",
    "https://www.netmeds.com/images/product-v1/600x600/14815/omron_hem_7120_automatic_blood_pressure_monitor_0.jpg",
    1699, 2000),

  p("seed-027", "Dr Trust Pulse Oximeter", "surgical", "Dr Trust India",
    "Fingertip pulse oximeter. Measures SpO2 and pulse rate. Large LED display. Battery included.",
    null, "available",
    "https://www.netmeds.com/images/product-v1/600x600/994723/dr_trust_210_fingertip_pulse_oximeter_0.jpg",
    899, 1200),

  p("seed-028", "Accu-Chek Active Glucometer Kit", "surgical", "Roche Diagnostics",
    "Blood glucose monitoring system with 10 test strips, lancets and lancing device. 5-second result.",
    null, "available",
    "https://www.netmeds.com/images/product-v1/600x600/14738/accu_chek_active_blood_glucose_meter_kit_0.jpg",
    699, 850),

  p("seed-029", "Crepe Bandage 10cm x 4m", "surgical", "3M India",
    "Elastic crepe bandage for support, compression and post-operative use. Reusable.",
    null, "available",
    "https://www.netmeds.com/images/product-v1/600x600/14778/3m_crepe_bandage_4m_x_10cm_0.jpg",
    55, 70),

  p("seed-030", "Dispovan Syringe 5ml (Box of 100)", "surgical", "Hindustan Syringes",
    "3-part disposable syringe 5ml with 23G needle. Sterile, single use, individually packed.",
    null, "available",
    "https://www.netmeds.com/images/product-v1/600x600/14783/dispovan_5ml_23g_disposable_syringe_with_needle_100s_0.jpg",
    185, 210),

  // ━━━━ PERSONAL CARE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  p("seed-031", "Dettol Antiseptic Liquid 500ml", "personal-care", "Reckitt Benckiser",
    "Chloroxylenol 4.8%. Antiseptic and disinfectant for cuts, wounds, bathing and surface cleaning.",
    null, "available",
    "https://www.netmeds.com/images/product-v1/600x600/14782/dettol_antiseptic_liquid_500ml_0.jpg",
    145, 162),

  p("seed-032", "Vicks VapoRub 50g", "personal-care", "Procter & Gamble",
    "Camphor + Menthol + Eucalyptus Oil. Relieves nasal congestion, headache and muscle aches.",
    null, "available",
    "https://www.netmeds.com/images/product-v1/600x600/14857/vicks_vaporub_50gm_0.jpg",
    95, 110),

  p("seed-033", "Volini Pain Relief Spray 100g", "personal-care", "Sanofi India",
    "Diclofenac Diethylamine + Methyl Salicylate. Fast topical relief for muscle and joint pain.",
    null, "available",
    "https://www.netmeds.com/images/product-v1/600x600/14858/volini_pain_relief_spray_100gm_0.jpg",
    175, 200),

  p("seed-034", "Savlon Antiseptic Cream 25g", "personal-care", "ITC Ltd",
    "Chlorhexidine + Cetrimide cream for minor cuts, burns and skin infections.",
    null, "available",
    "https://www.netmeds.com/images/product-v1/600x600/14824/savlon_antiseptic_cream_25gm_0.jpg",
    55, 65),

  p("seed-035", "Himalaya Neem Face Wash 150ml", "personal-care", "Himalaya Drug Company",
    "Neem + Turmeric face wash. Controls acne, pimples and excess oil. For oily to combination skin.",
    null, "available",
    "https://www.netmeds.com/images/product-v1/600x600/14790/himalaya_purifying_neem_face_wash_150ml_0.jpg",
    95, 110),

  // ━━━━ BABY CARE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  p("seed-036", "Johnson's Baby Oil 200ml", "baby-care", "Johnson & Johnson India",
    "Mineral oil. Gentle moisturising baby oil. Clinically proven mild. Hypoallergenic.",
    null, "available",
    "https://www.netmeds.com/images/product-v1/600x600/14795/johnson_s_baby_oil_200ml_0.jpg",
    155, 175),

  p("seed-037", "Johnson's Baby Shampoo 200ml", "baby-care", "Johnson & Johnson India",
    "No more tears formula. Gentle, soap-free shampoo as mild as water. Hypoallergenic.",
    null, "available",
    "https://www.netmeds.com/images/product-v1/600x600/14796/johnson_s_baby_shampoo_200ml_0.jpg",
    145, 165),

  p("seed-038", "Pampers Active Baby Pants M (56 count)", "baby-care", "Procter & Gamble",
    "Ultra-absorbent pull-up diapers for babies 7–12kg. 12-hour dryness. Soft waistband.",
    null, "available",
    "https://www.netmeds.com/images/product-v1/600x600/959380/pampers_active_baby_pants_m_56s_0.jpg",
    699, 799),

  p("seed-039", "Himalaya Baby Diaper Rash Cream 50g", "baby-care", "Himalaya Drug Company",
    "Zinc Oxide + Aloe Vera. Soothes, prevents and treats diaper rash. Paediatrician tested.",
    null, "available",
    "https://www.netmeds.com/images/product-v1/600x600/14789/himalaya_baby_diaper_rash_cream_50gm_0.jpg",
    95, 110),

  p("seed-040", "Woodward's Gripe Water 200ml", "baby-care", "Woodward's",
    "Dill Seed Oil + Sodium Bicarbonate. Relieves colic, wind pain and digestive discomfort in infants.",
    null, "available",
    "https://www.netmeds.com/images/product-v1/600x600/14859/woodward_s_gripe_water_200ml_0.jpg",
    72, 85),
];

export const SEED_KEY = "srinivasa_seeded_v3";
