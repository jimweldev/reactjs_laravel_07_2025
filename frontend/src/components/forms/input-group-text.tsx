type InputGroupTextProps = {
  className?: string;
  children: React.ReactNode;
};

const InputGroupText = ({ className, children }: InputGroupTextProps) => {
  return (
    <span className={`bg-card text-card-foreground flex items-center border px-3 text-xs ${className}`}>
      {children}
    </span>
  );
};

export default InputGroupText;
