// app/discover.tsx - Complete Discover Screen
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  email: string;
  name: string;
  age: number;
  gender: string;
  interestedIn: string;
  personalityType?: string;
}

interface Match {
  id: number;
  name: string;
  age: number;
  gender: string;
  compatibility: number;
  personalityType: string;
  interests: string[];
  bio: string;
  revealLevel: number;
  conversationStarters: string[];
}

const allMatches: Match[] = [
  {
    id: 1,
    name: 'Alex',
    age: 28,
    gender: 'woman',
    compatibility: 94,
    personalityType: 'Thoughtful Conversationalist',
    interests: ['Philosophy', 'Literature', 'Coffee Culture'],
    bio: 'I believe the best connections happen when minds meet before eyes do. Love discussing everything from existentialism to the perfect brewing method.',
    revealLevel: 0,
    conversationStarters: [
      'What book changed your perspective on life?',
      'If you could have dinner with any philosopher, who would it be?',
    ],
  },
  {
    id: 2,
    name: 'Sam',
    age: 25,
    gender: 'non-binary',
    compatibility: 89,
    personalityType: 'Creative Empath',
    interests: ['Art', 'Psychology', 'Music'],
    bio: "Artist at heart, psychology enthusiast by mind. I'm drawn to people who see beauty in ideas and aren't afraid to explore the depths of human nature.",
    revealLevel: 0,
    conversationStarters: [
      "What's a creative project that's been calling to you?",
      'How do you think art influences our emotions?',
    ],
  },
  {
    id: 3,
    name: 'Jordan',
    age: 30,
    gender: 'man',
    compatibility: 87,
    personalityType: 'Intellectual Explorer',
    interests: ['Science', 'Travel', 'Documentaries'],
    bio: 'Curious about everything, passionate about learning. I find intelligence incredibly attractive and love people who can teach me something new.',
    revealLevel: 1,
    conversationStarters: [
      "What's the most fascinating thing you've learned recently?",
      'If you could explore any scientific mystery, what would it be?',
    ],
  },
  {
    id: 4,
    name: 'Morgan',
    age: 26,
    gender: 'woman',
    compatibility: 91,
    personalityType: 'Deep Thinker',
    interests: ['Poetry', 'Meditation', 'Sociology'],
    bio: 'I find beauty in quiet moments and profound conversations. Looking for someone who appreciates the subtle complexities of human connection.',
    revealLevel: 0,
    conversationStarters: [
      "What's a moment of quiet beauty that stayed with you?",
      'How do you think we can better understand each other as humans?',
    ],
  },
  {
    id: 5,
    name: 'River',
    age: 29,
    gender: 'non-binary',
    compatibility: 85,
    personalityType: 'Philosophical Dreamer',
    interests: ['Astronomy', 'Ethics', 'World Cultures'],
    bio: 'Fascinated by the big questions and small wonders. I believe every person has a universe of stories worth exploring.',
    revealLevel: 0,
    conversationStarters: [
      'What question about existence keeps you awake at night?',
      'If you could understand any culture deeply, which would you choose?',
    ],
  },
  {
    id: 6,
    name: 'Casey',
    age: 27,
    gender: 'man',
    compatibility: 88,
    personalityType: 'Empathetic Analyst',
    interests: ['History', 'Social Justice', 'Board Games'],
    bio: 'I love understanding how the past shapes our present and how we can build a better future together. Deep conversations over coffee are my love language.',
    revealLevel: 0,
    conversationStarters: [
      'What historical period do you think we can learn most from?',
      'How do you think we can make the world more compassionate?',
    ],
  },
];

const DiscoverScreen = () => {
  const [user, setUser] = useState<User | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    loadUserAndMatches();
  }, []);

  const loadUserAndMatches = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        // Filter matches based on user's preferences
        const filteredMatches = allMatches.filter(match => {
          if (parsedUser.interestedIn === 'everyone') return true;
          if (parsedUser.interestedIn === 'women') return match.gender === 'woman';
          if (parsedUser.interestedIn === 'men') return match.gender === 'man';
          if (parsedUser.interestedIn === 'non-binary') return match.gender === 'non-binary';
          return false;
        });

        setMatches(filteredMatches);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const startConversation = async (match: Match) => {
    try {
      // Save conversation data
      const conversationData = {
        matchId: match.id,
        matchName: match.name,
        matchPersonalityType: match.personalityType,
        compatibility: match.compatibility,
        messages: [
          {
            id: Date.now(),
            sender: 'system',
            text: `You've been matched with ${match.name}! Start with a personality-based conversation.`,
            timestamp: new Date().toISOString(),
          },
        ],
      };

      // Get existing conversations
      const existingConversations = await AsyncStorage.getItem('conversations');
      const conversations = existingConversations ? JSON.parse(existingConversations) : [];

      // Check if conversation already exists
      const existingIndex = conversations.findIndex((conv: any) => conv.matchId === match.id);
      if (existingIndex >= 0) {
        // Update existing conversation
        conversations[existingIndex] = conversationData;
      } else {
        // Add new conversation
        conversations.push(conversationData);
      }

      await AsyncStorage.setItem('conversations', JSON.stringify(conversations));

      // Navigate to chat
      router.push(`/chat/${match.id}`);
    } catch (error) {
      console.error('Error starting conversation:', error);
      Alert.alert('Error', 'Failed to start conversation');
    }
  };

  const logout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.clear();
            router.replace('/');
          } catch (error) {
            console.error('Error logging out:', error);
          }
        },
      },
    ]);
  };

  const navigateToConversations = () => {
    router.push('/(tabs)/conversations');
  };

  const MatchCard = ({ match }: { match: Match }) => (
    <View style={styles.matchCard}>
      <View style={styles.matchHeader}>
        <View>
          <Text style={styles.matchName}>
            {match.name}, {match.age}
          </Text>
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

      <TouchableOpacity style={styles.conversationButton} onPress={() => startConversation(match)}>
        <Ionicons name="chatbubble" size={16} color="white" />
        <Text style={styles.conversationButtonText}>Start Conversation</Text>
      </TouchableOpacity>

      <View style={styles.conversationStarters}>
        <Text style={styles.startersTitle}>Conversation starter:</Text>
        <Text style={styles.starterText}>"{match.conversationStarters[0]}"</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Discover</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton} onPress={navigateToConversations}>
              <Ionicons name="chatbubble-outline" size={20} color="#6b7280" />
              <Text style={styles.headerButtonText}>Chats</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={logout}>
              <Ionicons name="log-out-outline" size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>

        {matches.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="heart-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyStateText}>No matches found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try adjusting your preferences or check back later!
            </Text>
          </View>
        ) : (
          <FlatList
            data={matches}
            renderItem={({ item }) => <MatchCard match={item} />}
            keyExtractor={item => item.id.toString()}
            style={styles.matchesList}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.matchesContainer}
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
  },
  matchesList: {
    flex: 1,
  },
  matchesContainer: {
    padding: 16,
  },
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
    gap: 8,
  },
  interestTag: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  interestTagText: {
    fontSize: 12,
    color: '#374151',
  },
  conversationButton: {
    backgroundColor: '#9333ea',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  conversationButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
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

export default DiscoverScreen;
