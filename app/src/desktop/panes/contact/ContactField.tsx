import { Input } from '@/components/ui/input';
import { Label as FieldLabel } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Props {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  minLength?: number;
  rows?: number;
  autoComplete?: string;
  disabled?: boolean;
}

/** One labelled field. The textarea is the same component with `rows`. */
export function ContactField({
  id,
  label,
  value,
  onChange,
  type = 'text',
  minLength,
  rows,
  autoComplete,
  disabled,
}: Props) {
  const shared = {
    id,
    name: id,
    value,
    required: true,
    minLength,
    autoComplete,
    disabled,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(e.target.value),
  };

  return (
    <div className="space-y-2">
      <FieldLabel htmlFor={id} className="type-label text-muted-foreground">
        {label}
      </FieldLabel>
      {rows ? (
        <Textarea {...shared} rows={rows} className="resize-y bg-foreground/[0.03]" />
      ) : (
        <Input {...shared} type={type} className="bg-foreground/[0.03]" />
      )}
    </div>
  );
}
