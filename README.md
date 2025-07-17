# 🎨 Tomer Ben Horin – Art Gallery Management Platform

A comprehensive platform bridging artists, administrators, and art enthusiasts in a modern digital environment.

---

## 🧠 Project Overview

This project was developed for the **Tomer Ben Horin Association**, which currently runs a website promoting artists. While their existing platform allows artists to publish personal profiles, it lacks the ability to manage specific artwork submissions for exhibitions.

👉 **Our goal** was to create a management platform where:

- Artists can register for exhibitions
- Upload and edit specific artworks they wish to display
- Admins can review, approve, and manage submitted works
- All data integrates with the existing site structure

---

## 👥 Team Members

- Noor Kaloti
- Marwa Hoshieh
- Fatima Abuabed
- Yousef Hamda
- Musa Abu Alhawa

🔗 [Click here to view our project wiki](https://github.com/musa17-hawa/tomer-ben-horin/wiki)

---

## 🚀 Key Features

- Artist authentication and profile editing
- Exhibition registration system
- Artwork submission with image upload
- Admin dashboard for approval and moderation
- Firebase + Firestore integration for real-time updates

---

## 📚 What We Learned as a Team

- How to divide tasks and work collaboratively
- Improved communication and conflict resolution
- Efficient use of Git, React, Firebase, and Firestore
- Applying agile development methods and delivering iteratively

---

## ⚠️ Project Risks & How We Solved Them

### 1. Missing or Incorrect Artwork Data

- **Risk**: Artists might submit incomplete or incorrect data.
- **Solution**: We added required field validation and used placeholder images where needed.

### 2. Unauthorized Modifications

- **Risk**: Weak access controls could allow unauthorized editing.
- **Solution**: We implemented Firebase Authentication with role-based access rules.

---

## 🧪 Failed Tests & Fixes

### ✅ Artwork Display Test

- **Issue**: Artworks without images broke the exhibition layout.
- **Fix**: Added default placeholder image and improved error handling.

### ✅ Artwork Edit Test

- **Issue**: Changes to artwork titles/descriptions didn’t update in real time.
- **Fix**: Updated Firestore logic and re-rendered the component after edits.

---

## 📄 Final Presentation

You can download our full presentation here:

👉 [Download the project presentation (.pptx)](<https://github.com/musa17-hawa/tomer-ben-horin/raw/main/Tomer-Ben-Horin-Art-Gallery-Management-Platform%20(1).pptx>)
