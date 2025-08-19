import { Title, TitleProps } from "@mantine/core";

export const H1 = ({ children, ...props }: TitleProps) => {
  return (
    <Title
      style={{
        fontFamily: "LibrestileExtBold, Helvetica, Arial, sans-serif",
      }}
      {...props}
    >
      {children}
    </Title>
  );
};
