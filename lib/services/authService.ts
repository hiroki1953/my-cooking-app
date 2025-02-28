import { findUserByEmailAndPassword } from "@/lib/repositories/userRepository";
import { getUserGroups } from "@/lib/repositories/groupRepository";

export async function loginUser(email: string, password: string) {
  const user = await findUserByEmailAndPassword(email, password);
  if (!user) {
    throw new Error("User not found");
  }

  const groups = await getUserGroups(user.id);
  return { user, groups };
}
