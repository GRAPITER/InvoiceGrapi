"use client";
import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

export default function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus();
  return (
    <div>
      {pending ? (
        <Button type="submit" className="w-full">
          <Loader2 className="animate-spin size-4 mr-2" /> Submitting
        </Button>
      ) : (
        <Button type="submit" className="w-full">
          {text}
        </Button>
      )}
    </div>
  );
}
