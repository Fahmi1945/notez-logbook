"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ReviewStatus } from "@/lib/api/mentor-review";
import { useUIStore } from "@/store/ui-store";
import { CheckCircle, XCircle } from "@phosphor-icons/react";
import { MESSAGES } from "@/config/messages";

interface ReviewFormProps {
  submitReview: (status: ReviewStatus, comment?: string) => Promise<unknown>;
  isProcessing: boolean;
  onSuccess?: () => void;
}

export function ReviewForm({ submitReview, isProcessing, onSuccess }: ReviewFormProps) {
  const [note, setNote] = useState("");
  const { showToast } = useUIStore();

  const handleSubmit = async (action: "approved" | "rejected") => {
    if (action === "rejected" && !note.trim()) {
      showToast(MESSAGES.REVIEW.NOTE_REQUIRED_ON_REJECT, "error");
      return;
    }

    try {
      await submitReview(action, note);
      if (onSuccess) onSuccess();
    } catch (error) {
      // Error sudah di-handle oleh useReviewDetail, tapi kita tangkap agar tidak bubar
      console.error(error);
    }
  };

  return (
    <div className="space-y-5">
      <Textarea
        label="Catatan Review (Opsional jika Setuju, Wajib jika Tolak)"
        placeholder="Berikan masukan, pujian, atau alasan penolakan di sini..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={4}
        disabled={isProcessing}
      />
      
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button 
          variant="danger" 
          className="flex-1 order-2 sm:order-1"
          onClick={() => handleSubmit("rejected")}
          disabled={isProcessing}
          isLoading={isProcessing}
        >
          <XCircle size={18} weight="bold" className="mr-2" />
          Tolak
        </Button>
        <Button 
          variant="success" 
          className="flex-[2] order-1 sm:order-2"
          onClick={() => handleSubmit("approved")}
          disabled={isProcessing}
          isLoading={isProcessing}
        >
          <CheckCircle size={18} weight="bold" className="mr-2" />
          Setujui Logbook
        </Button>
      </div>
    </div>
  );
}
