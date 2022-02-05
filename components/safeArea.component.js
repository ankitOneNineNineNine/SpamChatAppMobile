import React from "react";
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";

export default function SafeArea({ children }) {
  return (
    <SafeAreaView style={{ flex: 1, marginTop: StatusBar?.currentHeight  }}>
      {children}
    </SafeAreaView>
  );
}
