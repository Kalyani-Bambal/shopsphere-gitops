from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Sample product data
PRODUCTS = [
    {"id": 1, "name": "T-Shirt", "category": "Clothes", "price": 499, "image": "👕"},
    {"id": 2, "name": "Jeans", "category": "Clothes", "price": 1299, "image": "👖"},
    {"id": 3, "name": "iPhone 14", "category": "Mobiles", "price": 79999, "image": "📱"},
    {"id": 4, "name": "Samsung Galaxy", "category": "Mobiles", "price": 49999, "image": "📱"},
    {"id": 5, "name": "Lipstick", "category": "Beauty", "price": 299, "image": "💄"},
    {"id": 6, "name": "Face Cream", "category": "Beauty", "price": 599, "image": "🧴"},
    {"id": 7, "name": "Bed Sheet", "category": "Home Accessories", "price": 799, "image": "🛏️"},
    {"id": 8, "name": "Pillow", "category": "Home Accessories", "price": 499, "image": "🛌"},
    {"id": 9, "name": "Sofa", "category": "Furniture", "price": 29999, "image": "🛋️"},
    {"id": 10, "name": "Dining Table", "category": "Furniture", "price": 19999, "image": "🪑"},
    {"id": 11, "name": "Refrigerator", "category": "Electronics", "price": 34999, "image": "🧊"},
    {"id": 12, "name": "Washing Machine", "category": "Electronics", "price": 24999, "image": "🧺"},
    {"id": 13, "name": "Travel Bag", "category": "Travel", "price": 2999, "image": "�"},
    {"id": 14, "name": "Passport Holder", "category": "Travel", "price": 499, "image": "�"},
    {"id": 15, "name": "Gaming Laptop", "category": "Gaming Accessories", "price": 89999, "image": "�️"},
    {"id": 16, "name": "Gaming Mouse", "category": "Gaming Accessories", "price": 1999, "image": "🖱️"},
]

ORDERS = []

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy"}), 200

@app.route('/products', methods=['GET'])
def get_products():
    category = request.args.get('category')
    if category:
        filtered = [p for p in PRODUCTS if p['category'].lower() == category.lower()]
        return jsonify(filtered), 200
    return jsonify(PRODUCTS), 200

@app.route('/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = next((p for p in PRODUCTS if p['id'] == product_id), None)
    if product:
        return jsonify(product), 200
    return jsonify({"error": "Product not found"}), 404

@app.route('/orders', methods=['POST'])
def create_order():
    order_data = request.get_json()
    order = {
        "id": len(ORDERS) + 1,
        "items": order_data.get('items', []),
        "total": order_data.get('total', 0),
        "status": "confirmed"
    }
    ORDERS.append(order)
    return jsonify(order), 201

@app.route('/orders', methods=['GET'])
def get_orders():
    return jsonify(ORDERS), 200

@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "ShopSphere Backend API", "version": "1.0"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
