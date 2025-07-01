// app/_layout.tsx - Root layout for the entire app
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
    return (
        <>
            <StatusBar style="dark" />
            <Stack
                screenOptions={{
                    headerShown: false,
                    animation: 'slide_from_right',
                }}
            >
                <Stack.Screen name="index" />
                <Stack.Screen name="auth/login" />
                <Stack.Screen name="auth/signup" />
                <Stack.Screen name="assessment" />
                <Stack.Screen name="discover" />
                <Stack.Screen name="chat/[id]" />
                <Stack.Screen name="(tabs)" />
            </Stack>
        </>
    );
}