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

  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export async function updateUser(
  name: string,
  email: string
): Promise<boolean> {
  const user = await getUser();

  if (!user) {
    return false;
  }

  const updatedUser: User = {
    name: name.trim(),
    email: email.trim(),
    password: user.password,
  };

  await saveUser(updatedUser);

  return true;
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
}

export async function isLoggedIn(): Promise<boolean> {
  const session = await AsyncStorage.getItem(SESSION_KEY);

  return session === "true";
}