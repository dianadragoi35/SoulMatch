// app/(tabs)/discover.tsx - Tab version of Discover Screen
import React from 'react';
import DiscoverScreen from '../discover';

// This is just a wrapper that uses the same discover screen component
// for the tab navigation
export default function TabDiscoverScreen() {
  return <DiscoverScreen />;
}
