import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Message = {
  id: string;
  text: string;
  sender: "ai" | "user";
};

const suggestions = [
  "What assignments are due soon?",
  "Show my current GPA",
  "What classes do I have today?",
  "How can I improve my grades?",
];

export default function AIAssistantScreen() {
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! 👋 I'm your UniFlow AI Assistant. How can I help you with your studies?",
      sender: "ai",
    },
  ]);

  const sendMessage = async (text?: string) => {
  const messageText = (text ?? message).trim();

  if (!messageText) return;

  const userMessage: Message = {
    id: Date.now().toString(),
    text: messageText,
    sender: "user",
  };

  setMessages((previous) => [
    ...previous,
    userMessage,
  ]);

  setMessage("");

  try {
    const response = await fetch(
      "http://192.168.65.25/api/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "AI request failed",
      );
    }

    const aiMessage: Message = {
      id: `${Date.now()}-ai`,
      text: data.reply,
      sender: "ai",
    };

    setMessages((previous) => [
      ...previous,
      aiMessage,
    ]);
  } catch (error) {
    console.log("AI request error:", error);

    const errorMessage: Message = {
      id: `${Date.now()}-error`,
      text: "Sorry, I couldn't connect to the AI server. Please try again.",
      sender: "ai",
    };

    setMessages((previous) => [
      ...previous,
      errorMessage,
    ]);
  }
};

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color="#111827"
          />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <View style={styles.aiIcon}>
            <Ionicons
              name="sparkles"
              size={20}
              color="#4F46E5"
            />
          </View>

          <View>
            <Text style={styles.headerTitle}>
              AI Assistant
            </Text>

            <View style={styles.onlineRow}>
              <View style={styles.onlineDot} />

              <Text style={styles.onlineText}>
                Online
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.headerSpacer} />
      </View>

      {/* Chat */}
      <ScrollView
        style={styles.chat}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Welcome Card */}
        {messages.length === 1 && (
          <View style={styles.welcomeCard}>
            <View style={styles.welcomeIcon}>
              <Ionicons
                name="sparkles"
                size={25}
                color="#4F46E5"
              />
            </View>

            <Text style={styles.welcomeTitle}>
              How can I help?
            </Text>

            <Text style={styles.welcomeText}>
              Ask me about your courses, grades,
              assignments, or schedule.
            </Text>
          </View>
        )}

        {/* Messages */}
        {messages.map((item) => (
          <View
            key={item.id}
            style={[
              styles.messageRow,
              item.sender === "user"
                ? styles.userRow
                : styles.aiRow,
            ]}
          >
            {item.sender === "ai" && (
              <View style={styles.messageIcon}>
                <Ionicons
                  name="sparkles"
                  size={16}
                  color="#4F46E5"
                />
              </View>
            )}

            <View
              style={[
                styles.messageBubble,
                item.sender === "user"
                  ? styles.userBubble
                  : styles.aiBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  item.sender === "user"
                    ? styles.userMessageText
                    : styles.aiMessageText,
                ]}
              >
                {item.text}
              </Text>
            </View>
          </View>
        ))}

        {/* Suggestions */}
        {messages.length === 1 && (
          <View style={styles.suggestionsSection}>
            <Text style={styles.suggestionsTitle}>
              Try asking
            </Text>

            {suggestions.map((suggestion) => (
              <TouchableOpacity
                key={suggestion}
                style={styles.suggestion}
                activeOpacity={0.8}
                onPress={() =>
                  sendMessage(suggestion)
                }
              >
                <Ionicons
                  name="chatbubble-outline"
                  size={17}
                  color="#4F46E5"
                />

                <Text style={styles.suggestionText}>
                  {suggestion}
                </Text>

                <Ionicons
                  name="chevron-forward"
                  size={17}
                  color="#94A3B8"
                />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputArea}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Ask UniFlow AI..."
            placeholderTextColor="#94A3B8"
            multiline
            maxLength={500}
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              !message.trim() &&
                styles.disabledSendButton,
            ]}
            activeOpacity={0.8}
            onPress={() => sendMessage()}
            disabled={!message.trim()}
          >
            <Ionicons
              name="send"
              size={19}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.disclaimer}>
          UniFlow AI Assistant
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  header: {
    height: 82,
    paddingHorizontal: 20,
    paddingTop: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
  },

  aiIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
  },

  onlineRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },

  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#10B981",
    marginRight: 5,
  },

  onlineText: {
    fontSize: 11,
    color: "#10B981",
    fontWeight: "600",
  },

  headerSpacer: {
    width: 42,
  },

  chat: {
    flex: 1,
  },

  chatContent: {
    padding: 20,
    paddingBottom: 24,
  },

  welcomeCard: {
    backgroundColor: "#EEF2FF",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    marginBottom: 22,
  },

  welcomeIcon: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 11,
  },

  welcomeTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#111827",
  },

  welcomeText: {
    fontSize: 13,
    lineHeight: 19,
    color: "#64748B",
    textAlign: "center",
    marginTop: 5,
  },

  messageRow: {
    flexDirection: "row",
    marginBottom: 14,
    alignItems: "flex-end",
  },

  aiRow: {
    justifyContent: "flex-start",
  },

  userRow: {
    justifyContent: "flex-end",
  },

  messageIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },

  messageBubble: {
    maxWidth: "78%",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 17,
  },

  aiBubble: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderBottomLeftRadius: 5,
  },

  userBubble: {
    backgroundColor: "#4F46E5",
    borderBottomRightRadius: 5,
  },

  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },

  aiMessageText: {
    color: "#334155",
  },

  userMessageText: {
    color: "#FFFFFF",
  },

  suggestionsSection: {
    marginTop: 8,
  },

  suggestionsTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 10,
  },

  suggestion: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 9,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  suggestionText: {
    flex: 1,
    fontSize: 13,
    color: "#334155",
    marginLeft: 9,
    marginRight: 8,
  },

  inputArea: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: Platform.OS === "ios" ? 22 : 12,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },

  inputContainer: {
    minHeight: 52,
    maxHeight: 110,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "flex-end",
    paddingLeft: 14,
    paddingRight: 7,
    paddingVertical: 6,
  },

  input: {
    flex: 1,
    minHeight: 38,
    maxHeight: 90,
    fontSize: 14,
    color: "#111827",
    paddingTop: 9,
    paddingBottom: 8,
  },

  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
  },

  disabledSendButton: {
    backgroundColor: "#C7D2FE",
  },

  disclaimer: {
    textAlign: "center",
    fontSize: 10,
    color: "#94A3B8",
    marginTop: 7,
  },
});