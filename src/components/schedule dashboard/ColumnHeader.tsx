interface ColumnHeaderProps {
  title: string;
}

const ColumnHeader = ({ title }: ColumnHeaderProps) => {
  return (
    <div className="col-span-1 border-r border-gray-800 py-3 text-center font-medium">
      {title}
    </div>
  );
};

export default ColumnHeader;
