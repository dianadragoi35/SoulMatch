// app/auth/signup.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    Alert,
    ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authStyles } from '../../styles/authStyles';

const SignupScreen = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        age: '',
        gender: '',
        interestedIn: '',
    });

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSignup = async () => {
        if (formData.password !== formData.confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        if (!formData.email || !formData.password || !formData.name || !formData.age || !formData.gender || !formData.interestedIn) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        const userData = {
            email: formData.email,
            name: formData.name,
            age: parseInt(formData.age),
            gender: formData.gender,
            interestedIn: formData.interestedIn,
        };

        try {
            await AsyncStorage.setItem('userData', JSON.stringify(userData));
            router.replace('/assessment');
        } catch (error) {
            Alert.alert('Error', 'Failed to save user data');
        }
    };

    return (
        <LinearGradient colors={['#f3e8ff', '#fce7f3']} style={authStyles.container}>
            <SafeAreaView style={authStyles.safeArea}>
                <ScrollView style={authStyles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={authStyles.content}>
                        <View style={authStyles.header}>
                            <TouchableOpacity
                                style={authStyles.backButton}
                                onPress={() => router.back()}
                            >
                                <Ionicons name="arrow-back" size={24} color="#6b7280" />
                            </TouchableOpacity>
                            <Ionicons name="sparkles" size={48} color="#9333ea" />
                            <Text style={authStyles.title}>Join SoulMatch</Text>
                            <Text style={authStyles.subtitle}>Create your personality-first profile</Text>
                        </View>

                        <View style={authStyles.form}>
                            <View style={authStyles.inputContainer}>
                                <Text style={authStyles.label}>Email</Text>
                                <TextInput
                                    style={authStyles.input}
                                    value={formData.email}
                                    onChangeText={(text) => updateField('email', text)}
                                    placeholder="your@email.com"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            <View style={authStyles.inputContainer}>
                                <Text style={authStyles.label}>Password</Text>
                                <TextInput
                                    style={authStyles.input}
                                    value={formData.password}
                                    onChangeText={(text) => updateField('password', text)}
                                    placeholder="Enter your password"
                                    secureTextEntry
                                />
                            </View>

                            <View style={authStyles.inputContainer}>
                                <Text style={authStyles.label}>Confirm Password</Text>
                                <TextInput
                                    style={authStyles.input}
                                    value={formData.confirmPassword}
                                    onChangeText={(text) => updateField('confirmPassword', text)}
                                    placeholder="Confirm your password"
                                    secureTextEntry
                                />
                            </View>

                            <View style={authStyles.rowContainer}>
                                <View style={[authStyles.inputContainer, authStyles.halfWidth]}>
                                    <Text style={authStyles.label}>Name</Text>
                                    <TextInput
                                        style={authStyles.input}
                                        value={formData.name}
                                        onChangeText={(text) => updateField('name', text)}
                                        placeholder="Your name"
                                    />
                                </View>
                                <View style={[authStyles.inputContainer, authStyles.halfWidth]}>
                                    <Text style={authStyles.label}>Age</Text>
                                    <TextInput
                                        style={authStyles.input}
                                        value={formData.age}
                                        onChangeText={(text) => updateField('age', text)}
                                        placeholder="25"
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View>

                            {/* Gender Selection */}
                            <View style={authStyles.inputContainer}>
                                <Text style={authStyles.label}>I am a</Text>
                                <View style={authStyles.optionsContainer}>
                                    {['woman', 'man', 'non-binary', 'prefer-not-to-say'].map((option) => (
                                        <TouchableOpacity
                                            key={option}
                                            style={[
                                                authStyles.optionButton,
                                                formData.gender === option && authStyles.selectedOption
                                            ]}
                                            onPress={() => updateField('gender', option)}
                                        >
                                            <Text style={[
                                                authStyles.optionText,
                                                formData.gender === option && authStyles.selectedOptionText
                                            ]}>
                                                {option.charAt(0).toUpperCase() + option.slice(1).replace('-', ' ')}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Interest Selection */}
                            <View style={authStyles.inputContainer}>
                                <Text style={authStyles.label}>Interested in</Text>
                                <View style={authStyles.optionsContainer}>
                                    {['women', 'men', 'non-binary', 'everyone'].map((option) => (
                                        <TouchableOpacity
                                            key={option}
                                            style={[
                                                authStyles.optionButton,
                                                formData.interestedIn === option && authStyles.selectedOption
                                            ]}
                                            onPress={() => updateField('interestedIn', option)}
                                        >
                                            <Text style={[
                                                authStyles.optionText,
                                                formData.interestedIn === option && authStyles.selectedOptionText
                                            ]}>
                                                {option.charAt(0).toUpperCase() + option.slice(1)}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <TouchableOpacity style={authStyles.authButton} onPress={handleSignup}>
                                <Text style={authStyles.authButtonText}>Create Account</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={authStyles.linkButton}
                                onPress={() => router.push('/auth/login')}
                            >
                                <Text style={authStyles.linkText}>Already have an account? Sign in</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
};

export default SignupScreen;