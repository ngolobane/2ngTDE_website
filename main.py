from flask import Flask, send_from_directory
import os
import sys

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

# Initialize Flask app
app = Flask(__name__)

# Configure database
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{os.getenv('DB_USERNAME', 'root')}:{os.getenv('DB_PASSWORD', 'password')}@{os.getenv('DB_HOST', 'localhost')}:{os.getenv('DB_PORT', '3306')}/{os.getenv('DB_NAME', 'mydb')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev_secret_key')

# Import and initialize shared db instance
from src.models.db import db
db.init_app(app)

# Import models to create tables
from src.models.product import Product, Category
from src.models.user import User
from src.models.order import Order, OrderItem

# Register blueprints
from src.routes.auth import auth_bp
from src.routes.products import products_bp
from src.routes.orders import orders_bp

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(products_bp, url_prefix='/api/products')
app.register_blueprint(orders_bp, url_prefix='/api/orders')

# Serve static files
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

# Initialize database tables
# Flask 2.3+ removed before_first_request, using with_app_context instead
def create_tables():
    with app.app_context():
        db.create_all()
        
        # Check if we need to add initial data
        if Category.query.count() == 0:
            # Add categories
            categories = [
                Category(name='T-Shirts', description='Comfortable and stylish t-shirts', image_url='https://images.unsplash.com/photo-1489987707025-afc232f7ea0f', is_featured=True),
                Category(name='Jeans', description='Durable and fashionable jeans', image_url='https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec', is_featured=True),
                Category(name='Dresses', description='Elegant dresses for all occasions', image_url='https://images.unsplash.com/photo-1591369822096-ffd140ec948f', is_featured=True),
                Category(name='Sweaters', description='Warm and cozy sweaters', image_url='https://images.unsplash.com/photo-1617331721458-bd3bd3f9c7f8', is_featured=True),
                Category(name='Accessories', description='Complete your look with our accessories', image_url='https://images.unsplash.com/photo-1611923134239-b16b1d0885f4', is_featured=False)
            ]
            
            for category in categories:
                db.session.add(category)
            
            db.session.commit()
            
            # Add sample products
            products = [
                Product(name='Classic White T-Shirt', description='A comfortable white t-shirt made from 100% cotton', price=24.99, sale_price=19.99, image_url='https://images.unsplash.com/photo-1583743814966-8936f5b7be1a', category_id=1, stock=50, is_featured=True, is_new=True, is_sale=True),
                Product(name='Slim Fit Jeans', description='Modern slim fit jeans with a comfortable stretch', price=49.99, image_url='https://images.unsplash.com/photo-1541099649105-f69ad21f3246', category_id=2, stock=30, is_featured=True, is_new=False, is_sale=False),
                Product(name='Summer Floral Dress', description='Light and airy floral dress perfect for summer days', price=59.99, sale_price=39.99, image_url='https://images.unsplash.com/photo-1515372039744-b8f02a3ae446', category_id=3, stock=25, is_featured=True, is_new=False, is_sale=True),
                Product(name='Cozy Knit Sweater', description='Soft knit sweater to keep you warm during cold days', price=45.99, image_url='https://images.unsplash.com/photo-1631541911232-5c2b492ee226', category_id=4, stock=40, is_featured=True, is_new=True, is_sale=False)
            ]
            
            for product in products:
                db.session.add(product)
            
            db.session.commit()
            
            # Add admin user
            admin = User(
                username='admin',
                email='admin@example.com',
                is_admin=True
            )
            admin.set_password('admin123')
            db.session.add(admin)
            db.session.commit()

# Call the function to create tables and initialize data
create_tables()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
