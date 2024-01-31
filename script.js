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
  const preElement = document.getElementById('json-content');
  let jsonContent = preElement.textContent;
  jsonContent = jsonContent.replace(/Product_name/g, price_tags[0]);
  jsonContent = jsonContent.replace(/Product_Price/g, price_tags[2]);
  preElement.textContent = jsonContent;
  var blob = new Blob([jsonContent], { type: 'application/json' });
            // Create a temporary link element to trigger the download
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'generated.json';
            // Append the link to the body and trigger the click event
            document.body.appendChild(link);
            link.click();
            // Clean up
            document.body.removeChild(link);


});
