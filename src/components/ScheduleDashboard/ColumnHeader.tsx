interface ColumnHeaderProps {
  title: string;
}

const ColumnHeader = ({ title }: ColumnHeaderProps) => {
  return (
    <div className="border-r border-gray-800 py-3 text-center font-medium">
      {title}
    </div>
  );
};

export default ColumnHeader;