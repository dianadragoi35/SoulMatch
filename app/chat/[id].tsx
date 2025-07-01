// app/chat/[id].tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
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

const ChatScreen = () => {
  const { id } = useLocalSearchParams();
  const matchId = parseInt(id as string);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadConversation();
  }, [matchId]);

  const loadConversation = async () => {
    try {
      const conversationsData = await AsyncStorage.getItem('conversations');
      if (conversationsData) {
        const conversations: Conversation[] = JSON.parse(conversationsData);
        const currentConversation = conversations.find(conv => conv.matchId === matchId);
        if (currentConversation) {
          setConversation(currentConversation);
        }
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!messageText.trim() || !conversation) return;

    const newMessage: Message = {
      id: Date.now(),
      sender: 'user',
      text: messageText.trim(),
      timestamp: new Date().toISOString(),
    };

    const updatedConversation = {
      ...conversation,
      messages: [...conversation.messages, newMessage],
    };

    setConversation(updatedConversation);
    setMessageText('');

    // Save to AsyncStorage
    try {
      const conversationsData = await AsyncStorage.getItem('conversations');
      const conversations: Conversation[] = conversationsData ? JSON.parse(conversationsData) : [];

      const index = conversations.findIndex(conv => conv.matchId === matchId);
      if (index >= 0) {
        conversations[index] = updatedConversation;
      } else {
        conversations.push(updatedConversation);
      }

      await AsyncStorage.setItem('conversations', JSON.stringify(conversations));
    } catch (error) {
      console.error('Error saving message:', error);
    }

    // Simulate response from match
    setTimeout(() => {
      simulateMatchResponse(updatedConversation);
    }, 1000);
  };

  const simulateMatchResponse = async (currentConversation: Conversation) => {
    const responses = [
      "That's such an interesting perspective! I never thought about it that way.",
      'I completely relate to that. It reminds me of a similar experience I had...',
      'Fascinating! Tell me more about your thoughts on this.',
      'I love how thoughtful your answer is. It shows real depth.',
      "That's a great point. It makes me wonder about...",
      "I appreciate you sharing that with me. It's quite insightful.",
    ];

    const response: Message = {
      id: Date.now() + 1,
      sender: 'match',
      text: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date().toISOString(),
    };

    const updatedConversation = {
      ...currentConversation,
      messages: [...currentConversation.messages, response],
    };

    setConversation(updatedConversation);

    // Save updated conversation
    try {
      const conversationsData = await AsyncStorage.getItem('conversations');
      const conversations: Conversation[] = conversationsData ? JSON.parse(conversationsData) : [];

      const index = conversations.findIndex(conv => conv.matchId === matchId);
      if (index >= 0) {
        conversations[index] = updatedConversation;
        await AsyncStorage.setItem('conversations', JSON.stringify(conversations));
      }
    } catch (error) {
      console.error('Error saving match response:', error);
    }
  };

  const useConversationStarter = (starter: string) => {
    setMessageText(starter);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === 'user'
          ? styles.userMessageContainer
          : item.sender === 'system'
            ? styles.systemMessageContainer
            : styles.matchMessageContainer,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          item.sender === 'user'
            ? styles.userMessage
            : item.sender === 'system'
              ? styles.systemMessage
              : styles.matchMessage,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            item.sender === 'user'
              ? styles.userMessageText
              : item.sender === 'system'
                ? styles.systemMessageText
                : styles.matchMessageText,
          ]}
        >
          {item.text}
        </Text>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading conversation...</Text>
      </View>
    );
  }

  if (!conversation) {
    return (
      <View style={styles.errorContainer}>
        <Text>Conversation not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const conversationStarters = [
    'What book changed your perspective on life?',
    'If you could have dinner with any philosopher, who would it be?',
    "What's a creative project that's been calling to you?",
    "What's the most fascinating thing you've learned recently?",
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#6b7280" />
            </TouchableOpacity>
            <View>
              <Text style={styles.matchName}>{conversation.matchName}</Text>
              <Text style={styles.personalityType}>{conversation.matchPersonalityType}</Text>
            </View>
          </View>
          <View style={styles.compatibilityBadge}>
            <Ionicons name="star" size={16} color="#fbbf24" />
            <Text style={styles.compatibilityText}>{conversation.compatibility}%</Text>
          </View>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={conversation.messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id.toString()}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContainer}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          onLayout={() => flatListRef.current?.scrollToEnd()}
        />

        {/* Conversation Starters */}
        {conversation.messages.length <= 1 && (
          <View style={styles.startersContainer}>
            <Text style={styles.startersTitle}>Conversation Starters:</Text>
            <View style={styles.startersGrid}>
              {conversationStarters.map((starter, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.starterButton}
                  onPress={() => useConversationStarter(starter)}
                >
                  <Text style={styles.starterButtonText}>"{starter}"</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Message Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.messageInput}
            value={messageText}
            onChangeText={setMessageText}
            placeholder="Share your thoughts..."
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, !messageText.trim() && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!messageText.trim()}
          >
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  matchName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  personalityType: {
    fontSize: 12,
    color: '#9333ea',
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
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 12,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  matchMessageContainer: {
    alignItems: 'flex-start',
  },
  systemMessageContainer: {
    alignItems: 'center',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  userMessage: {
    backgroundColor: '#9333ea',
  },
  matchMessage: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  systemMessage: {
    backgroundColor: '#f3f4f6',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userMessageText: {
    color: 'white',
  },
  matchMessageText: {
    color: '#374151',
  },
  systemMessageText: {
    color: '#6b7280',
    fontSize: 14,
  },
  startersContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  startersTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  startersGrid: {
    gap: 8,
  },
  starterButton: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
  },
  starterButtonText: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 12,
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#9333ea',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sendButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
});

export default ChatScreen;
