from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(_name_)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///clothing.db'
app.config['SECRET_KEY'] = 'your-secret-key-123'  # Change this!

db = SQLAlchemy(app)

# Routes
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/shop')
def shop():
    return render_template('shop.html')

# Add other routes as needed

if _name_ == '_main_':
    app.run(debug=True)