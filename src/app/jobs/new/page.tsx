import { JobForm } from "@/components/JobForm";

export default function NewJobPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">New career position</h1>
      <p className="text-muted mb-8">Publishes to the careers page when marked as open.</p>
      <JobForm submitLabel="Create position" />
    </div>
  );
}
