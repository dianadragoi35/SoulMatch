# SoulMatch - Personality-First Dating App

## Project Overview

SoulMatch is a React Native dating app built with Expo Router that prioritizes personality matching over physical appearance. Users complete personality assessments and connect through meaningful conversations.

## Tech Stack

- React Native with Expo SDK 53
- Expo Router for navigation
- TypeScript for type safety
- AsyncStorage for local data persistence
- Expo Vector Icons (Ionicons)
- Expo Linear Gradient

## Key Features

- Authentication system with gender preferences
- Personality assessment (5 questions)
- Smart matching based on user preferences
- Real-time chat
- Tab navigation between Discover and Messages
- "Personality-only mode" (photos hidden initially)

## Current File Structure

```
app/
├── index.tsx                 # Welcome/Auth check
├── _layout.tsx              # Root navigation
├── assessment.tsx           # Personality quiz
├── discover.tsx             # Browse matches
├── auth/
│   ├── login.tsx           # Login screen
│   └── signup.tsx          # Signup screen
├── chat/
│   └── [id].tsx           # Individual chat
└── (tabs)/
├── _layout.tsx        # Tab navigation
├── discover.tsx       # Tab wrapper
└── conversations.tsx  # Messages list
styles/
└── authStyles.ts           # Shared auth styles
```

## Data Models

- User: email, name, age, gender, interestedIn, personalityType
- Match: id, name, age, gender, compatibility, personalityType, interests, bio
- Message: id, sender, text, timestamp
- Conversation: matchId, matchName, messages[]

## Development Guidelines

- Use TypeScript for all new code
- Follow React Native best practices
- Maintain consistent styling with existing design system
- Use AsyncStorage for local data persistence
- Implement proper error handling and loading states
