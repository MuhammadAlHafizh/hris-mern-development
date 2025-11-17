import React, { ReactNode } from 'react';

interface TableProps {
  children: ReactNode;
  className?: string;
}

interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

interface TableBodyProps {
  children: ReactNode;
  className?: string;
}

interface TableRowProps {
  children: ReactNode;
  className?: string;
}

interface TableCellProps {
  children: ReactNode;
  className?: string;
  title?: string; // Untuk responsive, sebagai fallback
}

interface TableHeadCellProps {
  children: ReactNode;
  className?: string;
}

export const Table: React.FC<TableProps> = ({ children, className = '' }) => {
  return (
    <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 rounded-lg">
      <div className="inline-block min-w-full align-middle">
        <table className={`min-w-full divide-y divide-gray-200 ${className}`}>
          {children}
        </table>
      </div>
    </div>
  );
};

export const TableHeader: React.FC<TableHeaderProps> = ({ children, className = '' }) => {
  return (
    <thead className={`bg-gray-50 ${className}`}>
      {children}
    </thead>
  );
};

export const TableBody: React.FC<TableBodyProps> = ({ children, className = '' }) => {
  return (
    <tbody className={`bg-white divide-y divide-gray-200 ${className}`}>
      {children}
    </tbody>
  );
};

export const TableRow: React.FC<TableRowProps> = ({ children, className = '' }) => {
  return (
    <tr className={`hover:bg-gray-50 transition-colors duration-150 ${className}`}>
      {children}
    </tr>
  );
};

export const TableCell: React.FC<TableCellProps> = ({ children, className = '', title }) => {
  return (
    <td
      className={`px-4 py-3 text-sm text-gray-900 whitespace-nowrap ${className}`}
      title={title}
    >
      {children}
    </td>
  );
};

export const TableHeadCell: React.FC<TableHeadCellProps> = ({ children, className = '' }) => {
  return (
    <th className={`px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider bg-gray-50 ${className}`}>
      {children}
    </th>
  );
};

export const ResponsiveTable: React.FC<TableProps> = ({ children, className = '' }) => {
  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
      <div className="overflow-x-auto">
        <table className={`min-w-full divide-y divide-gray-200 ${className}`}>
          {children}
        </table>
      </div>
    </div>
  );
};
