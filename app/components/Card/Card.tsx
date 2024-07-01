import { ReactNode } from "react";

type CardProps = {
  title: string;
  children?: React.ReactNode;
};
export const Card = (props: CardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg ">
      <h5 className="mb-2 text-2xl font-medium tracking-tight text-teal  ">
        {props.title}
      </h5>
      <div className="font-roboto_flex">{props.children}</div>
    </div>
  );
};
