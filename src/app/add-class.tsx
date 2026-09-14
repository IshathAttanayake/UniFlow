import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const SCHEDULE_KEY = "@uniflow_schedule";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

const classTypes = [
  "Lecture",
  "Lab",
  "Tutorial",
];

export default function AddClassScreen() {
  const [selectedDay, setSelectedDay] =
    useState("Monday");

  const [selectedType, setSelectedType] =
    useState("Lecture");

  const [subject, setSubject] = useState("");
  const [lecturer, setLecturer] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");

  const [saving, setSaving] = useState(false);

const handleSave = async () => {
  if (saving) {
    return;
  }

  if (
    !subject.trim() ||
    !lecturer.trim() ||
    !time.trim() ||
    !location.trim()
  ) {
    Alert.alert(
      "Missing Information",
      "Please fill in all fields."
    );
    return;
  }

  try {
    setSaving(true);

    const storedData =
      await AsyncStorage.getItem(SCHEDULE_KEY);

    let schedule: Record<string, any[]> = {};

    if (storedData) {
      try {
        schedule = JSON.parse(storedData);
      } catch {
        schedule = {};
      }
    }

    if (!schedule[selectedDay]) {
      schedule[selectedDay] = [];
    }

    // Convert input like "1.00pm" or "1:00 PM"
    // into a cleaner display format
    const cleanTime = time
      .trim()
      .replace(/\s+/g, " ");

    let formattedTime = cleanTime;
    let period = "";

    const timeMatch = cleanTime.match(
      /^(\d{1,2}(?::|\.)\d{2})\s*(am|pm)$/i
    );

    if (timeMatch) {
      formattedTime = timeMatch[1];
      period = timeMatch[2].toUpperCase();
    }

    const newClass = {
      id: Date.now().toString(),
      time: formattedTime,
      period,
      subject: subject.trim(),
      lecturer: lecturer.trim(),
      location: location.trim(),
      type: selectedType,
    };

    schedule[selectedDay].push(newClass);

    await AsyncStorage.setItem(
      SCHEDULE_KEY,
      JSON.stringify(schedule)
    );

    console.log("SAVE CLASS: Successfully saved!");
console.log("SAVE CLASS: Navigating to schedule...");

router.replace({
  pathname: "/(tabs)/schedule",
  params: {
    day: selectedDay,
  },
});

router.replace({
  pathname: "/(tabs)/schedule",
  params: {
    day: selectedDay,
  },
});

    Alert.alert(
      "Success",
      "Class added successfully.",
      [
        {
          text: "OK",
          onPress: () => {
            router.replace("/(tabs)/schedule");
          },
        },
      ]
    );
  } catch (error) {
    console.log("SAVE CLASS ERROR:", error);

    Alert.alert(
      "Error",
      "Unable to save the class."
    );
  } finally {
    setSaving(false);
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color="#111827"
            />
          </TouchableOpacity>

          <View>
            <Text style={styles.title}>
              Add Class
            </Text>

            <Text style={styles.subtitle}>
              Add a class to your weekly schedule
            </Text>
          </View>
        </View>

        {/* Subject */}

        <Text style={styles.label}>
          Subject
        </Text>

        <View style={styles.inputContainer}>
          <Ionicons
            name="book-outline"
            size={20}
            color="#64748B"
          />

          <TextInput
            style={styles.input}
            placeholder="e.g. Database Management Systems"
            placeholderTextColor="#94A3B8"
            value={subject}
            onChangeText={setSubject}
          />
        </View>

        {/* Lecturer */}

        <Text style={styles.label}>
          Lecturer
        </Text>

        <View style={styles.inputContainer}>
          <Ionicons
            name="person-outline"
            size={20}
            color="#64748B"
          />

          <TextInput
            style={styles.input}
            placeholder="e.g. Dr. Kasun Perera"
            placeholderTextColor="#94A3B8"
            value={lecturer}
            onChangeText={setLecturer}
          />
        </View>

        {/* Day */}

        <Text style={styles.label}>
          Day
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.optionList}
        >
          {days.map((day) => {
            const active = selectedDay === day;

            return (
              <TouchableOpacity
                key={day}
                style={[
                  styles.option,
                  active && styles.activeOption,
                ]}
                onPress={() =>
                  setSelectedDay(day)
                }
              >
                <Text
                  style={[
                    styles.optionText,
                    active &&
                      styles.activeOptionText,
                  ]}
                >
                  {day.slice(0, 3)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Time */}

        <Text style={styles.label}>
          Time
        </Text>

        <View style={styles.inputContainer}>
          <Ionicons
            name="time-outline"
            size={20}
            color="#64748B"
          />

          <TextInput
            style={styles.input}
            placeholder="e.g. 09:00 AM"
            placeholderTextColor="#94A3B8"
            value={time}
            onChangeText={setTime}
            autoCapitalize="characters"
          />
        </View>

        <Text style={styles.helperText}>
          Example: 09:00 AM
        </Text>

        {/* Location */}

        <Text style={styles.label}>
          Location
        </Text>

        <View style={styles.inputContainer}>
          <Ionicons
            name="location-outline"
            size={20}
            color="#64748B"
          />

          <TextInput
            style={styles.input}
            placeholder="e.g. Lecture Hall A"
            placeholderTextColor="#94A3B8"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        {/* Type */}

        <Text style={styles.label}>
          Class Type
        </Text>

        <View style={styles.typeList}>
          {classTypes.map((type) => {
            const active =
              selectedType === type;

            return (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeOption,
                  active &&
                    styles.activeTypeOption,
                ]}
                onPress={() =>
                  setSelectedType(type)
                }
              >
                <Text
                  style={[
                    styles.typeOptionText,
                    active &&
                      styles.activeTypeOptionText,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Save */}

        <TouchableOpacity
          style={[
            styles.saveButton,
            saving && styles.disabledButton,
          ]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.8}
        >
          <Ionicons
            name="checkmark-circle-outline"
            size={21}
            color="#FFFFFF"
          />

          <Text style={styles.saveButtonText}>
            {saving
              ? "Saving..."
              : "Save Class"}
          </Text>
        </TouchableOpacity>


        {/* Cancel */}

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
          disabled={saving}
        >
          <Text style={styles.cancelButtonText}>
            Cancel
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  content: {
    padding: 24,
    paddingTop: 55,
    paddingBottom: 50,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  title: {
    fontSize: 27,
    fontWeight: "800",
    color: "#111827",
  },

  subtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 4,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    marginTop: 18,
  },

  inputContainer: {
    height: 52,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
    marginLeft: 10,
  },

  helperText: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 5,
  },

  optionList: {
    gap: 8,
    paddingBottom: 3,
  },

  option: {
    minWidth: 62,
    height: 44,
    paddingHorizontal: 15,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },

  activeOption: {
    backgroundColor: "#4F46E5",
    borderColor: "#4F46E5",
  },

  optionText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748B",
  },

  activeOptionText: {
    color: "#FFFFFF",
  },

  typeList: {
    flexDirection: "row",
    gap: 8,
  },

  typeOption: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },

  activeTypeOption: {
    backgroundColor: "#EEF2FF",
    borderColor: "#4F46E5",
  },

  typeOptionText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748B",
  },

  activeTypeOptionText: {
    color: "#4F46E5",
  },

  saveButton: {
    height: 54,
    borderRadius: 15,
    backgroundColor: "#4F46E5",
    marginTop: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  disabledButton: {
    opacity: 0.6,
  },

  saveButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  cancelButton: {
    height: 50,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },


  cancelButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#64748B",
  },
});