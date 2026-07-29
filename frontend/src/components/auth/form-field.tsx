import Input from "@/components/ui/input";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
}

export default function FormField({ error, ...inputProps }: FormFieldProps) {
  return (
    <div>
      <Input {...inputProps} />
      {error && (
        <p className="text-status-rejected text-[11px] mt-1 font-medium">{error}</p>
      )}
    </div>
  );
}
