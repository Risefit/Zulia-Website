"use client";
import { useSearchParams } from "next/navigation";
import { Form } from "@/components/Form";

const topics: Record<string, string> = {
  lodges: "Lodge or camp operation",
  hunting: "Hunting outfitting",
  adventure: "Adventure tourism",
  funds: "Conservation funding",
  ranching: "Wildlife and livestock",
  research: "Research, film or aviation",
  press: "Press",
  other: "Something else",
};

export function ContactForm() {
  const sp = useSearchParams();
  const topic = sp.get("topic") ?? "";
  return (
    <Form
      subject="Zulia Conservancy — enquiry"
      submitLabel="Send"
      fields={[
        { name: "name", label: "Your name", required: true },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "organisation", label: "Organisation" },
        { name: "topic", label: "What is this about", type: "select", options: Object.values(topics), defaultValue: topics[topic] ?? "" },
        { name: "message", label: "Your message", type: "textarea", required: true },
      ]}
    />
  );
}
