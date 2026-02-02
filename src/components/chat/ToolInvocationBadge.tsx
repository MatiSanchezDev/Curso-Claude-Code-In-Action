"use client";

import { Loader2 } from "lucide-react";

type StrReplaceCommand = "view" | "create" | "str_replace" | "insert" | "undo_edit";
type FileManagerCommand = "rename" | "delete";

interface StrReplaceArgs {
  command: StrReplaceCommand;
  path: string;
  file_text?: string;
  insert_line?: number;
  new_str?: string;
  old_str?: string;
  view_range?: number[];
}

interface FileManagerArgs {
  command: FileManagerCommand;
  path: string;
  new_path?: string;
}

export interface ToolInvocation {
  toolCallId: string;
  toolName: string;
  state: string;
  args: StrReplaceArgs | FileManagerArgs | Record<string, unknown>;
  result?: unknown;
}

interface ToolInvocationBadgeProps {
  toolInvocation: ToolInvocation;
}

function getFileName(path: string): string {
  return path.split("/").pop() || path;
}

export function getFriendlyMessage(toolInvocation: ToolInvocation): string {
  const { toolName, args } = toolInvocation;
  const path = (args as { path?: string }).path || "";
  const fileName = getFileName(path);

  if (toolName === "str_replace_editor") {
    const strArgs = args as StrReplaceArgs;
    switch (strArgs.command) {
      case "create":
        return `Creando archivo: ${fileName}`;
      case "str_replace":
        return `Editando archivo: ${fileName}`;
      case "view":
        return `Leyendo archivo: ${fileName}`;
      case "insert":
        return `Insertando en: ${fileName}`;
      case "undo_edit":
        return `Deshaciendo cambios en: ${fileName}`;
      default:
        return `Operación en: ${fileName}`;
    }
  }

  if (toolName === "file_manager") {
    const fmArgs = args as FileManagerArgs;
    switch (fmArgs.command) {
      case "rename":
        const newFileName = fmArgs.new_path ? getFileName(fmArgs.new_path) : "";
        return `Renombrando: ${fileName} → ${newFileName}`;
      case "delete":
        return `Eliminando: ${fileName}`;
      default:
        return `Gestionando archivo: ${fileName}`;
    }
  }

  return toolName;
}

export function ToolInvocationBadge({ toolInvocation }: ToolInvocationBadgeProps) {
  const isCompleted = toolInvocation.state === "result" && toolInvocation.result !== undefined;
  const message = getFriendlyMessage(toolInvocation);

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {isCompleted ? (
        <>
          <div className="w-2 h-2 rounded-full bg-emerald-500" aria-label="Completado"></div>
          <span className="text-neutral-700">{message}</span>
        </>
      ) : (
        <>
          <Loader2 className="w-3 h-3 animate-spin text-blue-600" aria-label="En progreso" />
          <span className="text-neutral-700">{message}</span>
        </>
      )}
    </div>
  );
}
