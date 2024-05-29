import * as bcrypt from "bcryptjs";
const saltRounds = 10;

export async function saltAndHashPassword(password: string) {
  return await bcrypt.hash(password, saltRounds);
}

export async function passwordMatch(password: string, pwHash: string) {
  return await bcrypt.compare(password, pwHash);
}
