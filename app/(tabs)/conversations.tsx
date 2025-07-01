// app/(tabs)/conversations.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Message {
    id: number;
    sender: 'user' | 'match' | 'system';
    text: string;
    timestamp: string;
}

interface Conversation {
    matchId: number;
    matchName: string;
    matchPersonalityType: string;
    compatibility: number;
    messages: Message[];
}

const ConversationsScreen = () => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadConversations();

        // Set up a listener to refresh when returning from chat
        const unsubscribe = router.canGoBack();
        return () => {
            // Cleanup if needed
        };
    }, []);

    useEffect(() => {
        // Refresh conversations when screen comes into focus
        const interval = setInterval(loadConversations, 1000);
        return () => clearInterval(interval);
    }, []);

    const loadConversations = async () => {
        try {
            const conversationsData = await AsyncStorage.getItem('conversations');
            if (conversationsData) {
                const parsedConversations: Conversation[] = JSON.parse(conversationsData);
                // Sort by most recent message
                const sortedConversations = parsedConversations.sort((a, b) => {
                    const lastMessageA = a.messages[a.messages.length - 1];
                    const lastMessageB = b.messages[b.messages.length - 1];
                    return new Date(lastMessageB.timestamp).getTime() - new Date(lastMessageA.timestamp).getTime();
                });
                setConversations(sortedConversations);
            }
        } catch (error) {
            console.error('Error loading conversations:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const openChat = (conversation: Conversation) => {
        router.push(`/chat/${conversation.matchId}`);
    };

    const logout = async () => {
        try {
            await AsyncStorage.clear();
            router.replace('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return 'now';
        if (diffInMinutes < 60) return `${diffInMinutes}m`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
        return `${Math.floor(diffInMinutes / 1440)}d`;
    };

    const ConversationItem = ({ conversation }: { conversation: Conversation }) => {
        const lastMessage = conversation.messages[conversation.messages.length - 1];
        const isLastMessageFromMatch = lastMessage.sender === 'match';

        return (
            <TouchableOpacity
                style={styles.conversationItem}
                onPress={() => openChat(conversation)}
            >
                <View style={styles.conversationHeader}>
                    <View style={styles.conversationInfo}>
                        <Text style={styles.matchName}>{conversation.matchName}</Text>
                        <Text style={styles.personalityType}>{conversation.matchPersonalityType}</Text>
                    </View>
                    <View style={styles.conversationMeta}>
                        <Text style={styles.timestamp}>
                            {formatTimestamp(lastMessage.timestamp)}
                        </Text>
                        <View style={styles.compatibilityBadge}>
                            <Ionicons name="star" size={12} color="#fbbf24" />
                            <Text style={styles.compatibilityText}>{conversation.compatibility}%</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.lastMessageContainer}>
                    <Text
                        style={[
                            styles.lastMessageText,
                            isLastMessageFromMatch && styles.unreadMessage
                        ]}
                        numberOfLines={2}
                    >
                        {lastMessage.sender === 'system' ? lastMessage.text :
                            lastMessage.sender === 'user' ? `You: ${lastMessage.text}` :
                                lastMessage.text}
                    </Text>
                    {isLastMessageFromMatch && <View style={styles.unreadIndicator} />}
                </View>
            </TouchableOpacity>
        );
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading conversations...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Messages</Text>
                    <View style={styles.headerActions}>
                        <TouchableOpacity
                            style={styles.headerButton}
                            onPress={() => router.push('/discover')}
                        >
                            <Ionicons name="heart-outline" size={20} color="#6b7280" />
                            <Text style={styles.headerButtonText}>Discover</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.headerButton}
                            onPress={logout}
                        >
                            <Ionicons name="log-out-outline" size={20} color="#6b7280" />
                        </TouchableOpacity>
                    </View>
                </View>

                {conversations.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="chatbubble-outline" size={64} color="#d1d5db" />
                        <Text style={styles.emptyStateText}>No conversations yet</Text>
                        <Text style={styles.emptyStateSubtext}>
                            Start connecting with matches to begin meaningful conversations!
                        </Text>
                        <TouchableOpacity
                            style={styles.discoverButton}
                            onPress={() => router.push('/discover')}
                        >
                            <Text style={styles.discoverButtonText}>Find Matches</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        data={conversations}
                        renderItem={({ item }) => <ConversationItem conversation={item} />}
                        keyExtractor={(item) => item.matchId.toString()}
                        style={styles.conversationsList}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.conversationsContainer}
                    />
                )}
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    safeArea: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
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
        alignItems: 'center',
        gap: 16,
    },
    headerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        padding: 8,
    },
    headerButtonText: {
        color: '#6b7280',
        fontSize: 14,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    emptyStateText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#6b7280',
        marginTop: 16,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: '#9ca3af',
        marginTop: 8,
        textAlign: 'center',
        lineHeight: 20,
    },
    discoverButton: {
        backgroundColor: '#9333ea',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        marginTop: 24,
    },
    discoverButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
    conversationsList: {
        flex: 1,
    },
    conversationsContainer: {
        padding: 16,
    },
    conversationItem: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    conversationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    conversationInfo: {
        flex: 1,
    },
    matchName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
    },
    personalityType: {
        fontSize: 12,
        color: '#9333ea',
        marginTop: 2,
    },
    conversationMeta: {
        alignItems: 'flex-end',
        gap: 4,
    },
    timestamp: {
        fontSize: 12,
        color: '#6b7280',
    },
    compatibilityBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fef3c7',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    compatibilityText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#374151',
        marginLeft: 2,
    },
    lastMessageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    lastMessageText: {
        fontSize: 14,
        color: '#6b7280',
        flex: 1,
        lineHeight: 18,
    },
    unreadMessage: {
        color: '#111827',
        fontWeight: '500',
    },
    unreadIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#9333ea',
        marginLeft: 8,
    },
});

export default ConversationsScreen;