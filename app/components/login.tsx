import { signIn } from "@/auth";

export function Login() {
  return (
    <form
      action={async (formData) => {
        "use server";
        await signIn("credentials", formData);
      }}
    >
      <div>
        <label>
          Email:
          <input name="email" type="email" />
        </label>
      </div>
      <div>
        <label>
          Password:
          <input name="password" type="password" />
        </label>
      </div>
      <button>Log in</button>
    </form>
  );
}
