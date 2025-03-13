import { findUserByEmailAndPassword } from "@/lib/repositories/userRepository";
import { getUserGroups } from "@/lib/repositories/groupRepository";
import { LoginResponse } from "@/types/auth";

export async function loginUser(
  email: string,
  password: string
): Promise<LoginResponse> {
  const data = await findUserByEmailAndPassword(email, password);
  const user = data.user;
  const access_token = data.session.access_token;

  if (!user) {
    throw new Error("User not found");
  }

  const groups = await getUserGroups(user.id);
  return { user, groups, access_token };
}
