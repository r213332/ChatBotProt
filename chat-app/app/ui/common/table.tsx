import {
  Table as NativeTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReactNode } from "react";

type TableData = {
  [key: string]: string | ReactNode;
};

export function Table<T extends TableData>({
  columns,
  data,
  className,
}: {
  columns: { key: keyof T; label: string; className?: string }[];
  data: T[];
  className?: string;
}) {
  return (
    <NativeTable tableStyle={className}>
      <TableHeader>
        <TableRow>
          {columns.map((column, index) => (
            <TableHead key={index}>{column.label}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, index) => (
          <TableRow key={index}>
            {columns.map((column, index) => (
              <TableCell key={index} className={column.className}>
                {row[column.key]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </NativeTable>
  );
}
