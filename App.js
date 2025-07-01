// App.js - SoulMatch React Native App
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Alert,
    Dimensions,
    FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const SoulMatchApp = () => {
    const [currentView, setCurrentView] = useState('welcome');
    const [user, setUser] = useState(null);
    const [matches, setMatches] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [authData, setAuthData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        age: '',
        gender: '',
        interestedIn: ''
    });

    // Sample personality questions
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
        }
    ];

    // Enhanced sample matches with gender information
    const allMatches = [
        {
            id: 1,
            name: "Alex",
            age: 28,
            gender: "woman",
            compatibility: 94,
            personalityType: "Thoughtful Conversationalist",
            interests: ["Philosophy", "Literature", "Coffee Culture"],
            bio: "I believe the best connections happen when minds meet before eyes do. Love discussing everything from existentialism to the perfect brewing method.",
            revealLevel: 0,
            conversationStarters: [
                "What book changed your perspective on life?",
                "If you could have dinner with any philosopher, who would it be?"
            ]
        },
        {
            id: 2,
            name: "Sam",
            age: 25,
            gender: "non-binary",
            compatibility: 89,
            personalityType: "Creative Empath",
            interests: ["Art", "Psychology", "Music"],
            bio: "Artist at heart, psychology enthusiast by mind. I'm drawn to people who see beauty in ideas and aren't afraid to explore the depths of human nature.",
            revealLevel: 0,
            conversationStarters: [
                "What's a creative project that's been calling to you?",
                "How do you think art influences our emotions?"
            ]
        },
        {
            id: 3,
            name: "Jordan",
            age: 30,
            gender: "man",
            compatibility: 87,
            personalityType: "Intellectual Explorer",
            interests: ["Science", "Travel", "Documentaries"],
            bio: "Curious about everything, passionate about learning. I find intelligence incredibly attractive and love people who can teach me something new.",
            revealLevel: 1,
            conversationStarters: [
                "What's the most fascinating thing you've learned recently?",
                "If you could explore any scientific mystery, what would it be?"
            ]
        },
        {
            id: 4,
            name: "Morgan",
            age: 26,
            gender: "woman",
            compatibility: 91,
            personalityType: "Deep Thinker",
            interests: ["Poetry", "Meditation", "Sociology"],
            bio: "I find beauty in quiet moments and profound conversations. Looking for someone who appreciates the subtle complexities of human connection.",
            revealLevel: 0,
            conversationStarters: [
                "What's a moment of quiet beauty that stayed with you?",
                "How do you think we can better understand each other as humans?"
            ]
        },
        {
            id: 5,
            name: "River",
            age: 29,
            gender: "non-binary",
            compatibility: 85,
            personalityType: "Philosophical Dreamer",
            interests: ["Astronomy", "Ethics", "World Cultures"],
            bio: "Fascinated by the big questions and small wonders. I believe every person has a universe of stories worth exploring.",
            revealLevel: 0,
            conversationStarters: [
                "What question about existence keeps you awake at night?",
                "If you could understand any culture deeply, which would you choose?"
            ]
        },
        {
            id: 6,
            name: "Casey",
            age: 27,
            gender: "man",
            compatibility: 88,
            personalityType: "Empathetic Analyst",
            interests: ["History", "Social Justice", "Board Games"],
            bio: "I love understanding how the past shapes our present and how we can build a better future together. Deep conversations over coffee are my love language.",
            revealLevel: 0,
            conversationStarters: [
                "What historical period do you think we can learn most from?",
                "How do you think we can make the world more compassionate?"
            ]
        }
    ];

    const [userAnswers, setUserAnswers] = useState({});
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [messageText, setMessageText] = useState('');

    useEffect(() => {
        if (currentView === 'discover' && user?.interestedIn) {
            const filteredMatches = allMatches.filter(match => {
                if (user.interestedIn === 'everyone') return true;
                if (user.interestedIn === 'women') return match.gender === 'woman';
                if (user.interestedIn === 'men') return match.gender === 'man';
                if (user.interestedIn === 'non-binary') return match.gender === 'non-binary';
                return false;
            });
            setMatches(filteredMatches);
        }
    }, [currentView, user]);

    const handleAuth = () => {
        if (currentView === 'signup' && authData.password !== authData.confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        if (!authData.email || !authData.password) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        if (currentView === 'signup') {
            if (!authData.name || !authData.age || !authData.gender || !authData.interestedIn) {
                Alert.alert('Error', 'Please complete your profile information');
                return;
            }

            setUser({
                email: authData.email,
                name: authData.name,
                age: parseInt(authData.age),
                gender: authData.gender,
                interestedIn: authData.interestedIn
            });
            setCurrentView('assessment');
        } else {
            setUser({
                email: authData.email,
                name: 'Demo User',
                gender: 'woman',
                interestedIn: 'men'
            });
            setCurrentView('discover');
        }
    };

    const handleAnswer = (questionId, answer) => {
        setUserAnswers(prev => ({ ...prev, [questionId]: answer }));

        if (currentQuestion < personalityQuestions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        } else {
            setUser(prev => ({
                ...prev,
                personalityType: "Authentic Connector",
                answers: userAnswers
            }));
            setCurrentView('discover');
        }
    };

    const startConversation = (match) => {
        const newConversation = {
            id: Date.now(),
            matchId: match.id,
            matchName: match.name,
            messages: [
                {
                    id: 1,
                    sender: 'system',
                    text: `You've been matched with ${match.name}! Start with a personality-based conversation.`,
                    timestamp: new Date()
                }
            ]
        };
        setConversations(prev => [...prev, newConversation]);
        setSelectedMatch(match);
        setCurrentView('chat');
    };

    const sendMessage = (text) => {
        if (!selectedMatch || !text.trim()) return;

        const newMessage = {
            id: Date.now(),
            sender: 'user',
            text: text.trim(),
            timestamp: new Date()
        };

        setConversations(prev =>
            prev.map(conv =>
                conv.matchId === selectedMatch.id
                    ? { ...conv, messages: [...conv.messages, newMessage] }
                    : conv
            )
        );

        setMessageText('');

        // Simulate response
        setTimeout(() => {
            const responses = [
                "That's such an interesting perspective! I never thought about it that way.",
                "I completely relate to that. It reminds me of...",
                "Fascinating! Tell me more about your thoughts on this.",
                "I love how thoughtful your answer is. It shows real depth."
            ];

            const response = {
                id: Date.now() + 1,
                sender: 'match',
                text: responses[Math.floor(Math.random() * responses.length)],
                timestamp: new Date()
            };

            setConversations(prev =>
                prev.map(conv =>
                    conv.matchId === selectedMatch.id
                        ? { ...conv, messages: [...conv.messages, response] }
                        : conv
                )
            );
        }, 1000);
    };

    // Welcome Screen Component
    const WelcomeScreen = () => (
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
                            onPress={() => setCurrentView('login')}
                        >
                            <Text style={styles.primaryButtonText}>Login</Text>
                            <Ionicons name="arrow-forward" size={16} color="white" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.secondaryButton]}
                            onPress={() => setCurrentView('signup')}
                        >
                            <Text style={styles.secondaryButtonText}>Create Account</Text>
                            <Ionicons name="arrow-forward" size={16} color="#9333ea" />
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );

    // Auth Screen Component
    const AuthScreen = ({ isSignup }) => (
        <LinearGradient colors={['#f3e8ff', '#fce7f3']} style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.authContent}>
                        <View style={styles.authHeader}>
                            <Ionicons name="sparkles" size={48} color="#9333ea" />
                            <Text style={styles.authTitle}>
                                {isSignup ? 'Join SoulMatch' : 'Welcome Back'}
                            </Text>
                            <Text style={styles.authSubtitle}>
                                {isSignup ? 'Create your personality-first profile' : 'Sign in to continue your journey'}
                            </Text>
                        </View>

                        <View style={styles.formContainer}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Email</Text>
                                <TextInput
                                    style={styles.textInput}
                                    value={authData.email}
                                    onChangeText={(text) => setAuthData(prev => ({...prev, email: text}))}
                                    placeholder="your@email.com"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Password</Text>
                                <TextInput
                                    style={styles.textInput}
                                    value={authData.password}
                                    onChangeText={(text) => setAuthData(prev => ({...prev, password: text}))}
                                    placeholder="Enter your password"
                                    secureTextEntry
                                />
                            </View>

                            {isSignup && (
                                <>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputLabel}>Confirm Password</Text>
                                        <TextInput
                                            style={styles.textInput}
                                            value={authData.confirmPassword}
                                            onChangeText={(text) => setAuthData(prev => ({...prev, confirmPassword: text}))}
                                            placeholder="Confirm your password"
                                            secureTextEntry
                                        />
                                    </View>

                                    <View style={styles.rowContainer}>
                                        <View style={[styles.inputContainer, styles.halfWidth]}>
                                            <Text style={styles.inputLabel}>Name</Text>
                                            <TextInput
                                                style={styles.textInput}
                                                value={authData.name}
                                                onChangeText={(text) => setAuthData(prev => ({...prev, name: text}))}
                                                placeholder="Your name"
                                            />
                                        </View>
                                        <View style={[styles.inputContainer, styles.halfWidth]}>
                                            <Text style={styles.inputLabel}>Age</Text>
                                            <TextInput
                                                style={styles.textInput}
                                                value={authData.age}
                                                onChangeText={(text) => setAuthData(prev => ({...prev, age: text}))}
                                                placeholder="25"
                                                keyboardType="numeric"
                                            />
                                        </View>
                                    </View>

                                    {/* Note: In a real React Native app, you'd use a Picker component for dropdowns */}
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputLabel}>I am a (tap to select)</Text>
                                        <TouchableOpacity style={styles.selectInput}>
                                            <Text style={authData.gender ? styles.selectedText : styles.placeholderText}>
                                                {authData.gender || 'Select your gender'}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputLabel}>Interested in (tap to select)</Text>
                                        <TouchableOpacity style={styles.selectInput}>
                                            <Text style={authData.interestedIn ? styles.selectedText : styles.placeholderText}>
                                                {authData.interestedIn || 'Select your preference'}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )}

                            <TouchableOpacity
                                style={[styles.button, styles.primaryButton, styles.fullWidth]}
                                onPress={handleAuth}
                            >
                                <Text style={styles.primaryButtonText}>
                                    {isSignup ? 'Create Account' : 'Sign In'}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.linkButton}
                                onPress={() => setCurrentView(isSignup ? 'login' : 'signup')}
                            >
                                <Text style={styles.linkText}>
                                    {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.linkButton}
                                onPress={() => setCurrentView('welcome')}
                            >
                                <Text style={styles.backText}>← Back</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );

    // Personality Assessment Screen
    const PersonalityAssessment = () => {
        const question = personalityQuestions[currentQuestion];
        const progress = ((currentQuestion + 1) / personalityQuestions.length) * 100;

        return (
            <LinearGradient colors={['#dbeafe', '#f3e8ff']} style={styles.container}>
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.assessmentContent}>
                        <View style={styles.assessmentHeader}>
                            <View style={styles.progressHeader}>
                                <Text style={styles.assessmentTitle}>Personality Assessment</Text>
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

    // Match Card Component
    const MatchCard = ({ match }) => (
        <View style={styles.matchCard}>
            <View style={styles.matchHeader}>
                <View>
                    <Text style={styles.matchName}>{match.name}, {match.age}</Text>
                    <Text style={styles.personalityType}>{match.personalityType}</Text>
                </View>
                <View style={styles.compatibilityBadge}>
                    <Ionicons name="star" size={16} color="#fbbf24" />
                    <Text style={styles.compatibilityText}>{match.compatibility}%</Text>
                </View>
            </View>

            {match.revealLevel === 0 && (
                <View style={styles.personalityOnlyBadge}>
                    <Ionicons name="eye-off" size={16} color="#9333ea" />
                    <Text style={styles.personalityOnlyText}>Personality-only mode</Text>
                </View>
            )}

            <Text style={styles.bio}>{match.bio}</Text>

            <View style={styles.interestsSection}>
                <Text style={styles.interestsTitle}>Interests</Text>
                <View style={styles.interestsTags}>
                    {match.interests.map((interest, index) => (
                        <View key={index} style={styles.interestTag}>
                            <Text style={styles.interestTagText}>{interest}</Text>
                        </View>
                    ))}
                </View>
            </View>

            <TouchableOpacity
                style={[styles.button, styles.primaryButton, styles.fullWidth]}
                onPress={() => startConversation(match)}
            >
                <Ionicons name="chatbubble" size={16} color="white" />
                <Text style={styles.primaryButtonText}>Start Conversation</Text>
            </TouchableOpacity>

            <View style={styles.conversationStarters}>
                <Text style={styles.startersTitle}>Conversation starter:</Text>
                <Text style={styles.starterText}>"{match.conversationStarters[0]}"</Text>
            </View>
        </View>
    );

    // Discover Screen
    const DiscoverScreen = () => (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Discover</Text>
                    <View style={styles.headerActions}>
                        <TouchableOpacity
                            style={styles.headerButton}
                            onPress={() => setCurrentView('conversations')}
                        >
                            <Ionicons name="chatbubble-outline" size={20} color="#6b7280" />
                            <Text style={styles.headerButtonText}>Chats</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <FlatList
                    data={matches}
                    renderItem={({ item }) => <MatchCard match={item} />}
                    keyExtractor={(item) => item.id.toString()}
                    style={styles.matchesList}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.matchesContainer}
                />
            </SafeAreaView>
        </View>
    );

    // Render current view
    switch (currentView) {
        case 'welcome':
            return <WelcomeScreen />;
        case 'login':
            return <AuthScreen isSignup={false} />;
        case 'signup':
            return <AuthScreen isSignup={true} />;
        case 'assessment':
            return <PersonalityAssessment />;
        case 'discover':
            return <DiscoverScreen />;
        default:
            return <WelcomeScreen />;
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
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
    fullWidth: {
        width: '100%',
    },

    // Auth Screen Styles
    authContent: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    authHeader: {
        alignItems: 'center',
        marginBottom: 40,
    },
    authTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
        marginTop: 16,
        marginBottom: 8,
    },
    authSubtitle: {
        fontSize: 16,
        color: '#6b7280',
        textAlign: 'center',
    },
    formContainer: {
        flex: 1,
    },
    inputContainer: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 4,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        backgroundColor: 'white',
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfWidth: {
        width: '48%',
    },
    selectInput: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: 'white',
    },
    selectedText: {
        fontSize: 16,
        color: '#111827',
    },
    placeholderText: {
        fontSize: 16,
        color: '#9ca3af',
    },
    linkButton: {
        alignItems: 'center',
        paddingVertical: 8,
    },
    linkText: {
        color: '#9333ea',
        fontSize: 14,
    },
    backText: {
        color: '#6b7280',
        fontSize: 14,
    },

    // Assessment Screen Styles
    assessmentContent: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    assessmentHeader: {
        marginBottom: 40,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    assessmentTitle: {
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
        marginBottom: 24,
    },
    optionsContainer: {
        flex: 1,
    },
    optionButton: {
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: '#e5e7eb',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    optionText: {
        fontSize: 16,
        color: '#374151',
    },

    // Discover Screen Styles
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
    },
    headerActions: {
        flexDirection: 'row',
    },
    headerButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerButtonText: {
        marginLeft: 4,
        color: '#6b7280',
    },
    matchesList: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    matchesContainer: {
        padding: 16,
    },

    // Match Card Styles
    matchCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    matchHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    matchName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
    },
    personalityType: {
        fontSize: 14,
        fontWeight: '500',
        color: '#9333ea',
        marginTop: 4,
    },
    compatibilityBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fef3c7',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    compatibilityText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#374151',
        marginLeft: 4,
    },
    personalityOnlyBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3e8ff',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        marginBottom: 16,
    },
    personalityOnlyText: {
        fontSize: 12,
        color: '#9333ea',
        marginLeft: 8,
    },
    bio: {
        fontSize: 14,
        color: '#374151',
        lineHeight: 20,
        marginBottom: 16,
    },
    interestsSection: {
        marginBottom: 16,
    },
    interestsTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 8,
    },
    interestsTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    interestTag: {
        backgroundColor: '#f3f4f6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 4,
    },
    interestTagText: {
        fontSize: 12,
        color: '#374151',
    },
    conversationStarters: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
    },
    startersTitle: {
        fontSize: 12,
        fontWeight: '500',
        color: '#6b7280',
        marginBottom: 4,
    },
    starterText: {
        fontSize: 12,
        color: '#374151',
        fontStyle: 'italic',
    },
});

export default SoulMatchApp;