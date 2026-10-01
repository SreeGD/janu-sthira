/** Weekly grocery list for one person, derived from the 7-day rotation, daily pattern, soups and powders.
 *  Quantities are approximate; no onion or garlic. */
export interface ShoppingItem {
  id: string
  name: string
  qty: string
  note?: string
}

export interface ShoppingCategory {
  id: string
  title: string
  items: ShoppingItem[]
}

const i = (id: string, name: string, qty: string, note?: string): ShoppingItem => ({ id, name, qty, note })

export const shoppingList: ShoppingCategory[] = [
  {
    id: 'protein', title: 'Paneer, tofu, soya and dairy',
    items: [
      i('paneer', 'Paneer', '700 g', 'dinners, tikka, bhurji, paratha, chilla'),
      i('tofu', 'Tofu', '200 g', 'Wed dinner'),
      i('soya', 'Soya chunks', '150 g', 'Thu and Sat dinner'),
      i('curd', 'Curd', '1.5 kg', '1 cup daily, raita; hang some for hung curd'),
      i('milk', 'Milk', '2.5 L', 'bedtime haldi milk, Sat breakfast'),
      i('buttermilk', 'Buttermilk', 'make from curd', 'snacks and mid-morning'),
      i('ghee', 'Ghee', '1 small pack', 'tempering and soups'),
    ],
  },
  {
    id: 'pulses', title: 'Dals and pulses',
    items: [
      i('moong-dal', 'Yellow moong dal', '300 g', 'khichdi, soup, pumpkin soup'),
      i('moong-whole', 'Green moong (whole)', '300 g', 'pesarattu, chilla, sprouts'),
      i('toor', 'Toor dal', '250 g', 'Tue lunch, rasam'),
      i('mixed-dal', 'Mixed dal', '150 g', 'Sat lunch'),
      i('rajma', 'Rajma', '150 g', 'Mon lunch'),
      i('chole', 'Chole (kabuli chana)', '150 g', 'Wed lunch'),
      i('chana-roast', 'Roasted chana', '150 g', 'mid-morning and Sun snack'),
      i('chana-chaat', 'Chana for chaat', '100 g', 'Thu snack'),
      i('besan', 'Besan', '300 g', 'chilla and kadhi'),
      i('peanuts', 'Peanuts', '100 g', 'Fri chikki'),
    ],
  },
  {
    id: 'grains', title: 'Grains and flours',
    items: [
      i('atta', 'Wheat atta', '1 kg', 'rotis, paratha'),
      i('rice', 'Rice', '500 g', 'lunches, pulao, khichdi'),
      i('ragi', 'Ragi flour', '250 g', 'Wed dosa'),
      i('millet-flour', 'Millet flour (jowar / bajra)', '250 g', 'Wed millet roti'),
      i('oats', 'Oats', '100 g', 'Thu upma'),
      i('batter', 'Idli / dosa batter (or rice + urad dal)', '500 g', 'Sat idli, Sun dosa'),
      i('makhana', 'Makhana', '100 g', 'Tue snack'),
    ],
  },
  {
    id: 'veg', title: 'Vegetables and greens',
    items: [
      i('tomato', 'Tomatoes', '1.5 kg', 'chutney, sabzi, soups, rasam'),
      i('capsicum', 'Capsicum', '500 g', 'Mon and Thu dinner'),
      i('palak', 'Palak (spinach)', '3 bunches', 'Mon lunch, Wed and Thu'),
      i('beans', 'French beans', '250 g', 'Tue poriyal'),
      i('cabbage', 'Cabbage', '300 g', 'Wed sabzi'),
      i('peas', 'Green peas', '200 g', 'khichdi, upma'),
      i('bottle-gourd', 'Bottle gourd', '500 g', 'Sat sabzi'),
      i('bhindi', 'Bhindi (okra)', '250 g', 'Sun sabzi'),
      i('thotakura', 'Thotakura (amaranth leaves)', '1 bunch', 'Fri fry'),
      i('gongura', 'Gongura or extra palak', '1 bunch', 'Thu dal'),
      i('moringa-leaves', 'Drumstick leaves (munaga aku)', '1 bunch', 'moringa-moong soup'),
      i('drumstick', 'Drumsticks', '2', 'rasam-soup'),
      i('pumpkin', 'Red pumpkin', '500 g', 'pumpkin soup'),
      i('salad', 'Cucumber and salad vegetables', '500 g', 'daily salad'),
      i('chilli', 'Green chillies', '50 g'),
      i('herbs', 'Coriander and curry leaves', '2 bunches'),
      i('lemon', 'Lemons', '8', 'salads, soups, amla water'),
      i('coconut', 'Coconut', '1', 'chutneys, pumpkin soup'),
    ],
  },
  {
    id: 'fruit', title: 'Fruit (vitamin C)',
    items: [
      i('guava', 'Guava', '4'),
      i('orange', 'Oranges', '4'),
      i('amla', 'Amla (fresh)', '4', 'or use powder'),
      i('fruit-bowl', 'Fruit for Sunday bowl', '1 kg', 'seasonal'),
      i('tender-coconut', 'Tender coconut (optional)', '2', 'coconut water on hot days'),
    ],
  },
  {
    id: 'nuts', title: 'Nuts and seeds',
    items: [
      i('almonds', 'Almonds', '50 g', '5 soaked each morning'),
      i('walnuts', 'Walnuts', '50 g', '2 each morning'),
      i('flax', 'Flaxseed', '100 g', 'grind fresh, 1 tbsp daily'),
      i('sesame', 'Sesame (til)', '100 g', 'podi and chikki'),
      i('pumpkin-seeds', 'Pumpkin seeds', '30 g', 'soup topping'),
      i('jaggery', 'Jaggery', '100 g', 'chikki'),
    ],
  },
  {
    id: 'pantry', title: 'Spices and pantry',
    items: [
      i('hing', 'Hing (asafoetida)', 'check stock'),
      i('cumin', 'Cumin seeds', 'check stock'),
      i('mustard', 'Mustard seeds', 'check stock'),
      i('pepper', 'Black pepper', 'check stock'),
      i('turmeric', 'Turmeric', 'check stock'),
      i('tamarind', 'Tamarind', 'check stock'),
      i('kasuri', 'Kasuri methi', 'check stock'),
      i('amla-powder', 'Amla powder', 'check stock', '1 tsp each morning'),
      i('moringa-powder', 'Moringa powder', 'check stock', '1 tsp in dal'),
      i('salt', 'Salt', 'low, for swelling and veins'),
    ],
  },
]

export const shoppingNote =
  'Quantities are approximate for one person for 7 days. Adjust for your household. Everything here follows your rule: vegetarian, no onion or garlic.'
