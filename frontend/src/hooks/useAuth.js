export default function useAuth() {
  const userId = localStorage.getItem("userId");
  return { loggedIn: !!userId, userId };
}
