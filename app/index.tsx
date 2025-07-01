// app/index.tsx - Main entry point for SoulMatch
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
interface User {
    id?: string;
    email: string;
    name: string;
    age: number;
    gender: string;
    interestedIn: string;
    personalityType?: string;
    answers?: Record<string, string>;
}

const SoulMatchHome = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check if user is logged in on app start
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const userData = await AsyncStorage.getItem('userData');
            if (userData) {
                setUser(JSON.parse(userData));
                // If user is logged in and has completed assessment, go to discover
                const parsedUser = JSON.parse(userData);
                if (parsedUser.personalityType) {
                    router.replace('/discover');
                } else {
                    router.replace('/assessment');
                }
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Ionicons name="sparkles" size={64} color="#9333ea" />
                <Text style={styles.loadingText}>SoulMatch</Text>
            </View>
        );
    }

    return (
        <LinearGradient colors={['#f3e8ff', '#fce7f3']} style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.welcomeContent}>
                    <View style={styles.logoSection}>
                        <Ionicons name="sparkles" size={64} color="#9333ea" />
                        <Text style={styles.appTitle}>SoulMatch</Text>
                        <Text style={styles.appSubtitle}>Where personalities connect before pictures</Text>
                    </View>

                    <View style={styles.featuresSection}>
                        <View style={styles.featureItem}>
                            <Ionicons name="heart" size={16} color="#ef4444" />
                            <Text style={styles.featureText}>Personality-first matching</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <Ionicons name="chatbubble" size={16} color="#3b82f6" />
                            <Text style={styles.featureText}>Meaningful conversations</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <Ionicons name="people" size={16} color="#22c55e" />
                            <Text style={styles.featureText}>Deep connections</Text>
                        </View>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.primaryButton]}
                            onPress={() => router.push('/auth/login')}
                        >
                            <Text style={styles.primaryButtonText}>Login</Text>
                            <Ionicons name="arrow-forward" size={16} color="white" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.secondaryButton]}
                            onPress={() => router.push('/auth/signup')}
                        >
                            <Text style={styles.secondaryButtonText}>Create Account</Text>
                            <Ionicons name="arrow-forward" size={16} color="#9333ea" />
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f3e8ff',
    },
    loadingText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
        marginTop: 16,
    },

    // Welcome Screen Styles
    welcomeContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    logoSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    appTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#111827',
        marginTop: 16,
        marginBottom: 8,
    },
    appSubtitle: {
        fontSize: 16,
        color: '#6b7280',
        textAlign: 'center',
    },
    featuresSection: {
        marginBottom: 40,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    featureText: {
        fontSize: 14,
        color: '#374151',
        marginLeft: 8,
    },
    buttonContainer: {
        width: '100%',
        maxWidth: 300,
    },

    // Button Styles
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        marginBottom: 12,
    },
    primaryButton: {
        backgroundColor: '#9333ea',
    },
    secondaryButton: {
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: '#9333ea',
    },
    primaryButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
        marginRight: 8,
    },
    secondaryButtonText: {
        color: '#9333ea',
        fontWeight: '600',
        fontSize: 16,
        marginRight: 8,
    },
});

export default SoulMatchHome;