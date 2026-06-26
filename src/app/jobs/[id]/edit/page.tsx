"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { JobForm, type JobFormValues } from "@/components/JobForm";

export default function EditJobPage() {
  const { id } = useParams<{ id: string }>();
  const [initial, setInitial] = useState<Partial<JobFormValues>>();
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/jobs/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.job) setInitial(d.job);
        else setError("Position not found");
      })
      .catch(() => setError("Failed to load position"));
  }, [id]);

  if (error) return <p className="text-red-400">{error}</p>;
  if (!initial) return <p className="text-muted">Loading...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Edit position</h1>
      <JobForm initial={initial} jobId={id} submitLabel="Update position" />
    </div>
  );
}
