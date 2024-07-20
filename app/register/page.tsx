"use client";
import { signIn } from "@/auth";
import Image from "next/image";
import Logo from "@/public/tt_logo.png";
import { userSchema } from "@/app/lib/zod";
import { CreateEventState, createUser } from "@/app/lib/actions";
import { redirect } from "next/navigation";
import { useState } from "react";
import { ZodError } from "zod";

async function handleRegister(
  state: CreateEventState,
  formData: FormData,
): Promise<CreateEventState> {
  const res: CreateEventState = {
    status: "",
    errors: [],
  };
  try {
    ("use server");
    const { email, name, password } = await userSchema.parseAsync({
      email: formData.get("email"),
      name: formData.get("name"),
      password: formData.get("password"),
    });

    await createUser(email, name, password);
    if (res.errors.length !== 0) {
    } else {
      res.status = "Success!";
      redirect("/login");
    }
  } catch (e) {
    if (e instanceof ZodError) {
      res.status = "There was an error while trying to create the account:";
      for (const err of e.errors) {
        res.errors.push(err.message);
      }
    } else if (e instanceof Error) {
      res.status = "There was an error while trying to create the account:";
      res.errors.push(e.message);
    }
  }

  return res;
}

export default function Page() {
  const [state, setState] = useState<CreateEventState>({
    status: "",
    errors: [],
  });

  const [waiting, setWaiting] = useState(false);

  const submit = async (input: FormData) => {
    setWaiting(true);
    const newState = await handleRegister(state, input);
    setState(newState);
    setWaiting(false);
  };

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
          <form className="space-y-6" action={submit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="name"
                  autoComplete="name"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex flex-col justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="block text-sm leading-6 text-gray-900">
                  Your password should have at least 8 characters.
                </div>
                <div className="text-sm">
                  {/* <a
                    href="#"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </a> */}
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-amber-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Register
              </button>

              <div className="font-semibold">
                {waiting ? "Creating account..." : state.status}
              </div>

              <div className="max-h-[12dvh] overflow-auto">
                <div className="overflow-hidden">
                  {state.errors.map((error, i) => (
                    <div key={i} hidden={waiting}>
                      {error}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
