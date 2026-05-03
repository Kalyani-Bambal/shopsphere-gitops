from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Complete product catalog with 63 products across 8 categories with REAL product images
PRODUCTS = [
    # ===== CLOTHES (9 items) =====
    {"id": 1, "name": "Long Gown", "category": "Clothes", "price": 1999, "image": "https://images.unsplash.com/photo-1595777712802-b0d8b6bf96f8?w=400&h=400&fit=crop", "rating": 4.5},
    {"id": 2, "name": "Sharara", "category": "Clothes", "price": 2499, "image": "https://images.unsplash.com/photo-1610152291473-beced6922de9?w=400&h=400&fit=crop", "rating": 4.3},
    {"id": 3, "name": "Lehenga", "category": "Clothes", "price": 3999, "image": "https://images.unsplash.com/photo-1605164841126-f53e1dce4fc0?w=400&h=400&fit=crop", "rating": 4.6},
    {"id": 4, "name": "One-Piece", "category": "Clothes", "price": 1699, "image": "https://images.unsplash.com/photo-1568160161988-72a373150af3?w=400&h=400&fit=crop", "rating": 4.4},
    {"id": 5, "name": "Short Skirt", "category": "Clothes", "price": 799, "image": "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&fit=crop", "rating": 4.2},
    {"id": 6, "name": "Tops", "category": "Clothes", "price": 599, "image": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop", "rating": 4.1},
    {"id": 7, "name": "T-Shirts", "category": "Clothes", "price": 499, "image": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop", "rating": 4.3},
    {"id": 8, "name": "Jeans", "category": "Clothes", "price": 1299, "image": "https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?w=400&h=400&fit=crop", "rating": 4.5},
    {"id": 9, "name": "Long Skirt", "category": "Clothes", "price": 1499, "image": "https://images.unsplash.com/photo-1596445836379-39270a3c3e11?w=400&h=400&fit=crop", "rating": 4.4},
    
    # ===== MOBILES (7 items) =====
    {"id": 10, "name": "Nokia", "category": "Mobiles", "price": 12999, "image": "https://images.unsplash.com/photo-1599286513335-2c02bb3d95a0?w=400&h=400&fit=crop", "rating": 3.8},
    {"id": 11, "name": "Samsung", "category": "Mobiles", "price": 49999, "image": "https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=400&h=400&fit=crop", "rating": 4.6},
    {"id": 12, "name": "Oppo", "category": "Mobiles", "price": 29999, "image": "https://images.unsplash.com/photo-1511198566531-b34c7da5d0bb?w=400&h=400&fit=crop", "rating": 4.4},
    {"id": 13, "name": "Motorola", "category": "Mobiles", "price": 19999, "image": "https://images.unsplash.com/photo-1609994227352-cd4628902c4d?w=400&h=400&fit=crop", "rating": 4.2},
    {"id": 14, "name": "Apple", "category": "Mobiles", "price": 79999, "image": "https://images.unsplash.com/photo-1592286927505-1def25e63e67?w=400&h=400&fit=crop", "rating": 4.8},
    {"id": 15, "name": "MI", "category": "Mobiles", "price": 24999, "image": "https://images.unsplash.com/photo-1520394198949-09a6dd57af21?w=400&h=400&fit=crop", "rating": 4.3},
    {"id": 16, "name": "Realme", "category": "Mobiles", "price": 16999, "image": "https://images.unsplash.com/photo-1520275335684-36ca6ee50ee0?w=400&h=400&fit=crop", "rating": 4.1},
    
    # ===== BEAUTY (11 items) =====
    {"id": 17, "name": "Kajal", "category": "Beauty", "price": 199, "image": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop", "rating": 4.5},
    {"id": 18, "name": "Mascara", "category": "Beauty", "price": 299, "image": "https://images.unsplash.com/photo-1596217969968-f9c64f0a3e74?w=400&h=400&fit=crop", "rating": 4.4},
    {"id": 19, "name": "Lipsticks", "category": "Beauty", "price": 399, "image": "https://images.unsplash.com/photo-1586894572992-8282d47fd5e9?w=400&h=400&fit=crop", "rating": 4.6},
    {"id": 20, "name": "Nail Paints", "category": "Beauty", "price": 249, "image": "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=400&fit=crop", "rating": 4.3},
    {"id": 21, "name": "Compact", "category": "Beauty", "price": 349, "image": "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop", "rating": 4.2},
    {"id": 22, "name": "Foundation", "category": "Beauty", "price": 599, "image": "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=400&h=400&fit=crop", "rating": 4.5},
    {"id": 23, "name": "Eyeshadow", "category": "Beauty", "price": 449, "image": "https://images.unsplash.com/photo-1584708566400-8afa8e5aa31a?w=400&h=400&fit=crop", "rating": 4.4},
    {"id": 24, "name": "Lipgloss", "category": "Beauty", "price": 299, "image": "https://images.unsplash.com/photo-1586894572992-8282d47fd5e9?w=400&h=400&fit=crop", "rating": 4.3},
    {"id": 25, "name": "Blush", "category": "Beauty", "price": 359, "image": "https://images.unsplash.com/photo-1616708267537-b85faf00021e?w=400&h=400&fit=crop", "rating": 4.4},
    {"id": 26, "name": "BB Cream", "category": "Beauty", "price": 499, "image": "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=400&h=400&fit=crop", "rating": 4.5},
    {"id": 27, "name": "Primer", "category": "Beauty", "price": 449, "image": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop", "rating": 4.3},
    
    # ===== FURNITURE (10 items) =====
    {"id": 28, "name": "Table", "category": "Furniture", "price": 8999, "image": "https://images.unsplash.com/photo-1532372320572-cda0ee8e9d6d?w=400&h=400&fit=crop", "rating": 4.2},
    {"id": 29, "name": "Chair", "category": "Furniture", "price": 4999, "image": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop", "rating": 4.3},
    {"id": 30, "name": "Bed", "category": "Furniture", "price": 19999, "image": "https://images.unsplash.com/photo-1540576458063-018f3f06450d?w=400&h=400&fit=crop", "rating": 4.5},
    {"id": 31, "name": "Cupboard", "category": "Furniture", "price": 14999, "image": "https://images.unsplash.com/photo-1594620050212-cd4628902c4d?w=400&h=400&fit=crop", "rating": 4.4},
    {"id": 32, "name": "Study Table", "category": "Furniture", "price": 7999, "image": "https://images.unsplash.com/photo-1532372320572-cda0ee8e9d6d?w=400&h=400&fit=crop", "rating": 4.2},
    {"id": 33, "name": "Laptop Table", "category": "Furniture", "price": 5999, "image": "https://images.unsplash.com/photo-1523217311519-3267a7b7f31f?w=400&h=400&fit=crop", "rating": 4.1},
    {"id": 34, "name": "Mobile Phone Stand", "category": "Furniture", "price": 299, "image": "https://images.unsplash.com/photo-1562183241-bd70d63c72a2?w=400&h=400&fit=crop", "rating": 4.0},
    {"id": 35, "name": "Dressing Table", "category": "Furniture", "price": 11999, "image": "https://images.unsplash.com/photo-1540932239986-310128078e80?w=400&h=400&fit=crop", "rating": 4.3},
    {"id": 36, "name": "Tea Table", "category": "Furniture", "price": 6999, "image": "https://images.unsplash.com/photo-1559056199-641a0ac8b3f7?w=400&h=400&fit=crop", "rating": 4.2},
    {"id": 37, "name": "Dining Table", "category": "Furniture", "price": 19999, "image": "https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=400&h=400&fit=crop", "rating": 4.4},
    
    # ===== TRAVEL (7 items) =====
    {"id": 38, "name": "Bags", "category": "Travel", "price": 2499, "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop", "rating": 4.3},
    {"id": 39, "name": "Sports Bags", "category": "Travel", "price": 1999, "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop", "rating": 4.2},
    {"id": 40, "name": "Sports Shoes", "category": "Travel", "price": 3999, "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop", "rating": 4.4},
    {"id": 41, "name": "Cap", "category": "Travel", "price": 599, "image": "https://images.unsplash.com/photo-1615332379711-badad3c1cc63?w=400&h=400&fit=crop", "rating": 4.1},
    {"id": 42, "name": "Hand Gloves", "category": "Travel", "price": 399, "image": "https://images.unsplash.com/photo-1520638917432-3aa280207d4f?w=400&h=400&fit=crop", "rating": 4.0},
    {"id": 43, "name": "Cycle", "category": "Travel", "price": 9999, "image": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop", "rating": 4.3},
    {"id": 44, "name": "Side Bag", "category": "Travel", "price": 1299, "image": "https://images.unsplash.com/photo-1533298322715-9a20d92f0fac?w=400&h=400&fit=crop", "rating": 4.2},
    
    # ===== HOME ACCESSORIES (6 items) =====
    {"id": 45, "name": "Wall Hanging", "category": "Home Accessories", "price": 1299, "image": "https://images.unsplash.com/photo-1578926078328-123291c7ae83?w=400&h=400&fit=crop", "rating": 4.2},
    {"id": 46, "name": "God and Goddess Idol", "category": "Home Accessories", "price": 2999, "image": "https://images.unsplash.com/photo-1578926078328-123291c7ae83?w=400&h=400&fit=crop", "rating": 4.5},
    {"id": 47, "name": "Showcase Items", "category": "Home Accessories", "price": 999, "image": "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=400&fit=crop", "rating": 4.1},
    {"id": 48, "name": "Vase", "category": "Home Accessories", "price": 1699, "image": "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=400&fit=crop", "rating": 4.3},
    {"id": 49, "name": "Flowers", "category": "Home Accessories", "price": 499, "image": "https://images.unsplash.com/photo-1599599810694-b5ac4dd0c4b7?w=400&h=400&fit=crop", "rating": 4.4},
    {"id": 50, "name": "Wall Poster", "category": "Home Accessories", "price": 699, "image": "https://images.unsplash.com/photo-1599599810694-b5ac4dd0c4b7?w=400&h=400&fit=crop", "rating": 4.2},
    
    # ===== ELECTRONICS (8 items) =====
    {"id": 51, "name": "Charger", "category": "Electronics", "price": 899, "image": "https://images.unsplash.com/photo-1591585226160-4bd94f914862?w=400&h=400&fit=crop", "rating": 4.3},
    {"id": 52, "name": "Iron", "category": "Electronics", "price": 1899, "image": "https://images.unsplash.com/photo-1584365871208-cbf45f3f5db5?w=400&h=400&fit=crop", "rating": 4.1},
    {"id": 53, "name": "Headphones", "category": "Electronics", "price": 2999, "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop", "rating": 4.5},
    {"id": 54, "name": "Headset", "category": "Electronics", "price": 1499, "image": "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=400&h=400&fit=crop", "rating": 4.4},
    {"id": 55, "name": "Mobile Cover", "category": "Electronics", "price": 399, "image": "https://images.unsplash.com/photo-1601596542897-992cee38db84?w=400&h=400&fit=crop", "rating": 4.2},
    {"id": 56, "name": "Mouse", "category": "Electronics", "price": 799, "image": "https://images.unsplash.com/photo-1587829191301-4a2c3b7e2e1f?w=400&h=400&fit=crop", "rating": 4.3},
    {"id": 57, "name": "Keyboard", "category": "Electronics", "price": 1999, "image": "https://images.unsplash.com/photo-1587829191301-4a2c3b7e2e1f?w=400&h=400&fit=crop", "rating": 4.4},
    {"id": 58, "name": "Power Bank", "category": "Electronics", "price": 1299, "image": "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop", "rating": 4.3},
    
    # ===== GAMING ACCESSORIES (5 items) =====
    {"id": 59, "name": "Baby Toys", "category": "Gaming Accessories", "price": 499, "image": "https://images.unsplash.com/photo-1612528443702-f6741f3a6f1f?w=400&h=400&fit=crop", "rating": 4.2},
    {"id": 60, "name": "Soft Toys", "category": "Gaming Accessories", "price": 699, "image": "https://images.unsplash.com/photo-1612528443702-f6741f3a6f1f?w=400&h=400&fit=crop", "rating": 4.3},
    {"id": 61, "name": "Comics", "category": "Gaming Accessories", "price": 299, "image": "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=400&fit=crop", "rating": 4.1},
    {"id": 62, "name": "Toddlers Toys", "category": "Gaming Accessories", "price": 899, "image": "https://images.unsplash.com/photo-1612528443702-f6741f3a6f1f?w=400&h=400&fit=crop", "rating": 4.2},
    {"id": 63, "name": "Juniors Toys", "category": "Gaming Accessories", "price": 1299, "image": "https://images.unsplash.com/photo-1633113106292-7170ab60a8ee?w=400&h=400&fit=crop", "rating": 4.4},
]

ORDERS = []

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy"}), 200

@app.route('/products', methods=['GET'])
def get_products():
    category = request.args.get('category')
    search = request.args.get('search', '').lower()
    
    result = PRODUCTS
    
    if category:
        result = [p for p in result if p['category'].lower() == category.lower()]
    
    if search:
        result = [p for p in result if search in p['name'].lower()]
    
    return jsonify(result), 200

@app.route('/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = next((p for p in PRODUCTS if p['id'] == product_id), None)
    if product:
        return jsonify(product), 200
    return jsonify({"error": "Product not found"}), 404

@app.route('/search', methods=['GET'])
def search_products():
    query = request.args.get('q', '').lower()
    if not query:
        return jsonify({"error": "Search query required"}), 400
    
    results = [p for p in PRODUCTS if query in p['name'].lower() or query in p['category'].lower()]
    return jsonify(results), 200

@app.route('/orders', methods=['POST'])
def create_order():
    order_data = request.get_json()
    order = {
        "id": len(ORDERS) + 1,
        "items": order_data.get('items', []),
        "total": order_data.get('total', 0),
        "customer": order_data.get('customer', {}),
        "status": "confirmed",
        "timestamp": str(__import__('datetime').datetime.now())
    }
    ORDERS.append(order)
    return jsonify(order), 201

@app.route('/orders', methods=['GET'])
def get_orders():
    return jsonify(ORDERS), 200

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "message": "ShopSphere Backend API",
        "version": "2.0",
        "total_products": len(PRODUCTS),
        "categories": list(set([p['category'] for p in PRODUCTS]))
    }), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
