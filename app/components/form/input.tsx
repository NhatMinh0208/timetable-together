export default function Input({
  label,
  type,
  autoComplete,
}: {
  label: string;
  type: string;
  autoComplete: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label
          htmlFor={type}
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          {label}
        </label>
        <div className="text-sm"></div>
      </div>
      <div className="mt-2">
        <input
          id={type}
          name={type}
          type={type}
          autoComplete={autoComplete}
          required
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>
    </div>
  );
}
