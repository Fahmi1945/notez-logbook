"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { FileText, ArrowSquareOut, WarningCircle } from "@phosphor-icons/react";

interface PdfViewerProps {
  url: string;
  title: string;
}

export function PdfViewer({ url, title }: PdfViewerProps) {
  const [error, setError] = useState(false);

  return (
    <Card className="flex flex-col h-full bg-brand-white-bg">
      <CardHeader className="flex flex-row items-center justify-between px-4 py-3 bg-brand-white">
        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <FileText size={20} weight="fill" className="text-brand-primary" />
          <span className="truncate max-w-[200px] sm:max-w-xs">{title}</span>
        </h4>
        <Button variant="outline" size="sm" onClick={() => window.open(url, "_blank")} className="text-xs h-8">
          Buka di Tab Baru
          <ArrowSquareOut size={16} weight="bold" className="ml-2" />
        </Button>
      </CardHeader>
      
      <CardContent className="flex-1 w-full h-[600px] relative p-0 border-t border-gray-100">
        {!error ? (
          <iframe 
            src={`${url}#toolbar=0`} 
            className="w-full h-full"
            title={title}
            onError={() => setError(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 bg-brand-white-bg p-6 text-center">
            <WarningCircle size={48} weight="light" className="mb-4 text-gray-300" />
            <p className="font-medium text-gray-700">Gagal memuat pratinjau dokumen.</p>
            <p className="text-sm text-gray-400 mt-1 mb-4 max-w-sm">Browser Anda mungkin tidak mendukung pratinjau PDF langsung di dalam halaman.</p>
            <Button variant="primary" onClick={() => window.open(url, "_blank")}>
              Unduh atau Buka Langsung
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
