import { Button } from "@/components/ui/button";
import { ClassAttributes, HTMLAttributes, useState } from "react";
import ReactMarkDown, { ExtraProps } from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { ClipboardIcon } from "@heroicons/react/16/solid";
import { Loader2 } from "lucide-react";

export function Message({
  role,
  content,
}: {
  role: "user" | "bot";
  content: string;
}) {
  if (role === "bot") {
    const Pre = ({
      children,
      ...props
    }: ClassAttributes<HTMLPreElement> &
      HTMLAttributes<HTMLPreElement> &
      ExtraProps) => {
      const [copied, setCopied] = useState(false);
      if (!children || typeof children !== "object") {
        return <code {...props}>{children}</code>;
      }
      const childType = "type" in children ? children.type : "";
      if (childType !== "code") {
        return <code {...props}>{children}</code>;
      }

      const childProps = "props" in children ? children.props : {};
      const { className, children: code } = childProps;
      const language = className?.replace("language-", "");

      const onCopy = () => {
        setCopied(true);
        navigator.clipboard.writeText(String(code));
        setTimeout(() => setCopied(false), 5000);
      };

      return (
        <div>
          <div className="flex rounded-t-md px-2 bg-gray-300 justify-between">
            <p>{language}</p>
            {copied ? (
              <p>コピー完了</p>
            ) : (
              <Button
                className="text-gray-500 !h-auto !w-auto"
                size="icon"
                onClick={onCopy}
              >
                <ClipboardIcon />
              </Button>
            )}
          </div>
          <SyntaxHighlighter
            language={language}
            customStyle={{
              borderBottomLeftRadius: "0.375rem",
              borderBottomRightRadius: "0.375rem",
            }}
          >
            {String(code).replace(/\n$/, "")}
          </SyntaxHighlighter>
        </div>
      );
    };
    return (
      <div className="self-start p-2 rounded-lg bg-gray-400 min-w-[30%] max-w-[60%]">
        <p>
          <strong>Bot</strong>
        </p>
        <div className="flex justify-center items-center">
          {content === "" ? (
            <Loader2 className="animate-spin" />
          ) : (
            <div className="overflow-x-auto w-full">
              <ReactMarkDown components={{ pre: Pre }}>{content}</ReactMarkDown>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="self-end p-2 rounded-lg bg-gray-400 min-w-[30%] max-w-[60%]">
      <p>
        <strong>You</strong>
      </p>
      <p>{content}</p>
    </div>
  );
}
