export const AMAZON_CATEGORIES = [
  // Electronics & Computers
  'Electronics',
  'Computers & Accessories',
  'Laptops',
  'Tablets',
  'Smartphones & Mobile',
  'Cameras & Photography',
  'TV & Home Theater',
  'Audio & Headphones',
  'Gaming & Consoles',
  'Smart Home & Security',
  'Wearable Technology',
  'Office Electronics',
  
  // Home & Kitchen
  'Home & Kitchen',
  'Kitchen & Dining',
  'Furniture',
  'Home Decor',
  'Bedding & Bath',
  'Garden & Outdoor',
  'Tools & Home Improvement',
  'Appliances',
  
  // Fashion & Beauty
  'Fashion',
  'Men\'s Fashion',
  'Women\'s Fashion',
  'Kids\' Fashion',
  'Shoes & Footwear',
  'Jewelry & Watches',
  'Bags & Luggage',
  'Beauty & Personal Care',
  'Health & Wellness',
  
  // Sports & Outdoors
  'Sports & Outdoors',
  'Fitness & Exercise',
  'Outdoor Recreation',
  'Cycling',
  'Team Sports',
  
  // Books & Media
  'Books',
  'Movies & TV',
  'Music',
  'Video Games',
  'Software',
  
  // Baby & Kids
  'Baby Products',
  'Toys & Games',
  'Kids & Baby Care',
  
  // Automotive
  'Automotive',
  'Car Electronics',
  'Motorcycle & Powersports',
  
  // Pet Supplies
  'Pet Supplies',
  
  // Grocery & Food
  'Grocery & Gourmet Food',
  'Health Foods',
  
  // Office & Stationery
  'Office Products',
  'Stationery & Supplies',
  
  // Others
  'Industrial & Scientific',
  'Handmade',
  'Arts & Crafts',
  'Musical Instruments',
] as const

export type AmazonCategory = typeof AMAZON_CATEGORIES[number]
