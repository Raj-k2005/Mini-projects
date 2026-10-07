// ===== Product Database =====
const products = [
  // ── Hot Coffees ──
  {
    id: "coffee-brew",
    name: "Coffee Brew",
    category: "Hot Coffee",
    price: "$6.99",
    image: "hot5.png.png",
    time: "5 min",
    description:
      "Crafted with love and intention, our signature Coffee Brew uses freshly ground beans and perfectly heated water. Every sip is a warm embrace — bold, aromatic, and made just for you.",
    ingredients: [
      "Freshly ground Arabica beans",
      "Filtered hot water (92°C)",
      "Optional: steamed milk",
      "Optional: brown sugar",
      "Pinch of cinnamon",
      "Love & care ❤️",
    ],
  },
  {
    id: "americano",
    name: "Americano",
    category: "Hot Coffee",
    price: "$5.99",
    image: "hot3.png.png",
    time: "4 min",
    description:
      "Espresso mellowed with hot water — like a deep thinker in a relaxed mood. Smooth, simple, and quietly powerful. The perfect companion for a focused morning.",
    ingredients: [
      "Double shot espresso",
      "Hot water (200ml)",
      "Arabica coffee beans",
      "Optional: lemon slice",
      "Optional: sugar",
    ],
  },
  {
    id: "cappuccino",
    name: "Cappuccino",
    category: "Hot Coffee",
    price: "$6.99",
    image: "hot4.png.png",
    time: "6 min",
    description:
      "A cozy trio of espresso, steamed milk, and velvety foam — like a warm hug in a cup. Balanced and beautifully layered, it's the classic Italian morning ritual.",
    ingredients: [
      "Double shot espresso",
      "Steamed whole milk (60ml)",
      "Thick milk foam",
      "Cocoa powder (garnish)",
      "Optional: vanilla syrup",
    ],
  },
  {
    id: "irish-coffee",
    name: "Irish Coffee",
    category: "Hot Coffee",
    price: "$7.99",
    image: "hot5.png.png",
    time: "7 min",
    description:
      "Coffee with a spirited kick — Irish whiskey and fresh cream make it bold and warming. A toast in every sip, perfect for a cozy evening by the fire.",
    ingredients: [
      "Hot brewed coffee",
      "Irish whiskey (30ml)",
      "Brown sugar",
      "Fresh heavy cream",
      "Nutmeg (garnish)",
    ],
  },
  {
    id: "vienna-coffee",
    name: "Vienna Coffee",
    category: "Hot Coffee",
    price: "$2.99",
    image: "hot6.png.png",
    time: "5 min",
    description:
      "Rich espresso crowned with a generous swirl of whipped cream — luxurious, velvety, and fit for royalty. A Viennese classic that never goes out of style.",
    ingredients: [
      "Double shot espresso",
      "Whipped cream",
      "Chocolate shavings",
      "Optional: vanilla extract",
      "Powdered sugar",
    ],
  },
  {
    id: "mazagran",
    name: "Mazagran",
    category: "Hot Coffee",
    price: "$4.99",
    image: "hot10.png.png",
    time: "5 min",
    description:
      "A zesty Algerian surprise — coffee meets lemon over ice. Unexpected, refreshing, and utterly unforgettable. The original iced coffee from North Africa.",
    ingredients: [
      "Strong brewed coffee",
      "Fresh lemon juice",
      "Sugar syrup",
      "Ice cubes",
      "Lemon slice (garnish)",
      "Optional: rum",
    ],
  },
  {
    id: "latte",
    name: "Latte",
    category: "Hot Coffee",
    price: "$5.99",
    image: "hot2.png.png",
    time: "6 min",
    description:
      "Soft and creamy, the latte whispers comfort with every sip. It's espresso's gentle, milky embrace — smooth, mellow, and endlessly customizable with your favourite syrup.",
    ingredients: [
      "Double shot espresso",
      "Steamed whole milk (180ml)",
      "Light milk foam",
      "Optional: vanilla / caramel syrup",
      "Optional: latte art",
    ],
  },
  {
    id: "macchiato",
    name: "Macchiato",
    category: "Hot Coffee",
    price: "$8.99",
    image: "hot3.png.png",
    time: "4 min",
    description:
      "A bold espresso kissed by a touch of milk — short, sharp, and stylish. It's coffee with attitude. The macchiato is for those who know exactly what they want.",
    ingredients: [
      "Double shot espresso",
      "Dollop of steamed milk foam",
      "Optional: caramel drizzle",
      "Arabica beans",
    ],
  },
  {
    id: "cafe-au-lait",
    name: "Café au Lait",
    category: "Hot Coffee",
    price: "$3.99",
    image: "hot4.png.png",
    time: "5 min",
    description:
      "French elegance in a cup — equal parts strong brewed coffee and hot milk, simple yet refined. A morning staple across Parisian cafés for centuries.",
    ingredients: [
      "Strong drip coffee",
      "Hot whole milk (equal parts)",
      "Optional: sugar",
      "Optional: chicory blend",
    ],
  },

  // ── Cold Beverages ──
  {
    id: "iced-coffee",
    name: "Iced Coffee",
    category: "Cold Beverage",
    price: "$4.05",
    image: "cold1.png.png",
    time: "5 min",
    description:
      "Classic brewed coffee chilled and served over ice. Simple, refreshing, and endlessly customizable. The go-to summer staple that never disappoints.",
    ingredients: [
      "Brewed coffee (chilled)",
      "Ice cubes",
      "Milk or cream",
      "Optional: simple syrup",
      "Optional: flavoured syrups",
    ],
  },
  {
    id: "cold-brew",
    name: "Cold Brew",
    category: "Cold Beverage",
    price: "$7.99",
    image: "cold2.png.png",
    time: "12–24 hrs steep",
    description:
      "Steeped slowly in cold water for 12–24 hours, it's smooth, less acidic, and perfect for sipping all day. Patience makes this one worth the wait.",
    ingredients: [
      "Coarsely ground coffee",
      "Cold filtered water",
      "Ice cubes",
      "Optional: oat milk",
      "Optional: vanilla syrup",
    ],
  },
  {
    id: "nitro-cold-brew",
    name: "Nitro Cold Brew",
    category: "Cold Beverage",
    price: "$4.99",
    image: "cold3.png",
    time: "3 min",
    description:
      "Infused with nitrogen for a creamy texture and a gorgeous foamy top — like coffee meets Guinness. Served straight from the tap, no ice needed.",
    ingredients: [
      "Cold brew concentrate",
      "Nitrogen gas (infused)",
      "No ice (served cold)",
      "Optional: sweet cream topping",
    ],
  },
  {
    id: "vietnamese-iced-coffee",
    name: "Vietnamese Iced Coffee",
    category: "Cold Beverage",
    price: "$3.99",
    image: "cold4.png",
    time: "8 min",
    description:
      "Strong Vietnamese drip coffee mixed with sweetened condensed milk and poured over ice. Bold and sweet with a kick — a Southeast Asian classic.",
    ingredients: [
      "Vietnamese drip coffee (Robusta)",
      "Sweetened condensed milk",
      "Ice cubes",
      "Optional: coconut milk",
    ],
  },
  {
    id: "iced-mocha",
    name: "Iced Mocha",
    category: "Cold Beverage",
    price: "$4.47",
    image: "cold5.png",
    time: "6 min",
    description:
      "Espresso, milk, and chocolate syrup blended and chilled. Dessert in a cup with a caffeine twist — rich, indulgent, and impossible to resist.",
    ingredients: [
      "Double shot espresso",
      "Chocolate syrup",
      "Cold milk",
      "Ice cubes",
      "Whipped cream (topping)",
      "Chocolate drizzle",
    ],
  },
  {
    id: "affogato",
    name: "Affogato al Caffè",
    category: "Cold Beverage",
    price: "$5.99",
    image: "cold6.png",
    time: "3 min",
    description:
      "A scoop of vanilla ice cream drowned in a shot of hot espresso. Technically dessert, but we won't tell. The contrast of hot and cold is pure magic.",
    ingredients: [
      "Vanilla gelato / ice cream",
      "Hot double shot espresso",
      "Optional: amaretto liqueur",
      "Optional: crushed biscotti",
    ],
  },
  {
    id: "dalgona-iced-coffee",
    name: "Dalgona Iced Coffee",
    category: "Cold Beverage",
    price: "$7.34",
    image: "cold8.png",
    time: "10 min",
    description:
      "Whipped instant coffee, sugar, and water beaten until fluffy, then spooned over cold milk. TikTok-famous and creamy — as fun to make as it is to drink.",
    ingredients: [
      "Instant coffee (2 tbsp)",
      "Sugar (2 tbsp)",
      "Hot water (2 tbsp)",
      "Cold milk (200ml)",
      "Ice cubes",
    ],
  },
  {
    id: "shakerato",
    name: "Shakerato",
    category: "Cold Beverage",
    price: "$6.88",
    image: "cold9.png",
    time: "5 min",
    description:
      "Italian-style espresso shaken vigorously with ice and sugar until frothy and chilled. Elegant, energizing, and the coolest way to enjoy espresso in summer.",
    ingredients: [
      "Double shot espresso",
      "Ice cubes",
      "Sugar syrup",
      "Optional: chocolate bitters",
      "Lemon zest (garnish)",
    ],
  },
  {
    id: "cappuccino-freddo",
    name: "Cappuccino Freddo",
    category: "Cold Beverage",
    price: "$3.00",
    image: "cold10.png",
    time: "7 min",
    description:
      "Greek-style iced cappuccino with frothed cold milk and strong espresso. Velvety and bold with a Mediterranean flair — the café staple of Athens.",
    ingredients: [
      "Double shot espresso (chilled)",
      "Cold frothed milk",
      "Ice cubes",
      "Optional: sugar",
      "Cocoa powder (garnish)",
    ],
  },

  // ── Snacks ──
  // Images match exactly what coffeshop.html uses: s1.png → s19.png (s17 skipped)
  {
    id: "chicken-doritto",        // s1.png
    name: "Chicken Doritto",
    category: "Snack",
    price: "$6.99",
    image: "s1.png",
    time: "10 min",
    description:
      "Crispy Dorito-crusted chicken bites with a zesty seasoning blend. Crunchy on the outside, juicy on the inside — the ultimate snack to pair with your coffee.",
    ingredients: [
      "Chicken breast strips",
      "Crushed Doritos (nacho cheese)",
      "Egg wash",
      "Garlic powder",
      "Paprika",
      "Dipping sauce",
    ],
  },
  {
    id: "taco-pork",              // s2.png
    name: "Taaco Pork",
    category: "Snack",
    price: "$6.99",
    image: "s2.png",
    time: "12 min",
    description:
      "Slow-seasoned pork in a warm taco shell with fresh toppings. Bold flavours, satisfying crunch, and a hint of smokiness in every bite.",
    ingredients: [
      "Seasoned pulled pork",
      "Corn taco shells",
      "Shredded cabbage",
      "Pico de gallo",
      "Sour cream",
      "Lime wedge",
    ],
  },
  {
    id: "afghani-salsa",          // s3.png
    name: "Afghani Salsa",
    category: "Snack",
    price: "$6.99",
    image: "s3.png",
    time: "8 min",
    description:
      "A vibrant fusion of Afghan spices with fresh tomatoes, herbs, and a kick of chilli. Served with warm flatbread — bold, aromatic, and deeply satisfying.",
    ingredients: [
      "Fresh tomatoes",
      "Coriander & mint",
      "Green chilli",
      "Garlic & ginger",
      "Afghan spice blend",
      "Warm naan / flatbread",
    ],
  },
  {
    id: "tottia-taco",            // s4.png
    name: "Tottia Taco",
    category: "Snack",
    price: "$6.99",
    image: "s4.png",
    time: "10 min",
    description:
      "A soft flour tortilla loaded with seasoned fillings, fresh veggies, and creamy sauce. Folded to perfection — every bite is a flavour explosion.",
    ingredients: [
      "Flour tortilla",
      "Seasoned chicken / beef",
      "Lettuce & tomato",
      "Cheddar cheese",
      "Chipotle mayo",
      "Jalapeños",
    ],
  },
  {
    id: "special-taco-bell",      // s5.png
    name: "Special Taco Bell",
    category: "Snack",
    price: "$6.99",
    image: "s5.png",
    time: "10 min",
    description:
      "Our house-special taco inspired by the iconic Taco Bell style — crunchy shell, seasoned beef, and all the classic toppings. A crowd favourite every time.",
    ingredients: [
      "Crunchy taco shell",
      "Seasoned ground beef",
      "Shredded lettuce",
      "Diced tomatoes",
      "Cheddar cheese",
      "Taco sauce",
    ],
  },
  {
    id: "mexican-comboa",         // s6.png
    name: "Mexican Comboa",
    category: "Snack",
    price: "$6.99",
    image: "s6.png",
    time: "15 min",
    description:
      "A full Mexican combo platter — tacos, nachos, and salsa all in one. Perfect for sharing or for when you just can't decide. Fiesta on a plate.",
    ingredients: [
      "Mini tacos (x2)",
      "Tortilla chips",
      "Guacamole",
      "Salsa roja",
      "Sour cream",
      "Jalapeño slices",
    ],
  },
  {
    id: "fish-taco",              // s7.png
    name: "Fish Taco",
    category: "Snack",
    price: "$6.99",
    image: "s7.png",
    time: "12 min",
    description:
      "Crispy battered fish in a soft corn tortilla with tangy slaw and chipotle crema. Light, fresh, and packed with coastal flavour.",
    ingredients: [
      "Battered white fish fillet",
      "Corn tortilla",
      "Cabbage slaw",
      "Chipotle crema",
      "Lime juice",
      "Fresh cilantro",
    ],
  },
  {
    id: "meriana-roll",           // s8.png
    name: "Meriana Roll",
    category: "Snack",
    price: "$6.99",
    image: "s8.png",
    time: "10 min",
    description:
      "A soft, golden-baked roll stuffed with seasoned chicken, herbs, and melted cheese. Warm, comforting, and perfect alongside a hot coffee.",
    ingredients: [
      "Soft bread roll",
      "Seasoned chicken filling",
      "Mozzarella cheese",
      "Mixed herbs",
      "Garlic butter glaze",
      "Side salad",
    ],
  },
  {
    id: "salood",                 // s9.png  (reuses afghani-salsa id in HTML — give it own id)
    name: "Salood",
    category: "Snack",
    price: "$6.99",
    image: "s9.png",
    time: "8 min",
    description:
      "A fresh and vibrant salad bowl packed with seasonal greens, herbs, and a zesty house dressing. Light, healthy, and full of colour.",
    ingredients: [
      "Mixed seasonal greens",
      "Cherry tomatoes",
      "Cucumber slices",
      "Red onion",
      "House vinaigrette",
      "Toasted seeds",
    ],
  },
  {
    id: "spicy-pizza",            // s10.png
    name: "Spicy Pizza",
    category: "Snack",
    price: "$6.99",
    image: "s10.png",
    time: "20 min",
    description:
      "A personal-sized pizza loaded with spicy pepperoni, jalapeños, and a fiery tomato base. For those who like their food with a kick.",
    ingredients: [
      "Pizza dough base",
      "Spicy tomato sauce",
      "Mozzarella cheese",
      "Spicy pepperoni",
      "Jalapeño slices",
      "Chilli flakes",
    ],
  },
  {
    id: "cheesy-burst",           // s11.png
    name: "Cheesy Burst",
    category: "Snack",
    price: "$6.99",
    image: "s11.png",
    time: "18 min",
    description:
      "A cheese-stuffed crust pizza that oozes with every bite. Loaded with four cheeses and a golden, crispy base — pure cheesy heaven.",
    ingredients: [
      "Cheese-stuffed crust dough",
      "Mozzarella",
      "Cheddar",
      "Parmesan",
      "Gouda",
      "Tomato base sauce",
    ],
  },
  {
    id: "solo-slice",             // s12.png
    name: "Solo Slice",
    category: "Snack",
    price: "$6.99",
    image: "s12.png",
    time: "10 min",
    description:
      "A single generous slice of our signature pizza, perfect for a quick snack. Crispy base, rich sauce, and melted cheese in every bite.",
    ingredients: [
      "Pizza dough slice",
      "Tomato sauce",
      "Mozzarella cheese",
      "Mixed toppings",
      "Oregano",
      "Olive oil drizzle",
    ],
  },
  {
    id: "classic-cheeseburger",   // s13.png
    name: "Classic Cheeseburger",
    category: "Snack",
    price: "$8.99",
    image: "s13.png",
    time: "15 min",
    description:
      "The timeless combo of a juicy chicken patty, melted cheese, crisp lettuce, tomato, and pickles. Simple, satisfying, and universally loved.",
    ingredients: [
      "Chicken / beef patty",
      "Cheddar cheese slice",
      "Brioche bun",
      "Lettuce & tomato",
      "Pickles",
      "Ketchup & mustard",
    ],
  },
  {
    id: "bacon-cheeseburger",     // s14.png
    name: "Bacon Cheeseburger",
    category: "Snack",
    price: "$8.99",
    image: "s14.png",
    time: "15 min",
    description:
      "Smoky bacon layered over a cheesy beef patty. Adds crunch and savory depth to the classic — a burger that means business.",
    ingredients: [
      "Beef patty",
      "Crispy bacon strips",
      "Cheddar cheese",
      "Brioche bun",
      "Lettuce & tomato",
      "Smoky mayo",
    ],
  },
  {
    id: "bbq-burger",             // s15.png
    name: "BBQ Burger",
    category: "Snack",
    price: "$9.99",
    image: "s15.png",
    time: "15 min",
    description:
      "Slathered in smoky barbecue sauce with grilled onions and cheddar. Perfect for summer cookouts and gloriously messy fingers.",
    ingredients: [
      "Beef patty",
      "Smoky BBQ sauce",
      "Grilled onions",
      "Cheddar cheese",
      "Brioche bun",
      "Crispy bacon",
    ],
  },
  {
    id: "jucy-lucy",              // s16.png
    name: "Jucy Lucy",
    category: "Snack",
    price: "$8.99",
    image: "s16.png",
    time: "18 min",
    description:
      "A Minneapolis original with cheese stuffed inside the patty. Bite carefully — it oozes molten goodness with every single bite.",
    ingredients: [
      "Beef patty (cheese-stuffed)",
      "American cheese (inside)",
      "Brioche bun",
      "Lettuce & pickles",
      "Mustard & ketchup",
      "Caramelised onions",
    ],
  },
  {
    id: "teriyaki-burger",        // s18.png  (s17 skipped in HTML)
    name: "Teriyaki Burger",
    category: "Snack",
    price: "$9.99",
    image: "s18.png",
    time: "15 min",
    description:
      "Glazed with sweet-savory teriyaki sauce and topped with grilled pineapple. A tropical twist with Asian flair that hits every flavour note.",
    ingredients: [
      "Beef / chicken patty",
      "Teriyaki glaze",
      "Grilled pineapple ring",
      "Lettuce",
      "Sesame bun",
      "Japanese mayo",
    ],
  },
  {
    id: "ramen-burger",           // s19.png
    name: "Ramen Burger",
    category: "Snack",
    price: "$9.99",
    image: "s19.png",
    time: "20 min",
    description:
      "Swap the bun for crispy ramen noodle patties. Crunchy, chewy, and totally Instagram-worthy — a fusion burger unlike anything else.",
    ingredients: [
      "Crispy ramen noodle buns",
      "Beef patty",
      "Soy-glazed sauce",
      "Shredded lettuce",
      "Soft-boiled egg",
      "Nori strip",
    ],
  },
];

// ===== Utility: get URL param =====
function getParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

// ===== Merge static + custom products =====
function getAllProducts() {
  const raw = localStorage.getItem('cb_custom_menu');
  const custom = raw ? JSON.parse(raw) : [];

  // Normalise custom items so they have the same shape as static products
  const normalised = custom.map(item => ({
    id:          item.id,
    name:        item.name,
    category:    item.category,
    price:       item.price,
    image:       item.image || 'hot5.png.png',
    time:        item.time  || '—',
    description: item.description || '',
    ingredients: Array.isArray(item.ingredients) ? item.ingredients : [],
  }));

  return [...products, ...normalised];
}

// ===== Render product detail =====
function renderProduct(product) {
  document.title = `${product.name} — Coffee Brew`;

  document.getElementById("product-img").src = product.image;
  document.getElementById("product-img").alt = product.name;
  document.getElementById("product-name").textContent = product.name;
  document.getElementById("product-price").textContent = product.price;
  document.getElementById("product-time").textContent = product.time;
  document.getElementById("product-description").textContent = product.description;
  document.getElementById("product-category").textContent = product.category;

  const list = document.getElementById("ingredients-list");
  list.innerHTML = product.ingredients.length
    ? product.ingredients.map((ing) => `<li>${ing}</li>`).join("")
    : "<li>Details coming soon.</li>";
}

// ===== Render related products =====
function renderRelated(currentId, category) {
  const all = getAllProducts();

  const related = all
    .filter((p) => p.id !== currentId && p.category === category)
    .slice(0, 4);

  // Fill up to 4 from other categories if needed
  if (related.length < 4) {
    const others = all
      .filter((p) => p.id !== currentId && p.category !== category)
      .slice(0, 4 - related.length);
    related.push(...others);
  }

  const list = document.getElementById("related-list");
  list.innerHTML = related
    .map(
      (p) => `
      <li class="related-item">
        <a href="product.html?id=${p.id}">
          <img src="${p.image}" alt="${p.name}" onerror="this.src='hot5.png.png'">
          <span class="related-name">${p.name}</span>
          <span class="related-price">${p.price}</span>
        </a>
      </li>`
    )
    .join("");
}

// ===== Init =====
function init() {
  const id      = getParam("id");
  const product = getAllProducts().find((p) => p.id === id);

  if (!product) {
    document.querySelector(".product-detail-section .section-content").innerHTML =
      `<p class="not-found-msg">😕 Product not found. <a href="coffeshop.html#menu" style="color:var(--secondary-color)">Back to Menu</a></p>`;
    document.querySelector(".related-section").style.display = "none";
    return;
  }

  renderProduct(product);
  renderRelated(product.id, product.category);
}

init();
