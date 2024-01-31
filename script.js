let sku = 0;
let token = 0;
let price_tags = [];

async function sendRequest(sku, token) {
  try {
    const response = await axios.post(
      'https://corsproxy.io/?https://connect.squareup.com/v2/catalog/search-catalog-items',
      {
        'text_filter': sku,
        "limit": 1,
      },
      {
        headers: {
          'Square-Version': '2024-01-18',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log(response.data);
    for (const item of response.data.items) {
      for (const variation of item.item_data.variations) {
        if (variation.id == response.data.matched_variation_ids) {
          const productName = item.item_data.name;
          const productVar = variation.item_variation_data.name;
          let price = variation.item_variation_data.price_money.amount;
          price /= 100;
          const productSku = variation.item_variation_data.sku;
          // Display message in output div
          document.getElementById('name').innerText = productName;
          document.getElementById('price').innerText = price;
  
          return [productName, productVar, price, productSku];
        }
      }
    }
    // If the loop doesn't find any matching variation, handle this case
    throw new Error("No matching variation found.");
  } catch (error) {
    // Display the error in the responseContainer div or handle it appropriately
    console.error(error);
    alert('No matching SKU found.');
    throw error;
  }
}

document.addEventListener('DOMContentLoaded', async function() {
  // Parse URL parameters
  const params = new URLSearchParams(window.location.search);
  sku = params.get('sku');
  token = params.get('token');

  price_tags = await sendRequest(sku, token);
});
