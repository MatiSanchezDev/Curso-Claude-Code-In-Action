import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationBadge, getFriendlyMessage, ToolInvocation } from "../ToolInvocationBadge";

afterEach(() => {
  cleanup();
});

test("muestra mensaje amigable para comando create", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "1",
    toolName: "str_replace_editor",
    state: "result",
    args: { command: "create", path: "/App.jsx" },
    result: "Success",
  };

  render(<ToolInvocationBadge toolInvocation={toolInvocation} />);
  expect(screen.getByText("Creando archivo: App.jsx")).toBeDefined();
});

test("muestra mensaje amigable para comando str_replace", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "2",
    toolName: "str_replace_editor",
    state: "result",
    args: { command: "str_replace", path: "/components/Button.tsx" },
    result: "Success",
  };

  render(<ToolInvocationBadge toolInvocation={toolInvocation} />);
  expect(screen.getByText("Editando archivo: Button.tsx")).toBeDefined();
});

test("muestra mensaje amigable para comando view", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "3",
    toolName: "str_replace_editor",
    state: "pending",
    args: { command: "view", path: "/App.jsx" },
  };

  render(<ToolInvocationBadge toolInvocation={toolInvocation} />);
  expect(screen.getByText("Leyendo archivo: App.jsx")).toBeDefined();
});

test("muestra mensaje amigable para comando insert", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "4",
    toolName: "str_replace_editor",
    state: "result",
    args: { command: "insert", path: "/utils/helpers.js", insert_line: 10 },
    result: "Success",
  };

  render(<ToolInvocationBadge toolInvocation={toolInvocation} />);
  expect(screen.getByText("Insertando en: helpers.js")).toBeDefined();
});

test("muestra mensaje amigable para comando undo_edit", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "5",
    toolName: "str_replace_editor",
    state: "result",
    args: { command: "undo_edit", path: "/App.jsx" },
    result: "Error",
  };

  render(<ToolInvocationBadge toolInvocation={toolInvocation} />);
  expect(screen.getByText("Deshaciendo cambios en: App.jsx")).toBeDefined();
});

test("muestra mensaje amigable para comando rename", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "6",
    toolName: "file_manager",
    state: "result",
    args: {
      command: "rename",
      path: "/old-file.js",
      new_path: "/new-file.js",
    },
    result: { success: true },
  };

  render(<ToolInvocationBadge toolInvocation={toolInvocation} />);
  expect(screen.getByText("Renombrando: old-file.js → new-file.js")).toBeDefined();
});

test("muestra mensaje amigable para comando delete", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "7",
    toolName: "file_manager",
    state: "result",
    args: { command: "delete", path: "/temp/unused.js" },
    result: { success: true },
  };

  render(<ToolInvocationBadge toolInvocation={toolInvocation} />);
  expect(screen.getByText("Eliminando: unused.js")).toBeDefined();
});

test("muestra punto verde cuando el estado es result con resultado", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "8",
    toolName: "str_replace_editor",
    state: "result",
    args: { command: "create", path: "/App.jsx" },
    result: "Success",
  };

  const { container } = render(<ToolInvocationBadge toolInvocation={toolInvocation} />);
  const greenDot = container.querySelector(".bg-emerald-500");
  expect(greenDot).toBeDefined();
});

test("muestra spinner cuando el estado es pending", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "9",
    toolName: "str_replace_editor",
    state: "pending",
    args: { command: "create", path: "/App.jsx" },
  };

  const { container } = render(<ToolInvocationBadge toolInvocation={toolInvocation} />);
  const spinner = container.querySelector(".animate-spin");
  expect(spinner).toBeDefined();
});

test("muestra spinner cuando el estado es result pero sin resultado", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "10",
    toolName: "str_replace_editor",
    state: "result",
    args: { command: "view", path: "/App.jsx" },
  };

  const { container } = render(<ToolInvocationBadge toolInvocation={toolInvocation} />);
  const spinner = container.querySelector(".animate-spin");
  expect(spinner).toBeDefined();
});

test("fallback a toolName para herramientas desconocidas", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "11",
    toolName: "unknown_tool",
    state: "result",
    args: { command: "test", path: "/file.txt" },
    result: "Success",
  };

  render(<ToolInvocationBadge toolInvocation={toolInvocation} />);
  expect(screen.getByText("unknown_tool")).toBeDefined();
});

test("extrae correctamente el nombre del archivo de rutas anidadas", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "12",
    toolName: "str_replace_editor",
    state: "result",
    args: {
      command: "create",
      path: "/components/ui/buttons/PrimaryButton.tsx",
    },
    result: "Success",
  };

  render(<ToolInvocationBadge toolInvocation={toolInvocation} />);
  expect(screen.getByText("Creando archivo: PrimaryButton.tsx")).toBeDefined();
});

test("getFriendlyMessage funciona correctamente de forma aislada", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "13",
    toolName: "str_replace_editor",
    state: "result",
    args: { command: "create", path: "/Test.jsx" },
    result: "Success",
  };

  expect(getFriendlyMessage(toolInvocation)).toBe("Creando archivo: Test.jsx");
});
