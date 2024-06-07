import { signIn } from "@/auth";
import Image from "next/image";
import Logo from "@/public/tt_logo.png";
import { userSchema } from "@/app/lib/zod";
import { createUser } from "@/app/lib/actions";
import { redirect } from "next/navigation";
import Input from "../components/form/input";

async function handleRegister(formData: FormData) {
  "use server";
  const { email, name, password } = await userSchema.parseAsync({
    email: formData.get("email"),
    name: formData.get("name"),
    password: formData.get("password"),
  });
  await createUser(email, name, password);
  redirect("/login");
}

export default function Page() {
  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-white">
        <body class="h-full">
        ```
      */}
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image
            className="mx-auto h-30 w-auto"
            src={Logo}
            alt="Logo of Timetable Together"
            width={100}
            height={100}
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Create a new account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action={handleRegister}>
            <Input label="Name" type="name" />

            <Input label="Email address" type="email" />

            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
            />

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-amber-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
