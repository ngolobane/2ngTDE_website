from flask import Blueprint, request, jsonify
from src.models.order import Order, OrderItem, db
from src.models.product import Product
from src.routes.auth import token_required

orders_bp = Blueprint('orders', __name__)

# Create new order (checkout)
@orders_bp.route('/', methods=['POST'])
@token_required
def create_order(current_user):
    data = request.get_json()
    
    # Check if required fields are present
    if not data or not data.get('items') or not data.get('shipping_address'):
        return jsonify({'message': 'Missing required fields'}), 400
    
    # Calculate total amount and check product availability
    total_amount = 0
    order_items = []
    
    for item in data['items']:
        product = Product.query.get(item['product_id'])
        if not product:
            return jsonify({'message': f'Product with ID {item["product_id"]} not found'}), 404
        
        if product.stock < item['quantity']:
            return jsonify({'message': f'Not enough stock for {product.name}'}), 400
        
        # Calculate price (use sale_price if available)
        price = product.sale_price if product.sale_price else product.price
        subtotal = price * item['quantity']
        total_amount += subtotal
        
        # Prepare order item
        order_items.append({
            'product_id': product.id,
            'quantity': item['quantity'],
            'price': price
        })
        
        # Update product stock
        product.stock -= item['quantity']
    
    # Create new order
    new_order = Order(
        user_id=current_user.id,
        total_amount=total_amount,
        shipping_address=data['shipping_address'],
        shipping_city=data.get('shipping_city', ''),
        shipping_state=data.get('shipping_state', ''),
        shipping_postal_code=data.get('shipping_postal_code', ''),
        shipping_country=data.get('shipping_country', ''),
        payment_method=data.get('payment_method', 'credit_card'),
        payment_status='paid' if data.get('payment_status') == 'paid' else 'pending'
    )
    
    # Save order to database
    db.session.add(new_order)
    db.session.commit()
    
    # Create order items
    for item in order_items:
        order_item = OrderItem(
            order_id=new_order.id,
            product_id=item['product_id'],
            quantity=item['quantity'],
            price=item['price']
        )
        db.session.add(order_item)
    
    # Commit all changes
    db.session.commit()
    
    return jsonify({
        'message': 'Order created successfully',
        'order': new_order.to_dict()
    }), 201

# Get user orders
@orders_bp.route('/', methods=['GET'])
@token_required
def get_user_orders(current_user):
    orders = Order.query.filter_by(user_id=current_user.id).all()
    orders_list = [order.to_dict() for order in orders]
    return jsonify(orders_list), 200

# Get single order
@orders_bp.route('/<int:order_id>', methods=['GET'])
@token_required
def get_order(current_user, order_id):
    order = Order.query.get_or_404(order_id)
    
    # Check if order belongs to current user or user is admin
    if order.user_id != current_user.id and not current_user.is_admin:
        return jsonify({'message': 'Unauthorized access'}), 403
    
    return jsonify(order.to_dict()), 200

# Update order status (admin only)
@orders_bp.route('/<int:order_id>', methods=['PUT'])
@token_required
def update_order(current_user, order_id):
    # Check if user is admin
    if not current_user.is_admin:
        return jsonify({'message': 'Admin access required'}), 403
    
    order = Order.query.get_or_404(order_id)
    data = request.get_json()
    
    # Update order fields
    if 'status' in data:
        order.status = data['status']
    if 'payment_status' in data:
        order.payment_status = data['payment_status']
    
    # Save to database
    db.session.commit()
    
    return jsonify({
        'message': 'Order updated successfully',
        'order': order.to_dict()
    }), 200

# Cancel order
@orders_bp.route('/<int:order_id>/cancel', methods=['PUT'])
@token_required
def cancel_order(current_user, order_id):
    order = Order.query.get_or_404(order_id)
    
    # Check if order belongs to current user or user is admin
    if order.user_id != current_user.id and not current_user.is_admin:
        return jsonify({'message': 'Unauthorized access'}), 403
    
    # Check if order can be cancelled
    if order.status not in ['pending', 'processing']:
        return jsonify({'message': 'Order cannot be cancelled at this stage'}), 400
    
    # Update order status
    order.status = 'cancelled'
    
    # Restore product stock
    for item in order.items:
        product = Product.query.get(item.product_id)
        if product:
            product.stock += item.quantity
    
    # Save to database
    db.session.commit()
    
    return jsonify({
        'message': 'Order cancelled successfully',
        'order': order.to_dict()
    }), 200
