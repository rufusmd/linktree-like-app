import EmailForm from '../components/email.form';

export default function LinktreePage() {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Get Your Spreadsheet</h1>
        <EmailForm />
      </div>
    </div>
  );
}