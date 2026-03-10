import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Email configuration - Update with your Gmail credentials
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SENDER_EMAIL = "adeyanjutomide@gmail.com"  # Your Gmail address
# Gmail App Password (not regular password)
SENDER_PASSWORD = "ikap acoa fqjb mxnr"


def send_otp_email(recipient_email: str, otp: str):
    try:
        message = MIMEMultipart()
        message["From"] = SENDER_EMAIL
        message["To"] = recipient_email
        message["Subject"] = "Your Verification OTP"

        body = f"""
        <html>
            <body>
                <h2>Email Verification</h2>
                <p>Your OTP code is: <strong>{otp}</strong></p>
                <p>This code will expire in 10 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
            </body>
        </html>
        """

        message.attach(MIMEText(body, "html"))

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.send_message(message)

        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False
