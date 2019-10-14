const faker = require('faker');
const fs = require('fs');

const getBooleans = (product) => { // these are just 50/50 true/false
  product.free_returns = (!Math.round(Math.random()));
  product.easy_exchange = (!Math.round(Math.random()));
  product.free_shipping = (!Math.round(Math.random()));
  product.two_day_shipping = (!Math.round(Math.random()));
};

const getShipDays = (product) => {
  const range = (Math.floor(Math.random() * 3)); // 1/3rd of the time, one of these options
  if (range === 0) { product.ship_days = 2; } // 2
  if (range === 1) { product.ship_days = Math.floor(Math.random() * 5) + 2; } // between 2-7
  if (range === 2) { product.ship_days = Math.floor(Math.random() * 12) + 2; } //  2-14
};

const getBoughtCount = (product) => {
  const range = (Math.floor(Math.random() * 6)); // 1/5th of the time, one of these options
  if (range === 0) { product.bought = 0; } // 0
  if (range === 1) { product.bought = Math.floor(Math.random() * 11); } // between 0-10
  if (range === 2) { product.bought = Math.floor(Math.random() * 91 + 10); } //  10-100
  if (range === 3) { product.bought = Math.floor(Math.random() * 901 + 100); } //  100-1000
  if (range === 4) { product.bought = Math.floor(Math.random() * 3001 + 1000); } //  1000-4000
  if (range === 5) { product.bought = Math.floor(Math.random() * 30001 + 4000); } //  4000-34000
};

const getReviews = (product) => {
  const range = (Math.floor(Math.floor() * 3));
  product.reviews = (Math.floor(Math.random() * 101));
  product.rating = (Math.floor(Math.random() * 11) / 2);
};

const getDateAndDiscount = (product, seed) => {
  if (!Math.round(Math.random())) {
    product.sale_price = [1, 2, 5, 10, 20][seed];
    product.sale_expires = Math.floor(Math.random() * 3); // days remaining (sales end@midnight)
    product.expires = product.sale_expires; // if discounted, sale ends when discount does
  } else {
    product.expires = Math.floor(Math.random() * 12) + 1; // otherwise, ends in 1-12 days
  }
};

const getPrices = (product, seed) => { // retail prices end in .99; discounts end in .97
  let priceSeed;
  if (seed === 0) { // 20% retail:$3.99-$12.99
    priceSeed = Math.floor(Math.random() * 10);
    product.price_retail = (priceSeed + 3.99).toFixed(2);
    product.price_discount = Math.floor((Math.random() * priceSeed) + 2.97);
  }
  if (seed === 1) { // 20%  between $13.99-$49.99
    priceSeed = Math.floor(Math.random() * 37);
    product.price_retail = (priceSeed + 13.99).toFixed(2);
    product.price_discount = Math.floor(Math.random() * priceSeed) + 9.97;
  }
  if (seed === 2) { // 20%  between $50.99 and $99.99
    priceSeed = Math.floor(Math.random() * 49);
    product.price_retail = (priceSeed + 49.99).toFixed(2);
    product.price_discount = Math.floor(Math.random() * priceSeed) + 45.97;
  }
  if (seed === 3) { // 20%  between $100.99 and $399.99
    priceSeed = Math.floor(Math.random() * 99);
    product.price_retail = (priceSeed + 99.99).toFixed(2);
    product.price_discount = Math.floor(Math.random() * priceSeed) + 89.97;
  }
  product.price_discount_percent = 1 - product.price_discount / product.price_retail;
};

const getQtyPrimary = (product) => {
  product.qty = (Math.floor(Math.random() * 101));
};

const getQtyOption = (option) => {
  option.qty = (Math.floor(Math.random() * 5));
};

const getOptions = (product, priceSeed) => {
  // A bunch of option types, weighted according to my whims
  const options = [];
  let optionTemp;

  // some manual sets of common options
  const blackandwhite = ['Color', 'White', 'Black'];
  options.push(blackandwhite, blackandwhite); // x2

  const monochromatic = ['Color', 'White', 'Black', 'Silver'];
  options.push(monochromatic, monochromatic); // x2

  const commoncolors = ['Color', 'White', 'Red', 'Blue', 'Black', 'Gray', 'Green'];
  options.push(commoncolors, commoncolors); // x2

  const lotsacolors = ['Color', 'White', 'Yellow', 'Blue', 'Red', 'Green', 'Black', 'Brown', 'Azure', 'Ivory', 'Teal', 'Silver', 'Purple', 'Navy blue', 'Pea green', 'Gray', 'Orange', 'Maroon', 'Charcoal', 'Aquamarine', 'Coral', 'Fuchsia', 'Wheat', 'Lime', 'Crimson', 'Khaki', 'Hot pink', 'Magenta', 'Plum', 'Olive', 'Cyan'];
  options.push(lotsacolors); // x1

  const tshirtsizes = ['Size', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
  options.push(tshirtsizes, tshirtsizes, tshirtsizes, tshirtsizes); // x4

  const shoesizes = ['Size', '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '12.5', '13', '13.5'];
  options.push(shoesizes, shoesizes, shoesizes, shoesizes); // x4

  // and 7 sets of fully random option sets
  for (let i = 0; i < 8; i++) {
    optionTemp = ['Options'];
    for (let j = 0; j < Math.ceil(Math.random() * 6); j++) {
      optionTemp.push(faker.random.words(Math.ceil(Math.random() * 3)));
    }
    options.push(optionTemp);
  }

  product.price_discount_percent = 0;
  const opt = options[Math.floor(Math.random() * options.length)];

  const samePrices = ((!Math.round(Math.random()))); // 50% chance all prices the same
  product.options = opt.map((option, index) => {
    optionTemp = { id: index, description: option };
    getQtyOption(optionTemp);
    getPrices(optionTemp, priceSeed);
    if (optionTemp.price_discount_percent > product.price_discount_percent) {
      product.default_option = index;
      product.price_discount_percent = optionTemp.price_discount_percent;
      product.price_retail = optionTemp.price_retail;
      product.price_discount = optionTemp.price_discount;
    }
    return optionTemp;
  });
};


const generateProducts = (count) => {
  const products = [];
  let product;
  let priceSeed;

  for (let i = 1; i <= count; i++) {
    product = { id: i };

    getBooleans(product);
    getShipDays(product);
    getBoughtCount(product);
    getReviews(product);

    // set a price range - this will affect a few subfunctions
    priceSeed = (Math.floor(Math.random() * 4));
    getDateAndDiscount(product, priceSeed);

    // get options or not
    if (!Math.round(Math.random())) {
      getOptions(product, priceSeed);
    } else {
      getPrices(product, priceSeed);
      getQtyPrimary(product);
    }

    products.push(product);
  }
  return products;
};

// console.log(JSON.stringify(generateProducts(100)));

fs.writeFileSync('./itemData.json', JSON.stringify(generateProducts(100)));
