# JuriAid App

> A comprehensive legal assistant mobile application built with React Native, designed to help users analyze legal cases, access laws, and manage legal documentation efficiently.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Architectural Diagram](#architectural-diagram)
- [Technology Stack](#technology-stack)
- [Project Dependencies](#project-dependencies)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Team & Collaboration](#team--collaboration)

---

## 🎯 Project Overview

**JuriAid App** is a mobile application designed to provide legal assistance through intelligent case analysis, legal question generation, and comprehensive law database access. The application aims to democratize legal information and make legal processes more accessible to users through modern mobile technology.

### Key Objectives:
- Provide intelligent legal case analysis
- Generate relevant legal questions based on case details
- Offer comprehensive laws and regulations database
- Enable secure user authentication and profile management
- Facilitate easy case documentation and tracking

### Target Users:
- Legal professionals seeking quick case analysis
- Law students requiring legal research tools
- Individuals needing basic legal guidance
- Paralegals and legal assistants

---

## ✨ Features

### 1. **Authentication System**
   - User registration and login
   - Secure token-based authentication
   - Profile management

### 2. **Case Management**
   - Create and manage legal cases
   - Upload case documents
   - Analyze case details
   - Generate relevant legal questions
   - View analysis results

### 3. **Laws Database**
   - Browse comprehensive legal information
   - Search and filter laws
   - Access regulations and statutes

### 4. **User Profile**
   - Edit personal information
   - View user dashboard
   - Manage account settings

### 5. **Dashboard**
   - Home screen with quick access
   - Recent cases overview
   - Quick actions

---

## 🏗️ Architectural Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      JuriAid Mobile App                     │
│                    (React Native Layer)                     │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
┌──────────────┐ ┌─────────────┐ ┌──────────────┐
│ Presentation │ │ Navigation  │ │ State Mgmt   │
│    Layer     │ │   Layer     │ │   (Redux)    │
│              │ │             │ │              │
│  - Screens   │ │ - Bottom    │ │ - Store      │
│  - UI        │ │   Tabs      │ │ - Slices     │
│    Components│ │ - Stack     │ │ - Selectors  │
│              │ │   Navigator │ │              │
└──────────────┘ └─────────────┘ └──────────────┘
        │               │               │
        └───────────────┼───────────────┘
                        │
                        ▼
        ┌───────────────────────────┐
        │      Business Logic       │
        │        (API Layer)        │
        │                           │
        │  - auth.js                │
        │  - orchestrator.js        │
        │  - Axios HTTP Client      │
        └───────────┬───────────────┘
                    │
                    ▼
        ┌───────────────────────────┐
        │     Backend Services      │
        │      (REST APIs)          │
        │                           │
        │  - Authentication API     │
        │  - Case Analysis API      │
        │  - Laws Database API      │
        │  - User Profile API       │
        └───────────────────────────┘
                    │
                    ▼
        ┌───────────────────────────┐
        │       Data Layer          │
        │                           │
        │  - Database               │
        │  - File Storage           │
        │  - User Sessions          │
        └───────────────────────────┘


┌─────────────────────────────────────────────────────────────┐
│                   Application Architecture                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐         ┌──────────────┐                   │
│  │   Android   │         │     iOS      │                   │
│  │   Platform  │         │   Platform   │                   │
│  └─────────────┘         └──────────────┘                   │
│         │                        │                          │
│         └────────────┬───────────┘                          │
│                      │                                      │
│              ┌───────▼────────┐                             │
│              │  React Native  │                             │
│              │   Core Bridge  │                             │
│              └───────┬────────┘                             │
│                      │                                      │
│      ┌───────────────┼───────────────┐                      │
│      │               │               │                      │
│  ┌───▼────┐    ┌────▼─────┐   ┌────▼─────┐                  │
│  │UI Layer│    │Navigation│   │  Redux   │                  │
│  │Screens │    │  Stacks  │   │  Store   │                  │
│  └────────┘    └──────────┘   └──────────┘                  │
│                                                             │
└─────────────────────────────────────────────────────────────
```

### Component Flow:
1. **UI Layer**: Screens and components handle user interactions
2. **Navigation Layer**: Manages screen transitions and routing
3. **State Management**: Redux handles global application state
4. **API Layer**: Communicates with backend services
5. **Platform Layer**: Native Android/iOS implementations

---

## 🛠️ Technology Stack

### Core Technologies:
- **React Native** (v0.83.1) - Cross-platform mobile development
- **TypeScript** (v5.8.3) - Type-safe JavaScript
- **React** (v19.2.0) - UI component library

### Navigation:
- **React Navigation** (v7.1.26)
  - Bottom Tabs Navigator
  - Native Stack Navigator
  - Stack Navigator

### State Management:
- **Redux Toolkit** (v2.11.2)
- **React Redux** (v9.2.0)

### HTTP Client:
- **Axios** (v1.13.2)

### UI Components & Icons:
- **Lucide React Native** (v0.562.0) - Icon library
- **React Native SVG** (v15.15.1) - SVG support

### Storage:
- **AsyncStorage** (v2.2.0) - Local data persistence

### Development Tools:
- **Metro Bundler** - JavaScript bundler
- **Jest** (v29.6.3) - Testing framework
- **ESLint** - Code linting
- **Prettier** - Code formatting

---

## 📦 Project Dependencies

### Production Dependencies:

```json
{
  "@react-native-async-storage/async-storage": "^2.2.0",
  "@react-native-documents/picker": "^12.0.0",
  "@react-navigation/bottom-tabs": "^7.9.0",
  "@react-navigation/native": "^7.1.26",
  "@react-navigation/native-stack": "^7.9.0",
  "@react-navigation/stack": "^7.6.13",
  "@reduxjs/toolkit": "^2.11.2",
  "axios": "^1.13.2",
  "lucide-react-native": "^0.562.0",
  "react": "19.2.0",
  "react-native": "0.83.1",
  "react-native-gesture-handler": "^2.30.0",
  "react-native-safe-area-context": "^5.6.2",
  "react-native-screens": "^4.19.0",
  "react-native-svg": "^15.15.1",
  "react-redux": "^9.2.0"
}
```

### Development Dependencies:

```json
{
  "@babel/core": "^7.25.2",
  "@babel/preset-env": "^7.25.3",
  "@babel/runtime": "^7.25.0",
  "@react-native-community/cli": "20.0.0",
  "@react-native/babel-preset": "0.83.1",
  "@react-native/eslint-config": "0.83.1",
  "@react-native/metro-config": "0.83.1",
  "@react-native/typescript-config": "0.83.1",
  "@types/jest": "^29.5.13",
  "@types/react": "^19.2.0",
  "@types/react-test-renderer": "^19.1.0",
  "eslint": "^8.19.0",
  "jest": "^29.6.3",
  "prettier": "2.8.8",
  "react-test-renderer": "19.2.0",
  "typescript": "^5.8.3"
}
```

### System Requirements:
- **Node.js**: >= 20
- **React Native CLI**: 20.0.0
- **Android Studio** (for Android development)
- **Xcode** (for iOS development - macOS only)

---

## 🚀 Installation & Setup

### Prerequisites

1. **Node.js** (v20 or higher)
2. **React Native Environment** - Follow the [official guide](https://reactnative.dev/docs/set-up-your-environment)
3. **Android Studio** (for Android) or **Xcode** (for iOS)

### Installation Steps:

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd JuriAid_App
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **For iOS (macOS only):**
   ```bash
   # Install Ruby bundler
   bundle install
   
   # Install CocoaPods dependencies
   cd ios
   bundle exec pod install
   cd ..
   ```

4. **Android Setup:**
   - Ensure Android SDK is installed
   - Set up Android environment variables
   - Configure local.properties if needed

---

## 📱 Running the Application

### Start Metro Bundler:

```bash
npm start
# or
yarn start
```

### Run on Android:

```bash
npm run android
# or
yarn android
```

### Run on iOS (macOS only):

```bash
npm run ios
# or
yarn ios
```

### Run Tests:

```bash
npm test
# or
yarn test
```

### Linting:

```bash
npm run lint
# or
yarn lint
```

---

## 📁 Project Structure

```
JuriAid_App/
├── android/                 # Android native code
│   ├── app/
│   └── build.gradle
├── ios/                     # iOS native code
│   ├── JuriAid_App/
│   └── Podfile
├── src/                     # Application source code
│   ├── api/                # API integration
│   │   ├── auth.js         # Authentication APIs
│   │   ├── orchestrator.js # API orchestration
│   │   └── index.js        # API exports
│   ├── navigation/         # Navigation configuration
│   │   ├── BottomTabNavigator.js
│   │   ├── CasesStackNavigator.js
│   │   ├── LawsStackNavigator.js
│   │   └── ProfileStackNavigator.js
│   ├── redux/              # State management
│   │   ├── store.js        # Redux store
│   │   ├── slices/         # Redux slices
│   │   └── selector/       # State selectors
│   ├── screens/            # Application screens
│   │   ├── Auth/           # Authentication screens
│   │   ├── Cases/          # Case management screens
│   │   ├── dashboard/      # Dashboard screens
│   │   └── profile/        # Profile screens
│   └── App.js              # Main app component
├── __tests__/              # Test files
├── app.json                # App configuration
├── App.tsx                 # Root TypeScript component
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation
```

---

## 👥 Team & Collaboration

This project demonstrates collaborative software development practices through:

- **Version Control**: Git repository with complete commit history
- **Branch Management**: Feature branches and merge workflows
- **Code Reviews**: Pull request reviews and approvals
- **Team Coordination**: Distributed development across multiple contributors

### Git Repository Information:

- **Repository**: [Insert Repository URL]
- **Collaboration**: Full commit history showing team contributions
- **Branches**: Feature branches, development, and main/master
- **Merges**: Documented merge commits showing integration

---

## 📄 License

This project is developed as part of an academic presentation (PP1).

---

## 📞 Support & Contact

For questions or support regarding this project, please contact the development team through the repository's issue tracker.

---

## 🙏 Acknowledgments

- React Native Community
- Redux Team
- All open-source contributors
- Project mentors and evaluators

---

**Last Updated**: January 2026  
**Version**: 0.0.1  
**Status**: Active Development

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
