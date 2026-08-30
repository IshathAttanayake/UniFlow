import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_KEY = "@uniflow_user";
const SESSION_KEY = "@uniflow_session";

export type User = {
  name: string;
  email: string;
  password: string;
};

export async function saveUser(user: User) {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function getUser(): Promise<User | null> {
  const data = await AsyncStorage.getItem(USER_KEY);

  if (!data) {
    return null;
  }

  return JSON.parse(data);
}

export async function loginUser(
  email: string,
  password: string
): Promise<boolean> {
  const user = await getUser();

  if (!user) {
    return false;
  }

  if (
    user.email.toLowerCase() === email.toLowerCase() &&
    user.password === password
  ) {
    await AsyncStorage.setItem(SESSION_KEY, "true");
    return true;
  }

  return false;
}

export async function logoutUser() {
  await AsyncStorage.removeItem(SESSION_KEY);
  await AsyncStorage.removeItem(USER_KEY);
}

export async function isLoggedIn(): Promise<boolean> {
  const session = await AsyncStorage.getItem(SESSION_KEY);

  return session === "true";
}