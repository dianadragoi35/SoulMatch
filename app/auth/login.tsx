// app/auth/login.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authStyles } from '../../styles/authStyles';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        // For demo purposes - in real app, validate with backend
        const userData = {
            email,
            name: 'Demo User',
            age: 25,
            gender: 'woman',
            interestedIn: 'men',
            personalityType: 'Authentic Connector',
        };

        try {
            await AsyncStorage.setItem('userData', JSON.stringify(userData));
            router.replace('/discover');
        } catch (error) {
            Alert.alert('Error', 'Failed to save user data');
        }
    };

    return (
        <LinearGradient colors={['#f3e8ff', '#fce7f3']} style={authStyles.container}>
            <SafeAreaView style={authStyles.safeArea}>
                <View style={authStyles.content}>
                    <View style={authStyles.header}>
                        <TouchableOpacity
                            style={authStyles.backButton}
                            onPress={() => router.back()}
                        >
                            <Ionicons name="arrow-back" size={24} color="#6b7280" />
                        </TouchableOpacity>
                        <Ionicons name="sparkles" size={48} color="#9333ea" />
                        <Text style={authStyles.title}>Welcome Back</Text>
                        <Text style={authStyles.subtitle}>Sign in to continue your journey</Text>
                    </View>

                    <View style={authStyles.form}>
                        <View style={authStyles.inputContainer}>
                            <Text style={authStyles.label}>Email</Text>
                            <TextInput
                                style={authStyles.input}
                                value={email}
                                onChangeText={setEmail}
                                placeholder="your@email.com"
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={authStyles.inputContainer}>
                            <Text style={authStyles.label}>Password</Text>
                            <TextInput
                                style={authStyles.input}
                                value={password}
                                onChangeText={setPassword}
                                placeholder="Enter your password"
                                secureTextEntry
                            />
                        </View>

                        <TouchableOpacity style={authStyles.authButton} onPress={handleLogin}>
                            <Text style={authStyles.authButtonText}>Sign In</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={authStyles.linkButton}
                            onPress={() => router.push('/auth/signup')}
                        >
                            <Text style={authStyles.linkText}>Don't have an account? Sign up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
};

export default LoginScreen;