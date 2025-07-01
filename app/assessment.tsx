// app/assessment.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const personalityQuestions = [
    {
        id: 1,
        question: "How do you prefer to spend your ideal weekend?",
        options: [
            "Reading a book in a cozy café",
            "Exploring museums or art galleries",
            "Having deep conversations with friends",
            "Learning something completely new"
        ]
    },
    {
        id: 2,
        question: "What matters most to you in a conversation?",
        options: [
            "Intellectual depth and philosophical discussions",
            "Emotional connection and vulnerability",
            "Creative ideas and imagination",
            "Shared experiences and storytelling"
        ]
    },
    {
        id: 3,
        question: "How do you handle disagreements?",
        options: [
            "Seek to understand different perspectives",
            "Focus on finding common ground",
            "Engage in respectful debate",
            "Take time to reflect before responding"
        ]
    },
    {
        id: 4,
        question: "What energizes you most?",
        options: [
            "Deep one-on-one conversations",
            "Collaborative creative projects",
            "Intellectual challenges and puzzles",
            "Meaningful connections with others"
        ]
    },
    {
        id: 5,
        question: "In a relationship, what do you value most?",
        options: [
            "Intellectual compatibility and shared interests",
            "Emotional intimacy and understanding",
            "Mutual growth and personal development",
            "Shared values and life goals"
        ]
    }
];

const AssessmentScreen = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});

    const handleAnswer = async (questionId: number, answer: string) => {
        const newAnswers = { ...userAnswers, [questionId]: answer };
        setUserAnswers(newAnswers);

        if (currentQuestion < personalityQuestions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        } else {
            // Complete personality assessment
            try {
                const userData = await AsyncStorage.getItem('userData');
                if (userData) {
                    const user = JSON.parse(userData);
                    const updatedUser = {
                        ...user,
                        personalityType: "Authentic Connector",
                        answers: newAnswers
                    };
                    await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
                    router.replace('/discover');
                }
            } catch (error) {
                console.error('Error saving assessment:', error);
            }
        }
    };

    const question = personalityQuestions[currentQuestion];
    const progress = ((currentQuestion + 1) / personalityQuestions.length) * 100;

    return (
        <LinearGradient colors={['#dbeafe', '#f3e8ff']} style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <View style={styles.progressHeader}>
                            <Text style={styles.title}>Personality Assessment</Text>
                            <Text style={styles.progressText}>{currentQuestion + 1}/{personalityQuestions.length}</Text>
                        </View>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: `${progress}%` }]} />
                        </View>
                    </View>

                    <View style={styles.questionSection}>
                        <Text style={styles.questionText}>{question.question}</Text>
                        <View style={styles.optionsContainer}>
                            {question.options.map((option, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.optionButton}
                                    onPress={() => handleAnswer(question.id, option)}
                                >
                                    <Text style={styles.optionText}>{option}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
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
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    header: {
        marginBottom: 40,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
    },
    progressText: {
        fontSize: 14,
        color: '#6b7280',
    },
    progressBar: {
        height: 8,
        backgroundColor: '#e5e7eb',
        borderRadius: 4,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#9333ea',
        borderRadius: 4,
    },
    questionSection: {
        flex: 1,
    },
    questionText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 32,
        lineHeight: 26,
    },
    optionsContainer: {
        flex: 1,
    },
    optionButton: {
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: '#e5e7eb',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    optionText: {
        fontSize: 16,
        color: '#374151',
        lineHeight: 22,
    },
});

export default AssessmentScreen;