import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
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

type ClassItem = {
  id: string;
  time: string;
  period: string;
  subject: string;
  lecturer: string;
  location: string;
  type: string;
};

export default function EditClassScreen() {
  const params = useLocalSearchParams();

  const classId =
    typeof params.id === "string" ? params.id : "";

  const originalDay =
    typeof params.day === "string" ? params.day : "";

  const [selectedDay, setSelectedDay] =
    useState(originalDay || "Monday");

  const [selectedType, setSelectedType] =
    useState("Lecture");

  const [subject, setSubject] = useState("");
  const [lecturer, setLecturer] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadClass();
  }, []);

  const loadClass = async () => {
    try {
      const saved =
        await AsyncStorage.getItem(SCHEDULE_KEY);

      if (!saved) {
        return;
      }

      const schedule: Record<string, ClassItem[]> =
        JSON.parse(saved);

      for (const day of days) {
        const classes = schedule[day] || [];

        const found = classes.find(
          (item) => item.id === classId
        );

        if (found) {
          setSubject(found.subject);
          setLecturer(found.lecturer);
          setTime(
            `${found.time}${
              found.period ? ` ${found.period}` : ""
            }`
          );
          setLocation(found.location);
          setSelectedType(found.type);
          setSelectedDay(day);

          break;
        }
      }
    } catch (error) {
      console.log(
        "EDIT CLASS LOAD ERROR:",
        error
      );
    }
  };

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

      const saved =
        await AsyncStorage.getItem(SCHEDULE_KEY);

      if (!saved) {
        Alert.alert(
          "Error",
          "Schedule data not found."
        );

        return;
      }

      const schedule: Record<string, ClassItem[]> =
        JSON.parse(saved);

      // Find and remove the old class
      let oldDay = "";

      for (const day of days) {
        const classes = schedule[day] || [];

        const found = classes.find(
          (item) => item.id === classId
        );

        if (found) {
          oldDay = day;
          break;
        }
      }

      if (!oldDay) {
        Alert.alert(
          "Error",
          "Class could not be found."
        );

        return;
      }

      schedule[oldDay] = schedule[oldDay].filter(
        (item) => item.id !== classId
      );

      // Format time
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

      const updatedClass: ClassItem = {
        id: classId,
        time: formattedTime,
        period,
        subject: subject.trim(),
        lecturer: lecturer.trim(),
        location: location.trim(),
        type: selectedType,
      };

      if (!schedule[selectedDay]) {
        schedule[selectedDay] = [];
      }

      schedule[selectedDay].push(updatedClass);

      await AsyncStorage.setItem(
        SCHEDULE_KEY,
        JSON.stringify(schedule)
      );

      console.log(
        "EDIT CLASS: Successfully updated"
      );

      router.replace({
        pathname: "/(tabs)/schedule",
        params: {
          day: selectedDay,
        },
      });
    } catch (error) {
      console.log(
        "EDIT CLASS SAVE ERROR:",
        error
      );

      Alert.alert(
        "Error",
        "Unable to update the class."
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

          <View style={styles.headerText}>
            <Text style={styles.title}>
              Edit Class
            </Text>

            <Text style={styles.subtitle}>
              Update your class information
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
            placeholder="Subject"
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
            placeholder="Lecturer"
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
            const active =
              selectedDay === day;

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
              : "Save Changes"}
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

  headerText: {
    flex: 1,
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