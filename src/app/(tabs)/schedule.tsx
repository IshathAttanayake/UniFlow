import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";
import { useCallback, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const days = [
  { short: "Mon", full: "Monday", date: "25" },
  { short: "Tue", full: "Tuesday", date: "26" },
  { short: "Wed", full: "Wednesday", date: "27" },
  { short: "Thu", full: "Thursday", date: "28" },
  { short: "Fri", full: "Friday", date: "29" },
];

const SCHEDULE_KEY = "@uniflow_schedule";
const scheduleData: Record<string, any[]> = {
  Monday: [
    {
      time: "09:00",
      period: "AM",
      subject: "Software Engineering",
      lecturer: "Dr. Kasun Perera",
      location: "Lecture Hall A",
      type: "Lecture",
    },
    {
      time: "11:00",
      period: "AM",
      subject: "Database Management Systems",
      lecturer: "Ms. Nadeesha Silva",
      location: "Lab 02",
      type: "Lab",
    },
    {
      time: "02:00",
      period: "PM",
      subject: "Object Oriented Programming",
      lecturer: "Mr. Tharindu Fernando",
      location: "Lecture Hall B",
      type: "Lecture",
    },
    {
      time: "04:00",
      period: "PM",
      subject: "Data Structures & Algorithms",
      lecturer: "Mr. Chamara Jayasinghe",
      location: "Lab 01",
      type: "Tutorial",
    },
  ],

  Tuesday: [
    {
      time: "09:00",
      period: "AM",
      subject: "Computer Networks",
      lecturer: "Mr. Dilan Perera",
      location: "Lab 03",
      type: "Lab",
    },
    {
      time: "11:00",
      period: "AM",
      subject: "Operating Systems",
      lecturer: "Dr. Ruwan Silva",
      location: "Lecture Hall B",
      type: "Lecture",
    },
    {
      time: "02:00",
      period: "PM",
      subject: "Software Engineering",
      lecturer: "Dr. Kasun Perera",
      location: "Lecture Hall A",
      type: "Tutorial",
    },
  ],

  Wednesday: [
    {
      time: "10:00",
      period: "AM",
      subject: "Database Management Systems",
      lecturer: "Ms. Nadeesha Silva",
      location: "Lecture Hall A",
      type: "Lecture",
    },
    {
      time: "01:00",
      period: "PM",
      subject: "Object Oriented Programming",
      lecturer: "Mr. Tharindu Fernando",
      location: "Lab 02",
      type: "Lab",
    },
    {
      time: "03:00",
      period: "PM",
      subject: "Computer Networks",
      lecturer: "Mr. Dilan Perera",
      location: "Lecture Hall B",
      type: "Lecture",
    },
  ],

  Thursday: [
    {
      time: "09:00",
      period: "AM",
      subject: "Data Structures & Algorithms",
      lecturer: "Mr. Chamara Jayasinghe",
      location: "Lecture Hall A",
      type: "Lecture",
    },
    {
      time: "11:00",
      period: "AM",
      subject: "Operating Systems",
      lecturer: "Dr. Ruwan Silva",
      location: "Lab 01",
      type: "Tutorial",
    },
    {
      time: "02:00",
      period: "PM",
      subject: "Software Engineering",
      lecturer: "Dr. Kasun Perera",
      location: "Lecture Hall B",
      type: "Lecture",
    },
  ],

  Friday: [
    {
      time: "09:00",
      period: "AM",
      subject: "Object Oriented Programming",
      lecturer: "Mr. Tharindu Fernando",
      location: "Lecture Hall A",
      type: "Lecture",
    },
    {
      time: "11:00",
      period: "AM",
      subject: "Database Management Systems",
      lecturer: "Ms. Nadeesha Silva",
      location: "Lab 02",
      type: "Lab",
    },
  ],
};

export default function ScheduleScreen() {
  const params = useLocalSearchParams();

  const [selectedDay, setSelectedDay] = useState("Monday");

  const [schedule, setSchedule] =
    useState<Record<string, any[]>>(scheduleData);

  useFocusEffect(
    useCallback(() => {
      loadSchedule();

      if (
        typeof params.day === "string" &&
        days.some((day) => day.full === params.day)
      ) {
        setSelectedDay(params.day);
      }
    }, [params.day])
  );

  const classes = schedule[selectedDay] || [];


  const loadSchedule = async () => {
  try {
    console.log("SCHEDULE: Loading schedule...");

    const saved = await AsyncStorage.getItem(SCHEDULE_KEY);

    console.log("SCHEDULE: Storage:", saved);

    if (saved) {
      const parsed = JSON.parse(saved);

      console.log("SCHEDULE: Parsed schedule:", parsed);

      setSchedule(parsed);
    } else {
      console.log("SCHEDULE: No saved schedule");

      await AsyncStorage.setItem(
        SCHEDULE_KEY,
        JSON.stringify(scheduleData)
      );

      setSchedule(scheduleData);
    }
  } catch (error) {
    console.log("SCHEDULE LOAD ERROR:", error);
  }
};

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>Schedule</Text>

        <Text style={styles.subtitle}>
          Manage your weekly class timetable
        </Text>
        <TouchableOpacity
  style={styles.addClassButton}
  onPress={() => router.push("../add-class")}
  activeOpacity={0.8}
>
  <Ionicons
    name="add-circle-outline"
    size={20}
    color="#FFFFFF"
  />

  <Text style={styles.addClassButtonText}>
    Add Class
  </Text>
</TouchableOpacity>
        

        {/* Day Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dayList}
        >
          {days.map((day) => {
            const active = selectedDay === day.full;

            return (
              <TouchableOpacity
                key={day.full}
                activeOpacity={0.8}
                onPress={() => setSelectedDay(day.full)}
                style={[
                  styles.dayCard,
                  active && styles.activeDayCard,
                ]}
              >
                <Text
                  style={[
                    styles.dayShort,
                    active && styles.activeDayText,
                  ]}
                >
                  {day.short}
                </Text>

                <Text
                  style={[
                    styles.dayDate,
                    active && styles.activeDayText,
                  ]}
                >
                  {day.date}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Selected Day */}
        <View style={styles.dateHeader}>
          <View>
            <Text style={styles.selectedDay}>{selectedDay}</Text>
            <Text style={styles.classCount}>
              {classes.length} classes scheduled
            </Text>
          </View>

          <View style={styles.calendarIcon}>
            <Ionicons
              name="calendar-outline"
              size={22}
              color="#4F46E5"
            />
          </View>
        </View>

        {/* Classes */}
        <Text style={styles.sectionTitle}>Classes</Text>

        {classes.length > 0 ? (
          <View style={styles.scheduleList}>
            {classes.map((item, index) => (
              <TouchableOpacity
  key={`${item.subject}-${index}`}
  style={styles.classCard}
  activeOpacity={0.8}
  onPress={() =>
    router.push({
      pathname: "/class-details",
      params: {
        id: item.id,
        day: selectedDay,
      },
    })
  }
>
                <View style={styles.timeContainer}>
                  <Text style={styles.time}>{item.time}</Text>
                  <Text style={styles.period}>{item.period}</Text>
                </View>

                <View style={styles.line} />

                <View style={styles.classInfo}>
                  <Text style={styles.subject}>{item.subject}</Text>

                  <View style={styles.typeBadge}>
                    <Text style={styles.typeText}>{item.type}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Ionicons
                      name="person-outline"
                      size={14}
                      color="#64748B"
                    />
                    <Text style={styles.infoText}>
                      {item.lecturer}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Ionicons
                      name="location-outline"
                      size={14}
                      color="#64748B"
                    />
                    <Text style={styles.infoText}>
                      {item.location}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="calendar-clear-outline"
                size={30}
                color="#4F46E5"
              />
            </View>

            <Text style={styles.emptyTitle}>No classes today</Text>

            <Text style={styles.emptyText}>
              Enjoy your free time! There are no classes scheduled for this
              day.
            </Text>
          </View>
        )}

        {/* Weekly Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <Ionicons
              name="time-outline"
              size={24}
              color="#FFFFFF"
            />
          </View>

          <View style={styles.summaryInfo}>
            <Text style={styles.summaryTitle}>Weekly Schedule</Text>
            <Text style={styles.summaryText}>
              Stay organized and never miss a class.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
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
    paddingBottom: 110,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#111827",
  },

  subtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 6,
    marginBottom: 22,
  },

  dayList: {
    gap: 10,
    paddingBottom: 20,
  },

  dayCard: {
    width: 62,
    height: 72,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },

  activeDayCard: {
    backgroundColor: "#4F46E5",
    borderColor: "#4F46E5",
  },

  dayShort: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748B",
  },

  dayDate: {
    fontSize: 21,
    fontWeight: "800",
    color: "#111827",
    marginTop: 4,
  },

  activeDayText: {
    color: "#FFFFFF",
  },

  dateHeader: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 26,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  selectedDay: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },

  classCount: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 4,
  },

  calendarIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 14,
  },

  scheduleList: {
    gap: 14,
  },

  classCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  timeContainer: {
    width: 58,
    alignItems: "center",
  },

  time: {
    fontSize: 17,
    fontWeight: "800",
    color: "#4F46E5",
  },

  period: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },

  line: {
    width: 1,
    height: 95,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 15,
  },

  classInfo: {
    flex: 1,
  },

  subject: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },

  typeBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 7,
    marginBottom: 7,
  },

  typeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#4F46E5",
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  infoText: {
    fontSize: 12,
    color: "#64748B",
    marginLeft: 6,
    flex: 1,
  },

  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  emptyIcon: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },

  emptyText: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 19,
    marginTop: 7,
  },

  summaryCard: {
    backgroundColor: "#4F46E5",
    borderRadius: 18,
    padding: 18,
    marginTop: 28,
    flexDirection: "row",
    alignItems: "center",
  },

  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  summaryInfo: {
    flex: 1,
  },

  summaryTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  summaryText: {
    fontSize: 12,
    color: "#E0E7FF",
    marginTop: 4,
  },

  addClassButton: {
  height: 50,
  borderRadius: 14,
  backgroundColor: "#4F46E5",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  marginBottom: 20,
},

addClassButtonText: {
  color: "#FFFFFF",
  fontSize: 15,
  fontWeight: "800",
},
});
