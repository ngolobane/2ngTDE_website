from flask import Blueprint, request, jsonify
from src.models.product import Product, Category, db

products_bp = Blueprint('products', __name__)

# Get all products
@products_bp.route('/', methods=['GET'])
def get_products():
    # Get query parameters for filtering
    category = request.args.get('category')
    featured = request.args.get('featured')
    new = request.args.get('new')
    sale = request.args.get('sale')
    search = request.args.get('search')
    
    # Start with base query
    query = Product.query
    
    # Apply filters
    if category:
        category_obj = Category.query.filter_by(name=category).first()
        if category_obj:
            query = query.filter_by(category_id=category_obj.id)
    
    if featured and featured.lower() == 'true':
        query = query.filter_by(is_featured=True)
    
    if new and new.lower() == 'true':
        query = query.filter_by(is_new=True)
    
    if sale and sale.lower() == 'true':
        query = query.filter_by(is_sale=True)
    
    if search:
        query = query.filter(Product.name.ilike(f'%{search}%'))
    
    # Execute query
    products = query.all()
    
    # Convert to dict
    products_list = [product.to_dict() for product in products]
    
    return jsonify(products_list), 200

# Get single product
@products_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.query.get_or_404(product_id)
    return jsonify(product.to_dict()), 200

# Get all categories
@products_bp.route('/categories', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    categories_list = [category.to_dict() for category in categories]
    return jsonify(categories_list), 200

# Get featured products
@products_bp.route('/featured', methods=['GET'])
def get_featured_products():
    products = Product.query.filter_by(is_featured=True).all()
    products_list = [product.to_dict() for product in products]
    return jsonify(products_list), 200

# Get new products
@products_bp.route('/new', methods=['GET'])
def get_new_products():
    products = Product.query.filter_by(is_new=True).all()
    products_list = [product.to_dict() for product in products]
    return jsonify(products_list), 200

# Get sale products
@products_bp.route('/sale', methods=['GET'])
def get_sale_products():
    products = Product.query.filter_by(is_sale=True).all()
    products_list = [product.to_dict() for product in products]
    return jsonify(products_list), 200

# Admin routes for product management
# These routes should be protected with authentication middleware in production

# Create product
@products_bp.route('/', methods=['POST'])
def create_product():
    data = request.get_json()
    
    # Check if required fields are present
    if not data or not data.get('name') or not data.get('price') or not data.get('category_id'):
        return jsonify({'message': 'Missing required fields'}), 400
    
    # Create new product
    new_product = Product(
        name=data['name'],
        description=data.get('description'),
        price=data['price'],
        sale_price=data.get('sale_price'),
        image_url=data.get('image_url'),
        category_id=data['category_id'],
        stock=data.get('stock', 0),
        is_featured=data.get('is_featured', False),
        is_new=data.get('is_new', False),
        is_sale=data.get('is_sale', False)
    )
    
    # Save to database
    db.session.add(new_product)
    db.session.commit()
    
    return jsonify(new_product.to_dict()), 201

# Update product
@products_bp.route('/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    product = Product.query.get_or_404(product_id)
    data = request.get_json()
    
    # Update product fields
    if 'name' in data:
        product.name = data['name']
    if 'description' in data:
        product.description = data['description']
    if 'price' in data:
        product.price = data['price']
    if 'sale_price' in data:
        product.sale_price = data['sale_price']
    if 'image_url' in data:
        product.image_url = data['image_url']
    if 'category_id' in data:
        product.category_id = data['category_id']
    if 'stock' in data:
        product.stock = data['stock']
    if 'is_featured' in data:
        product.is_featured = data['is_featured']
    if 'is_new' in data:
        product.is_new = data['is_new']
    if 'is_sale' in data:
        product.is_sale = data['is_sale']
    
    # Save to database
    db.session.commit()
    
    return jsonify(product.to_dict()), 200

# Delete product
@products_bp.route('/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    product = Product.query.get_or_404(product_id)
    
    # Delete from database
    db.session.delete(product)
    db.session.commit()
    
    return jsonify({'message': 'Product deleted successfully'}), 200
