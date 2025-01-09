import EmailForm from "./components/email.form";

export default function Page() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mt-8">Get Your Spreadsheet</h1>
      <EmailForm />
    </main>
  );
}
