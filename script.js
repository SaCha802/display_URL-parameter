let sku = 0;
let token = 0;

document.addEventListener('DOMContentLoaded', function() {
  // Parse URL parameters
  const params = new URLSearchParams(window.location.search);
  sku = params.get('sku');
  token = params.get('token');

  // Display message in output div
  if (message) {
    document.getElementById('output').innerText = message;
  } else {
    document.getElementById('output').innerText = 'No message found in URL parameters.';
  }
});

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
          'Square-Version': '2023-07-20',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log(response.data);
    for (var item of response.data.items) {
      for (var variations of item.item_data.variations) {
        if (variations.id == response.data.matched_variation_ids) {
          var product_name = item.item_data.name;
          var product_var = variations.item_variation_data.name;
          var price = variations.item_variation_data.price_money.amount;
          price /= 100;
          var sku = variations.item_variation_data.sku;
          return [product_name, product_var, price, sku];
        }
      }
    }
    // If the loop doesn't find any matching variation, you may want to handle this case as well.
    throw new Error("No matching variation found.");
  } catch (error) {
    // Display the error in the responseContainer div
    alert('No matching SKU found.');
    throw error;
  }
}
