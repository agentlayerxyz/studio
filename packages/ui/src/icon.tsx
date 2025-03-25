export function AgentLayer({
  className,
  variant = "default",
}: {
  className?: string;
  variant: "default" | "monochrome";
}) {
  const color = variant === "default" ? "#A3E635" : "currentColor";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        d="M13.8641 14.35L11.9733 11.156L10.0831 14.35H13.8641Z"
        fill={color}
      />
      <path
        d="M16.0016 14.3496H18.8607L11.9756 2.71875L10.5458 5.13339L16.0016 14.3496Z"
        fill={color}
      />
      <path
        d="M9.01511 16.1557L7.61737 18.5162H21.3281L19.9304 16.1557H9.01511Z"
        fill="currentColor"
      />
      <path
        d="M10.9053 9.34998L9.47792 6.93895L2.625 18.5156H5.47971L10.9053 9.34998Z"
        fill={color}
      />
    </svg>
  );
}

export function AgentStudio({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        d="M12.1418 2.20312L4.93416 14.6873H7.81311L12.1119 7.24165L18.5193 18.6563H21.3783L12.1418 2.20312Z"
        fill="#A3E635"
      />
      <path
        d="M12.0452 11.0981L10.5991 13.5914L12.0682 16.1753H4.0603L2.6217 18.6563H16.3423L12.0452 11.0981Z"
        fill="currentColor"
      />
    </svg>
  );
}
