import bcrypt from "bcryptjs"

import { db } from "./db.server"

type LoginForm = {
  password: string;
  username: string;
}

export async function login({ username, password }: LoginForm) {
  const user = await db.user.findUnique({ where: { username } })
  if (!user) {
    return null;
  }

  const isCorrectPasword = await bcrypt.compare(password, user.passwordHash);
  if (!isCorrectPasword) {
    return null;
  }
  return { id: user.id, username }
}
