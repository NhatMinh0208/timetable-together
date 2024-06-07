import { signIn } from "@/auth";
import Image from "next/image";
import Logo from "@/public/tt_logo.png";
import Form from "../components/form/form";

async function handleLogin(formData: FormData) {
  "use server";
  formData.append("redirectTo", "/timetable");
  await signIn("credentials", formData);
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
            Sign in to Timetable Together
          </h2>
        </div>

        <Form
          action={handleLogin}
          inputs={[
            { label: "Email address", type: "email" },
            {
              label: "Password",
              type: "password",
              autoComplete: "current-password",
            },
          ]}
          submit="Sign in"
        />
      </div>
    </>
  );
}
