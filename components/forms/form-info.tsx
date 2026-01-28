import {InfoIcon} from "lucide-react";
import React from "react";
import {cn} from "@/lib/utils";

interface FormInfoProps {
  className?: string;
  message?: string | React.ReactNode;
}

export const FormInfo = ({
  message,
  className
}: FormInfoProps) => {
  if (!message) return null;

  return (
    <div className={cn("bg-blue-50 p-3 rounded-md flex items-center gap-x-2 text-sm text-blue-600", className)}>
      <InfoIcon className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};












