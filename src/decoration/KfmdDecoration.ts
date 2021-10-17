import * as vscode from "vscode";

const todoBackgroundColor = "#00bcd499";
const doneBackgroundColor = "#AD4045";
let todoArr: vscode.DecorationOptions[] = [];
let doneArr: vscode.DecorationOptions[] = [];

const createBasicKfmdLineDecoration = (backgroundColor: string) => {
  return vscode.window.createTextEditorDecorationType({
    isWholeLine: true,
    light: {
      backgroundColor,
    },
    dark: {
      backgroundColor,
    },
  });
};

const todoDecorationType = createBasicKfmdLineDecoration(todoBackgroundColor);

const doneDecorationType = createBasicKfmdLineDecoration(doneBackgroundColor);

// Deprecated
const bindDecoration = (
  range: vscode.Range,
  decorationType: vscode.TextEditorDecorationType
) => {
  let activeEditor = vscode.window.activeTextEditor;

  console.info(
    "KFDEBUG",
    "KFMD",
    "bindDecoration",
    range,
    decorationType,
    activeEditor
  );
  activeEditor?.setDecorations(decorationType, [
    {
      range,
      hoverMessage: "This is a message",
    },
  ]);
};
const bindTodoDecoration = (range: vscode.Range) => {
  //   bindDecoration(range, todoDecorationType);
  todoArr.push({
    range,
  });
};
const bindDoneDecoration = (range: vscode.Range) => {
  //   bindDecoration(range, doneDecorationType);
  doneArr.push({
    range,
  });
};

let activeEditor = vscode.window.activeTextEditor;
const updateDecorations = () => {
  activeEditor?.setDecorations(todoDecorationType, todoArr);
  activeEditor?.setDecorations(doneDecorationType, doneArr);
  todoArr = [];
  doneArr = [];
};

let timeout: NodeJS.Timer | undefined = undefined;
const triggerUpdateDecorations = () => {
  if (timeout) {
    clearTimeout(timeout);
    timeout = undefined;
  }
  timeout = setTimeout(updateDecorations, 500);
};

const initDecoration = (context: vscode.ExtensionContext) => {
  vscode.window.onDidChangeActiveTextEditor(
    (editor) => {
      activeEditor = editor;
      if (editor) {
        triggerUpdateDecorations();
      }
    },
    null,
    context.subscriptions
  );

  vscode.workspace.onDidChangeTextDocument(
    (event) => {
      if (activeEditor && event.document === activeEditor.document) {
        triggerUpdateDecorations();
      }
    },
    null,
    context.subscriptions
  );

  if (activeEditor) {
    triggerUpdateDecorations();
  }
};

export {
  bindTodoDecoration,
  bindDoneDecoration,
  updateDecorations,
  initDecoration,
};
