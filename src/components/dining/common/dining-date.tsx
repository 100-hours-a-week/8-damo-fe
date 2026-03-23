interface DiningDateProps {
  date: string;
}

export function DiningDate({ date }: DiningDateProps) {
  return <span>{date}</span>;
}
