import * as vscode from "vscode";

let todoBackgroundColor = "#00bcd499";
let doneBackgroundColor = "#AD4045";
let todoArr: vscode.DecorationOptions[] = [];
let doneArr: vscode.DecorationOptions[] = [];

const createBasicKfmdLineDecoration = (backgroundColor: string) => {
  return vscode.window.createTextEditorDecorationType({
    isWholeLine: true,
    rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
    light: {
      backgroundColor,
    },
    dark: {
      backgroundColor,
    },
  });
};

let todoDecorationType = createBasicKfmdLineDecoration(todoBackgroundColor);

let doneDecorationType = createBasicKfmdLineDecoration(doneBackgroundColor);

let lastDocument: vscode.TextDocument | undefined = undefined;

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
  if (activeEditor?.document != lastDocument) {
    todoArr = []
  }

  todoArr.push({
    range,
  });
  lastDocument = activeEditor?.document
};
const bindDoneDecoration = (range: vscode.Range) => {
  //   bindDecoration(range, doneDecorationType);
  if (activeEditor?.document != lastDocument) {
    doneArr = []
  }

  doneArr.push({
    range,
  });

  lastDocument = activeEditor?.document
};

let activeEditor = vscode.window.activeTextEditor;
const updateDecorations = () => {
  const startTime = new Date().getTime()
  todoBackgroundColor = vscode.workspace.getConfiguration("kfmd").get("todoBackgroundColor", todoBackgroundColor)
  doneBackgroundColor = vscode.workspace.getConfiguration("kfmd").get("doneBackgroundColor", doneBackgroundColor)

  todoDecorationType = createBasicKfmdLineDecoration(todoBackgroundColor)
  doneDecorationType = createBasicKfmdLineDecoration(doneBackgroundColor)


  activeEditor?.setDecorations(vscode.window.createTextEditorDecorationType({}), [
    {
      range: new vscode.Range(new vscode.Position(0, 0), new vscode.Position(activeEditor.document.lineCount, 0)
      )
    }
  ])
  activeEditor?.setDecorations(todoDecorationType, todoArr);
  activeEditor?.setDecorations(doneDecorationType, doneArr);
  console.info(`KfmdDecoration todoDecorationType ${JSON.stringify(todoArr.map((r: vscode.DecorationOptions) => r.range.start.line + 1))}`)
  todoArr = [];
  doneArr = [];

  const endTime = new Date().getTime()
  console.info(`KfmdDecoration update coast ${endTime - startTime}ms`)
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
