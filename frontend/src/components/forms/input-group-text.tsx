type InputGroupTextProps = {
  children: React.ReactNode;
};

const InputGroupText = ({ children }: InputGroupTextProps) => {
  return (
    <span className="bg-card text-card-foreground flex items-center border px-3 text-xs">
      {children}
    </span>
  );
};

export default InputGroupText;
