const supabaseUrl = 'https://wksimigtgkfcdutaacie.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indrc2ltaWd0Z2tmY2R1dGFhY2llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgyMTc4NjQsImV4cCI6MjA1Mzc5Mzg2NH0.eR1TH9Gj1GKxM5OR6M45-4q3-opnxOLaNcOOMooqehI';
const supabase = supabase.createClient(https://wksimigtgkfcdutaacie.supabase.co, eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indrc2ltaWd0Z2tmY2R1dGFhY2llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgyMTc4NjQsImV4cCI6MjA1Mzc5Mzg2NH0.eR1TH9Gj1GKxM5OR6M45-4q3-opnxOLaNcOOMooqehI);
async function fetchProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*');
  
    if (error) {
      console.error('Error fetching products:', error);
      return;
    }
  
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // Clear existing content
  
    data.forEach(product => {
      const productDiv = document.createElement('div');
      productDiv.innerHTML = `
        <h3>${product.name}</h3>
        <p>$${product.price}</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
      `;
      productList.appendChild(productDiv);
    });
  }
  
  fetchProducts();
  const cart = [];

  function addToCart(productId) {
    const product = data.find(p => p.id === productId); // Assuming `data` is globally accessible
    cart.push(product);
    updateCartUI();
  }
  
  function updateCartUI() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = ''; // Clear existing content
  
    cart.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.innerHTML = `
        <p>${item.name} - $${item.price}</p>
      `;
      cartItems.appendChild(itemDiv);
    });
  }
  async function placeOrder() {
    const userId = 'USER_ID'; // Replace with actual user ID from Supabase auth
    const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);
  
    const { data, error } = await supabase
      .from('orders')
      .insert([{ user_id: userId, total_amount: totalAmount, status: 'pending' }])
      .single();
  
    if (error) {
      console.error('Error placing order:', error);
      return;
    }
  
    const orderId = data.id;
  
    // Insert order items
    const orderItems = cart.map(item => ({
      order_id: orderId,
      product_id: item.id,
      quantity: 1
    }));
  
    const { error: orderItemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
  
    if (orderItemsError) {
      console.error('Error adding order items:', orderItemsError);
      return;
    }
  
    alert('Order placed successfully!');
    cart.length = 0; // Clear the cart
    updateCartUI();
  }
  
  document.getElementById('checkout-btn').addEventListener('click', placeOrder);