
from flask import Flask, render_template, request, jsonify
from flask_mail import Mail, Message
import os
from dotenv import load_dotenv


app = Flask(__name__)

# Flask-Mail Configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')  # Get email from info.env
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')  # Get app password from info.env
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_USERNAME')  # Set your Gmail as sender

mail = Mail(app)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/send-message', methods=['POST'])
def send_message():
    name = request.form.get('name')
    email = request.form.get('email')
    message_content = request.form.get('message')

    if not name or not email or not message_content:
        return jsonify({"message": "All fields are required"}), 400

    msg = Message(
        subject=f"New Contact Form Message from {name}",
        sender=app.config['MAIL_USERNAME'],  # Use your Gmail as sender
        recipients=['tejastikkas2545@gmail.com'],  # Your email to receive messages
        body=f"From: {name} ({email})\n\n{message_content}"
    )

    mail.send(msg)
    return jsonify({"message": "Message sent successfully!"})

if __name__ == '__main__':
    app.run(debug=True)
