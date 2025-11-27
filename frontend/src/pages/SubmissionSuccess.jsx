import Layout from "../components/Layout";

export default function SubmissionSuccess() {
  return (
    <Layout>
      <div className="text-center mt-20">
        <h1 className="text-4xl font-bold text-green-400">🎉 Submitted!</h1>
        <p className="text-gray-400 mt-4">Your response has been recorded in Airtable.</p>
      </div>
    </Layout>
  );
}
