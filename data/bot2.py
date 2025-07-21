import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import tkinter as tk
from tkinter import messagebox


print("Script is running...")

def send_email(email_address, business_name):
    # Email credentials
    sender_email = "your-email@example.com"
    sender_password = "your-password"

    # Email content with dynamic placeholders
    subject = f"Boost Your Business: A Website for {business_name}"
    body = f"""
    Hi {business_name} Team,

    I noticed {business_name} doesn't have a website yet. 
    Having an online presence can connect you with more customers and help your business grow.

    I’d love to build a professional website tailored to your needs. Feel free to reply to this email, and let’s discuss how I can help!

    Best regards,
    Your Name
    """
    
    # Create the email
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = email_address
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    # Send the email
    try:
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, email_address, msg.as_string())
            print(f"Email sent to {email_address} about {business_name}")
    except Exception as e:
        print(f"Error sending email: {e}")
        raise e

# Tkinter GUI
def on_send():
    email_address = email_entry.get()
    business_name = business_entry.get()
    if email_address and business_name:
        try:
            send_email(email_address, business_name)
            messagebox.showinfo("Success", f"Email sent to {email_address}")
        except Exception as e:
            messagebox.showerror("Error", f"Failed to send email: {e}")
    else:
        messagebox.showwarning("Input Error", "Please fill out both fields!")

# Create the main window
root = tk.Tk()
root.title("Email Bot")

# Email Entry
tk.Label(root, text="Email Address:").grid(row=0, column=0, padx=10, pady=5)
email_entry = tk.Entry(root, width=30)
email_entry.grid(row=0, column=1, padx=10, pady=5)

# Business Name Entry
tk.Label(root, text="Business Name:").grid(row=1, column=0, padx=10, pady=5)
business_entry = tk.Entry(root, width=30)
business_entry.grid(row=1, column=1, padx=10, pady=5)

# Send Button
send_button = tk.Button(root, text="Send Email", command=on_send)
send_button.grid(row=2, column=0, columnspan=2, pady=10)

# Run the Tkinter event loop
root.mainloop()
