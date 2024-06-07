import Input from "./input";

export default function Form({
  action,
  submit,
  inputs,
}: {
  action: (formdata: FormData) => Promise<void>;
  submit: string;
  inputs: { label: string; type: string; autoComplete?: string }[];
}) {
  return (
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form className="space-y-6" action={action}>
        {inputs.map(({ label, type, autoComplete }) => (
          <Input
            key={type}
            label={label}
            type={type}
            autoComplete={autoComplete ? autoComplete : type}
          />
        ))}

        <div>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-amber-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {submit}
          </button>
        </div>
      </form>
    </div>
  );
}
