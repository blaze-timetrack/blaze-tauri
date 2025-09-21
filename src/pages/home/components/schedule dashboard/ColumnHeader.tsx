interface ColumnHeaderProps {
  title: string;
}

const ColumnHeader = ({ title }: ColumnHeaderProps) => {
  return (
    <div className="border-border col-span-1 border-r py-3 text-center font-medium">
      {title}
    </div>
  );
};

export default ColumnHeader;
