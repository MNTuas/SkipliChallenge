# Skipli Challenge

This is a full-stack web application built as part of the Skipli technical challenge.  
The app allows users to verify their phone numbers via OTP (One Time Password), search GitHub users, like profiles, and view the liked profiles list.


---

## 🚀 Features

🔐 OTP-based phone verification (via Twilio)

🌐 GitHub username search using GitHub API

💾 Like and store favorite profiles in Firestore

💡 Firebase used for secure storage and authentication

---

## 🛠️ Technologies Used

| Layer       | Technology           |
| ----------- | -------------------- |
| Frontend    | ReactJS, TailwindCSS |
| Backend     | Node.js, Express     |
| Database    | Firebase Firestore   |
| OTP Service | Twilio API (SMS)     |
| API         | GitHub Public API    |


---

## 🚀 How to Run the Project Locally

### 1. Clone the repository
```bash
git clone https://github.com/MNTuas/SkipliChallenge.git
cd SkipliChallenge
```

### 2. Setup Environment Variables
In `skipli-server/.env`
```bash
TWILIO_ACCOUNT_SID=your_twilio_sid  
TWILIO_AUTH_TOKEN=your_twilio_token  
TWILIO_PHONE_NUMBER=+1XXXXXXXXXX  
FIREBASE_PROJECT_ID=your_firebase_id  
FIREBASE_PRIVATE_KEY=your_firebase_key  
FIREBASE_CLIENT_EMAIL=your_firebase_email  
```


### 3. Install dependencies

```bash
Server  
cd skipli-server  
npm install

Client  
cd ../skipli-client  
npm install
```
### 4. Run the project
```bash
Server  
cd skipli-server  
node server.js

Client  
cd ../skipli-client  
npm start
```
---

## 📁 Project Structure

```bash
SkipliChallenge/
├── skipli-client/       # React frontend
│   └── src/
│       ├── pages/

├── skipli-server/       # Node backend
│   ├── services/
│   └── twilioService/
│   └── firebase/
```

---

## 🖼️ Screenshots
![Screenshot 2025-05-31 180234](https://github.com/user-attachments/assets/a43a45f2-047c-460c-9ed9-851043f522bc)

![Screenshot 2025-05-31 180155](https://github.com/user-attachments/assets/82f88adc-350c-4ffb-aef7-2f0fb0285f66)

![Screenshot 2025-05-31 180211](https://github.com/user-attachments/assets/167be23a-2836-41b9-a8fd-1d81f34de3a9)

![Screenshot 2025-05-31 180223](https://github.com/user-attachments/assets/2dfd985b-a5d2-42cc-ac96-de888e23482d)

---
👨‍💻 Author
Developed by NGUYEN MINH TUAN
For the Skipli Full-Stack Coding Challenge


