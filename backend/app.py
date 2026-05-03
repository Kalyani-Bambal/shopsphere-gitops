from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Complete product catalog with 63 products across 8 categories with proper images
PRODUCTS = [
    # ===== CLOTHES (9 items) =====
    {"id": 1, "name": "Long Gown", "category": "Clothes", "price": 1999, "image": "https://cdn-icons-png.flaticon.com/512/3345/3345898.png", "rating": 4.5},
    {"id": 2, "name": "Sharara", "category": "Clothes", "price": 2499, "image": "https://cdn-icons-png.flaticon.com/512/3345/3345916.png", "rating": 4.3},
    {"id": 3, "name": "Lehenga", "category": "Clothes", "price": 3999, "image": "https://cdn-icons-png.flaticon.com/512/3345/3345922.png", "rating": 4.6},
    {"id": 4, "name": "One-Piece", "category": "Clothes", "price": 1699, "image": "https://cdn-icons-png.flaticon.com/512/3345/3345928.png", "rating": 4.4},
    {"id": 5, "name": "Short Skirt", "category": "Clothes", "price": 799, "image": "https://cdn-icons-png.flaticon.com/512/3345/3345934.png", "rating": 4.2},
    {"id": 6, "name": "Tops", "category": "Clothes", "price": 599, "image": "https://cdn-icons-png.flaticon.com/512/3345/3345940.png", "rating": 4.1},
    {"id": 7, "name": "T-Shirts", "category": "Clothes", "price": 499, "image": "https://cdn-icons-png.flaticon.com/512/3345/3345946.png", "rating": 4.3},
    {"id": 8, "name": "Jeans", "category": "Clothes", "price": 1299, "image": "https://cdn-icons-png.flaticon.com/512/3345/3345952.png", "rating": 4.5},
    {"id": 9, "name": "Long Skirt", "category": "Clothes", "price": 1499, "image": "https://cdn-icons-png.flaticon.com/512/3345/3345958.png", "rating": 4.4},
    
    # ===== MOBILES (7 items) =====
    {"id": 10, "name": "Nokia", "category": "Mobiles", "price": 12999, "image": "https://cdn-icons-png.flaticon.com/512/747/747376.png", "rating": 3.8},
    {"id": 11, "name": "Samsung", "category": "Mobiles", "price": 49999, "image": "https://cdn-icons-png.flaticon.com/512/747/747376.png", "rating": 4.6},
    {"id": 12, "name": "Oppo", "category": "Mobiles", "price": 29999, "image": "https://cdn-icons-png.flaticon.com/512/747/747376.png", "rating": 4.4},
    {"id": 13, "name": "Motorola", "category": "Mobiles", "price": 19999, "image": "https://cdn-icons-png.flaticon.com/512/747/747376.png", "rating": 4.2},
    {"id": 14, "name": "Apple", "category": "Mobiles", "price": 79999, "image": "https://cdn-icons-png.flaticon.com/512/747/747376.png", "rating": 4.8},
    {"id": 15, "name": "MI", "category": "Mobiles", "price": 24999, "image": "https://cdn-icons-png.flaticon.com/512/747/747376.png", "rating": 4.3},
    {"id": 16, "name": "Realme", "category": "Mobiles", "price": 16999, "image": "https://cdn-icons-png.flaticon.com/512/747/747376.png", "rating": 4.1},
    
    # ===== BEAUTY (11 items) =====
    {"id": 17, "name": "Kajal", "category": "Beauty", "price": 199, "image": "https://cdn-icons-png.flaticon.com/512/1370/1370839.png", "rating": 4.5},
    {"id": 18, "name": "Mascara", "category": "Beauty", "price": 299, "image": "https://cdn-icons-png.flaticon.com/512/1370/1370839.png", "rating": 4.4},
    {"id": 19, "name": "Lipsticks", "category": "Beauty", "price": 399, "image": "https://cdn-icons-png.flaticon.com/512/1370/1370847.png", "rating": 4.6},
    {"id": 20, "name": "Nail Paints", "category": "Beauty", "price": 249, "image": "https://cdn-icons-png.flaticon.com/512/1370/1370855.png", "rating": 4.3},
    {"id": 21, "name": "Compact", "category": "Beauty", "price": 349, "image": "https://cdn-icons-png.flaticon.com/512/1370/1370863.png", "rating": 4.2},
    {"id": 22, "name": "Foundation", "category": "Beauty", "price": 599, "image": "https://cdn-icons-png.flaticon.com/512/1370/1370871.png", "rating": 4.5},
    {"id": 23, "name": "Eyeshadow", "category": "Beauty", "price": 449, "image": "https://cdn-icons-png.flaticon.com/512/1370/1370879.png", "rating": 4.4},
    {"id": 24, "name": "Lipgloss", "category": "Beauty", "price": 299, "image": "https://cdn-icons-png.flaticon.com/512/1370/1370887.png", "rating": 4.3},
    {"id": 25, "name": "Blush", "category": "Beauty", "price": 359, "image": "https://cdn-icons-png.flaticon.com/512/1370/1370895.png", "rating": 4.4},
    {"id": 26, "name": "BB Cream", "category": "Beauty", "price": 499, "image": "https://cdn-icons-png.flaticon.com/512/1370/1370903.png", "rating": 4.5},
    {"id": 27, "name": "Primer", "category": "Beauty", "price": 449, "image": "https://cdn-icons-png.flaticon.com/512/1370/1370911.png", "rating": 4.3},
    
    # ===== FURNITURE (10 items) =====
    {"id": 28, "name": "Table", "category": "Furniture", "price": 8999, "image": "https://cdn-icons-png.flaticon.com/512/4436/4436481.png", "rating": 4.2},
    {"id": 29, "name": "Chair", "category": "Furniture", "price": 4999, "image": "https://cdn-icons-png.flaticon.com/512/4436/4436488.png", "rating": 4.3},
    {"id": 30, "name": "Bed", "category": "Furniture", "price": 19999, "image": "https://cdn-icons-png.flaticon.com/512/4436/4436495.png", "rating": 4.5},
    {"id": 31, "name": "Cupboard", "category": "Furniture", "price": 14999, "image": "https://cdn-icons-png.flaticon.com/512/4436/4436502.png", "rating": 4.4},
    {"id": 32, "name": "Study Table", "category": "Furniture", "price": 7999, "image": "https://cdn-icons-png.flaticon.com/512/4436/4436509.png", "rating": 4.2},
    {"id": 33, "name": "Laptop Table", "category": "Furniture", "price": 5999, "image": "https://cdn-icons-png.flaticon.com/512/4436/4436516.png", "rating": 4.1},
    {"id": 34, "name": "Mobile Phone Stand", "category": "Furniture", "price": 299, "image": "https://cdn-icons-png.flaticon.com/512/4436/4436523.png", "rating": 4.0},
    {"id": 35, "name": "Dressing Table", "category": "Furniture", "price": 11999, "image": "https://cdn-icons-png.flaticon.com/512/4436/4436530.png", "rating": 4.3},
    {"id": 36, "name": "Tea Table", "category": "Furniture", "price": 6999, "image": "https://cdn-icons-png.flaticon.com/512/4436/4436537.png", "rating": 4.2},
    {"id": 37, "name": "Dining Table", "category": "Furniture", "price": 19999, "image": "https://cdn-icons-png.flaticon.com/512/4436/4436544.png", "rating": 4.4},
    
    # ===== TRAVEL (7 items) =====
    {"id": 38, "name": "Bags", "category": "Travel", "price": 2499, "image": "https://cdn-icons-png.flaticon.com/512/924/924514.png", "rating": 4.3},
    {"id": 39, "name": "Sports Bags", "category": "Travel", "price": 1999, "image": "https://cdn-icons-png.flaticon.com/512/924/924514.png", "rating": 4.2},
    {"id": 40, "name": "Sports Shoes", "category": "Travel", "price": 3999, "image": "https://cdn-icons-png.flaticon.com/512/686/686090.png", "rating": 4.4},
    {"id": 41, "name": "Cap", "category": "Travel", "price": 599, "image": "https://cdn-icons-png.flaticon.com/512/3050/3050159.png", "rating": 4.1},
    {"id": 42, "name": "Hand Gloves", "category": "Travel", "price": 399, "image": "https://cdn-icons-png.flaticon.com/512/2991/2991146.png", "rating": 4.0},
    {"id": 43, "name": "Cycle", "category": "Travel", "price": 9999, "image": "https://cdn-icons-png.flaticon.com/512/558/558618.png", "rating": 4.3},
    {"id": 44, "name": "Side Bag", "category": "Travel", "price": 1299, "image": "https://cdn-icons-png.flaticon.com/512/924/924514.png", "rating": 4.2},
    
    # ===== HOME ACCESSORIES (6 items) =====
    {"id": 45, "name": "Wall Hanging", "category": "Home Accessories", "price": 1299, "image": "https://cdn-icons-png.flaticon.com/512/3556/3556098.png", "rating": 4.2},
    {"id": 46, "name": "God and Goddess Idol", "category": "Home Accessories", "price": 2999, "image": "https://cdn-icons-png.flaticon.com/512/3556/3556197.png", "rating": 4.5},
    {"id": 47, "name": "Showcase Items", "category": "Home Accessories", "price": 999, "image": "https://cdn-icons-png.flaticon.com/512/3556/3556098.png", "rating": 4.1},
    {"id": 48, "name": "Vase", "category": "Home Accessories", "price": 1699, "image": "https://cdn-icons-png.flaticon.com/512/3556/3556106.png", "rating": 4.3},
    {"id": 49, "name": "Flowers", "category": "Home Accessories", "price": 499, "image": "https://cdn-icons-png.flaticon.com/512/3556/3556210.png", "rating": 4.4},
    {"id": 50, "name": "Wall Poster", "category": "Home Accessories", "price": 699, "image": "https://cdn-icons-png.flaticon.com/512/3556/3556098.png", "rating": 4.2},
    
    # ===== ELECTRONICS (8 items) =====
    {"id": 51, "name": "Charger", "category": "Electronics", "price": 899, "image": "https://cdn-icons-png.flaticon.com/512/1336/1336494.png", "rating": 4.3},
    {"id": 52, "name": "Iron", "category": "Electronics", "price": 1899, "image": "https://cdn-icons-png.flaticon.com/512/1336/1336502.png", "rating": 4.1},
    {"id": 53, "name": "Headphones", "category": "Electronics", "price": 2999, "image": "https://cdn-icons-png.flaticon.com/512/3203/3203665.png", "rating": 4.5},
    {"id": 54, "name": "Headset", "category": "Electronics", "price": 1499, "image": "https://cdn-icons-png.flaticon.com/512/3203/3203665.png", "rating": 4.4},
    {"id": 55, "name": "Mobile Cover", "category": "Electronics", "price": 399, "image": "https://cdn-icons-png.flaticon.com/512/4436/4436568.png", "rating": 4.2},
    {"id": 56, "name": "Mouse", "category": "Electronics", "price": 799, "image": "https://cdn-icons-png.flaticon.com/512/1336/1336486.png", "rating": 4.3},
    {"id": 57, "name": "Keyboard", "category": "Electronics", "price": 1999, "image": "https://cdn-icons-png.flaticon.com/512/1336/1336478.png", "rating": 4.4},
    {"id": 58, "name": "Power Bank", "category": "Electronics", "price": 1299, "image": "https://cdn-icons-png.flaticon.com/512/1336/1336510.png", "rating": 4.3},
    
    # ===== GAMING ACCESSORIES (5 items) =====
    {"id": 59, "name": "Baby Toys", "category": "Gaming Accessories", "price": 499, "image": "https://cdn-icons-png.flaticon.com/512/1995/1995467.png", "rating": 4.2},
    {"id": 60, "name": "Soft Toys", "category": "Gaming Accessories", "price": 699, "image": "https://cdn-icons-png.flaticon.com/512/1995/1995467.png", "rating": 4.3},
    {"id": 61, "name": "Comics", "category": "Gaming Accessories", "price": 299, "image": "https://cdn-icons-png.flaticon.com/512/1995/1995562.png", "rating": 4.1},
    {"id": 62, "name": "Toddlers Toys", "category": "Gaming Accessories", "price": 899, "image": "https://cdn-icons-png.flaticon.com/512/1995/1995467.png", "rating": 4.2},
    {"id": 63, "name": "Juniors Toys", "category": "Gaming Accessories", "price": 1299, "image": "https://cdn-icons-png.flaticon.com/512/1995/1995467.png", "rating": 4.4},
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
