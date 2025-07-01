# SoulMatch - AI-Powered Dating App

SoulMatch is a React Native/Expo dating application that uses advanced AI for personality-based matching and relationship guidance. The app features personalized compatibility assessments, intelligent conversation starters, and AI-driven insights to help users find meaningful connections.

This project is built with [Expo](https://expo.dev) and managed using [Task Master AI](https://www.npmjs.com/package/task-master-ai) for structured development workflows.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Project Structure

### Key Technologies
- **React Native** with Expo Router for navigation
- **TypeScript** with strict mode for type safety  
- **AI Integration** for personality matching and conversation assistance
- **Task Master AI** for structured development workflows

### Code Quality Tools
The project enforces code quality through:
- **ESLint** with TypeScript and React Native rules
- **Prettier** for consistent formatting
- **TypeScript strict mode** for enhanced type checking
- **VS Code** settings for auto-formatting

### Development Workflow
This project uses Task Master AI for structured development:
```bash
# View current tasks
task-master list

# Get next task to work on  
task-master next

# Mark task complete
task-master set-status --id=<task-id> --status=done
```

## Project Progress

### ✅ Task 1.1: Setup Code Quality Tools Configuration
**Status:** Completed (July 1, 2025)

**Objective:** Configure ESLint, Prettier, and TypeScript strict mode with appropriate rules for React Native development.

**Implementation:**
- ✅ Enhanced ESLint configuration with TypeScript and React Native rules
- ✅ Configured Prettier with 100-character line width and consistent formatting
- ✅ Enabled TypeScript strict mode with enhanced type checking
- ✅ Added VS Code settings for auto-formatting and linting
- ✅ Installed development dependencies for code quality tools

**Files Modified:**
- `.prettierrc` - Prettier configuration with project standards
- `eslint.config.js` - Comprehensive ESLint rules for React Native/TypeScript
- `tsconfig.json` - Strict TypeScript configuration
- `.vscode/settings.json` - VS Code auto-formatting settings
- `package.json` - Added code quality tool dependencies

**Result:** Established foundational code quality infrastructure ensuring consistent formatting, proper TypeScript usage, and React Native best practices across the codebase.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.
- [Task Master AI Documentation](https://www.npmjs.com/package/task-master-ai): Learn about the task management system used in this project.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
