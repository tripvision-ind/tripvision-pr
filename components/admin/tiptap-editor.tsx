"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link2,
  ImageIcon,
  Heading1,
  Heading2,
  Heading3,
  Code,
  Code2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator as UISeparator } from "@/components/ui/separator";

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

export function TiptapEditor({
  content,
  onChange,
  placeholder = "Start writing...",
  className,
}: TiptapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {},
        orderedList: {},
        listItem: {},
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Underline,
      Strike,
      Subscript,
      Superscript,
      Highlight.configure({
        HTMLAttributes: {
          class: "bg-yellow-200 px-1 rounded",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content,
    editable: true,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none min-h-[300px] p-4",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, {
        parseOptions: {
          preserveWhitespace: true,
        },
      });
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className={cn("border rounded-lg overflow-hidden", className)}>
      {/* Toolbar */}
      <div className="border-b bg-muted/50 p-3 flex flex-wrap gap-1">
        {/* Text Formatting */}
        <div className="flex gap-1">
          <Button
            type="button"
            variant={editor.isActive("bold") ? "secondary" : "ghost"}
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Bold"
          >
            <Bold className="size-4" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive("italic") ? "secondary" : "ghost"}
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Italic"
          >
            <Italic className="size-4" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive("underline") ? "secondary" : "ghost"}
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            title="Underline"
          >
            <UnderlineIcon className="size-4" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive("strike") ? "secondary" : "ghost"}
            size="sm"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            title="Strikethrough"
          >
            <Strikethrough className="size-4" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive("highlight") ? "secondary" : "ghost"}
            size="sm"
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            title="Highlight"
          >
            <Highlighter className="size-4" />
          </Button>
        </div>

        <UISeparator orientation="vertical" className="h-8" />

        {/* Headings */}
        <div className="flex gap-1">
          <Button
            type="button"
            variant={
              editor.isActive("heading", { level: 1 }) ? "secondary" : "ghost"
            }
            size="sm"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            title="Heading 1"
          >
            <Heading1 className="size-4" />
          </Button>
          <Button
            type="button"
            variant={
              editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"
            }
            size="sm"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            title="Heading 2"
          >
            <Heading2 className="size-4" />
          </Button>
          <Button
            type="button"
            variant={
              editor.isActive("heading", { level: 3 }) ? "secondary" : "ghost"
            }
            size="sm"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            title="Heading 3"
          >
            <Heading3 className="size-4" />
          </Button>
        </div>

        <UISeparator orientation="vertical" className="h-8" />

        {/* Lists and Quotes */}
        <div className="flex gap-1">
          <Button
            type="button"
            variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
            size="sm"
            onClick={() => {
              editor.chain().focus().toggleBulletList().run();
            }}
            title="Bullet List"
            disabled={!editor.can().toggleBulletList()}
          >
            <List className="size-4" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
            size="sm"
            onClick={() => {
              editor.chain().focus().toggleOrderedList().run();
            }}
            title="Numbered List"
            disabled={!editor.can().toggleOrderedList()}
          >
            <ListOrdered className="size-4" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive("blockquote") ? "secondary" : "ghost"}
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            title="Quote"
          >
            <Quote className="size-4" />
          </Button>
        </div>

        <UISeparator orientation="vertical" className="h-8" />

        {/* Alignment */}
        <div className="flex gap-1">
          <Button
            type="button"
            variant={
              editor.isActive({ textAlign: "left" }) ? "secondary" : "ghost"
            }
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            title="Align Left"
          >
            <AlignLeft className="size-4" />
          </Button>
          <Button
            type="button"
            variant={
              editor.isActive({ textAlign: "center" }) ? "secondary" : "ghost"
            }
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            title="Align Center"
          >
            <AlignCenter className="size-4" />
          </Button>
          <Button
            type="button"
            variant={
              editor.isActive({ textAlign: "right" }) ? "secondary" : "ghost"
            }
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            title="Align Right"
          >
            <AlignRight className="size-4" />
          </Button>
          <Button
            type="button"
            variant={
              editor.isActive({ textAlign: "justify" }) ? "secondary" : "ghost"
            }
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            title="Justify"
          >
            <AlignJustify className="size-4" />
          </Button>
        </div>

        <UISeparator orientation="vertical" className="h-8" />

        {/* Code and Special */}
        <div className="flex gap-1">
          <Button
            type="button"
            variant={editor.isActive("code") ? "secondary" : "ghost"}
            size="sm"
            onClick={() => editor.chain().focus().toggleCode().run()}
            title="Inline Code"
          >
            <Code className="size-4" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive("codeBlock") ? "secondary" : "ghost"}
            size="sm"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            title="Code Block"
          >
            <Code2 className="size-4" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive("subscript") ? "secondary" : "ghost"}
            size="sm"
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            title="Subscript"
          >
            <SubscriptIcon className="size-4" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive("superscript") ? "secondary" : "ghost"}
            size="sm"
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            title="Superscript"
          >
            <SuperscriptIcon className="size-4" />
          </Button>
        </div>

        <UISeparator orientation="vertical" className="h-8" />

        {/* Media and Links */}
        <div className="flex gap-1">
          <Button
            type="button"
            variant={editor.isActive("link") ? "secondary" : "ghost"}
            size="sm"
            onClick={addLink}
            title="Add Link"
          >
            <Link2 className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addImage}
            title="Add Image"
          >
            <ImageIcon className="size-4" />
          </Button>
        </div>

        <UISeparator orientation="vertical" className="h-8" />

        {/* Undo/Redo */}
        <div className="flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo"
          >
            <Undo className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo"
          >
            <Redo className="size-4" />
          </Button>
        </div>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}
