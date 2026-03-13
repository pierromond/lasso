import { FC } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    img: [...(defaultSchema.attributes?.img || []), "style"],
    "*": [...(defaultSchema.attributes?.["*"] || []), "style", "className"],
  },
  tagNames: [...(defaultSchema.tagNames || []), "center"],
};

interface MarkdownProps {
  content: string;
}
export const Markdown: FC<MarkdownProps> = ({ content }) => {
  return (
    <ReactMarkdown
      className="markdown"
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema], rehypeSlug]}
    >
      {content}
    </ReactMarkdown>
  );
};
