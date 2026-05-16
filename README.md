# 🌿 Darukaa Biodiversity Platform

A mobile-first biodiversity intelligence platform that enables fieldworkers to capture and analyze ecological data directly from the ground using on-device plant identification.

---

# 📋 Table of Contents

1. Project Overview
2. Problem Statement
3. Key Features
4. Technical Architecture
5. Dataset & Model Training
6. Installation Guide
7. APK Build Instructions
8. CI/CD Pipeline
9. Project Structure
10. Testing
11. Challenges & Solutions
12. Future Improvements
13. Demo & Screenshots
14. Submission Checklist

---

# 🎯 Project Overview

**Darukaa Biodiversity Platform** is a mobile-first intelligence platform that empowers fieldworkers to capture and analyze ecological data directly from the ground. The app uses on-device machine learning to identify plant species in real-time, enabling biodiversity documentation even in remote areas without internet connectivity.

**Hackathon Context:**
Developed for the **Darukaa.earth Applied AI Engineer Intern Hackathon**

---

# ❓ Problem Statement

## Challenges Faced by Fieldworkers

| Challenge          | Description                                      |
| ------------------ | ------------------------------------------------ |
| 🌐 No Internet     | Biodiversity hotspots lack reliable connectivity |
| ⚡ Real-time Need   | Cloud processing is too slow for field work      |
| 📊 Data Management | No structured way to document observations       |
| 🔋 Battery Life    | Cloud processing drains device battery           |

## Our Solution

✅ Works entirely offline
✅ Real-time plant identification
✅ Local observation storage
✅ Share results when connected

---

# 🚀 Key Features

| Feature            | Description                                                |
| ------------------ | ---------------------------------------------------------- |
| 📸 Smart Camera    | Real-time camera with flash toggle and image preprocessing |
| 🤖 On-Device ML    | TensorFlow Lite model running entirely on device           |
| 💾 Offline Storage | Observations stored locally using AsyncStorage             |
| 📊 Results View    | Top predictions with confidence scores                     |
| 📋 History         | Chronological observation history                          |
| 📤 Share           | Export predictions through sharing apps                    |

---

# 🏗️ Technical Architecture

## Technology Stack

| Component        | Technology               | Version  |
| ---------------- | ------------------------ | -------- |
| Framework        | React Native + Expo      | SDK 54   |
| Camera           | expo-camera              | ~17.0.10 |
| ML Runtime       | react-native-fast-tflite | 1.0.0    |
| State Management | Zustand                  | 5.0.13   |
| Storage          | AsyncStorage             | 2.2.0    |
| Navigation       | React Navigation         | 7.x      |
| Language         | TypeScript               | 5.9.2    |

---

## System Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                      MOBILE DEVICE                         │
├─────────────────────────────────────────────────────────────┤
│ Camera ──▶ Preprocess ──▶ TFLite Model ──▶ Predictions     │
│    │             │               │               │         │
│    ▼             ▼               ▼               ▼         │
│ Capture      224x224 RGB     MobileNetV2     Top Classes  │
│                                                           │
│    ▼                                                       │
│ Zustand Store ◀────────────── Results Screen              │
│    │                                                       │
│    ▼                                                       │
│ AsyncStorage (Local DB)                                   │
│    │                                                       │
│    ▼                                                       │
│ History Screen                                             │
└─────────────────────────────────────────────────────────────┘
```

---

# 📊 Dataset & Model Training

## Dataset Used

### PlantNet-300K Dataset (Custom Subset)

| Parameter         | Value           |
| ----------------- | --------------- |
| Number of Classes | 25              |
| Input Size        | 224 x 224       |
| Model Type        | MobileNetV2     |
| Runtime           | TensorFlow Lite |
| Inference         | On-device       |

---

## Plant Species Included

1. Neem
2. Tulsi
3. Banyan
4. Peepal
5. Mango
6. Coconut
7. Banana
8. Rose
9. Marigold
10. Lotus
11. Aloe Vera
12. Jasmine
13. Hibiscus
14. Sandalwood
15. Bamboo
16. Oak
17. Maple
18. Pine
19. Sunflower
20. Lavender
21. Mint
22. Coriander
23. Tomato
24. Wheat
25. Rice

---

# 🧠 Model Architecture

```text
Input Image (224x224x3)
        ↓
MobileNetV2 Backbone
        ↓
GlobalAveragePooling
        ↓
Dense Layer
        ↓
Softmax Output
        ↓
Plant Prediction
```

---

## Training Configuration

| Parameter     | Value                           |
| ------------- | ------------------------------- |
| Batch Size    | 32                              |
| Epochs        | 10                              |
| Optimizer     | Adam                            |
| Learning Rate | 0.001                           |
| Loss Function | Sparse Categorical Crossentropy |

---

## Model Performance

| Metric            | Value   |
| ----------------- | ------- |
| Training Accuracy | ~89%    |
| TFLite Model Size | ~8 MB   |
| Inference Time    | ~150ms  |
| Platform          | Android |

---

# 📦 Installation Guide

## Prerequisites

```bash
node --version
npm --version
```

Install required tools:

```bash
npm install -g eas-cli
```

---

## Clone Repository

```bash
git clone https://github.com/your-username/mobile-first-biodiversity-intelligence-platform.git

cd mobile-first-biodiversity-intelligence-platform
```

---

## Install Dependencies

```bash
npm install --legacy-peer-deps
```

---

## Run Expo Doctor

```bash
npx expo-doctor
```

---

# 📱 APK Build Instructions

## Configure EAS

```bash
eas build:configure
```

---

## Generate APK

```bash
eas build --platform android --profile preview
```

---

## Download APK

Expo generates a downloadable APK build link after successful cloud build.

---

# 🔄 CI/CD Pipeline

GitHub Actions workflow automatically:

✅ installs dependencies
✅ checks formatting
✅ runs linting
✅ validates TypeScript
✅ prepares Android build

---

# 📁 Project Structure

```text
mobile-first-biodiversity-intelligence-platform/
│
├── assets/
│   ├── models/
│   │   └── plant_model.tflite
│   ├── labels/
│   │   └── labels.txt
│   └── images/
│
├── components/
├── screens/
├── services/
├── store/
├── utils/
├── android/
├── ios/
├── App.tsx
├── eas.json
├── package.json
└── README.md
```

---

# 🧪 Testing

## Tested Features

| Feature                 | Status |
| ----------------------- | ------ |
| Camera Access           | ✅      |
| Image Capture           | ✅      |
| TensorFlow Lite Loading | ✅      |
| Real-time Inference     | ✅      |
| Offline Storage         | ✅      |
| APK Build               | ✅      |
| Android Installation    | ✅      |

---

# ⚠️ Challenges & Solutions

| Challenge                        | Solution                                       |
| -------------------------------- | ---------------------------------------------- |
| Expo native dependency conflicts | Fixed using Expo SDK compatible packages       |
| TensorFlow Lite integration      | Used react-native-fast-tflite                  |
| Android build failures           | Resolved Gradle and package version mismatches |
| Large model size                 | Used MobileNetV2 lightweight architecture      |

---

# 🔮 Future Improvements

* Add GPS-based biodiversity mapping
* Add multilingual support
* Improve model accuracy
* Add cloud sync
* Add species information pages
* Add unknown-object rejection threshold
* Add offline dataset caching

---

# 📸 Demo & Screenshots

## Demo Video

Add your demo video link here.

Example:

```text
https://drive.google.com/your-demo-video-link
```

---

## Screenshots

Add screenshots inside:

```text
docs/screenshots/
```

Suggested screenshots:

* Home Screen
* Camera Screen
* Prediction Results
* History Screen

---

# ✅ Submission Checklist

| Task                        | Status |
| --------------------------- | ------ |
| Mobile-first app built      | ✅      |
| TensorFlow Lite integrated  | ✅      |
| On-device inference working | ✅      |
| APK generated               | ✅      |
| Offline support implemented | ✅      |
| README completed            | ✅      |

---

# 👨‍💻 Developer

**Ubaid Ashraf**


