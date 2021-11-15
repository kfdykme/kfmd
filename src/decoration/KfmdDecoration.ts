import * as vscode from "vscode";

let todoBackgroundColor = "#333";
let doneBackgroundColor = "";
let todoArr: vscode.DecorationOptions[] = [];
let doneArr: vscode.DecorationOptions[] = [];

let mContext: vscode.ExtensionContext | null = null;
let doneGutterIconPath: string = ''
let todoGutterIconPath: string = ''
const createBasicKfmdLineDecoration = (backgroundColor: string, gutterIconPath: string = '') => {
  console.info(`createBasicKfmdLineDecoration gutterIconPath ${gutterIconPath}`);

  if (!vscode.workspace.getConfiguration("kfmd").get("decoration.showIcon", false)) {
    gutterIconPath = ''
  }

  return vscode.window.createTextEditorDecorationType({
    isWholeLine: vscode.workspace
      .getConfiguration("kfmd")
      .get("isWholeLine", true),
    rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
    light: {
      backgroundColor,
    },
    dark: {
      backgroundColor,
      borderColor: backgroundColor,
      gutterIconPath: gutterIconPath,
    },
  });
};

let todoDecorationType = createBasicKfmdLineDecoration(todoBackgroundColor, 'C:\\Users\\kfmechen\\Desktop\\wor\\kfmd\\res\\todolist_done.svg');

let doneDecorationType = createBasicKfmdLineDecoration(doneBackgroundColor, 'C:\\Users\\kfmechen\\Desktop\\wor\\kfmd\\res\\todolist_done.svg');

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
  if (activeEditor?.document != lastDocument && lastDocument !== undefined) {
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
  todoBackgroundColor = vscode.workspace.getConfiguration("kfmd").get("todoBackgroundColor")!!
  doneBackgroundColor = vscode.workspace.getConfiguration("kfmd").get("doneBackgroundColor")!!

  todoDecorationType = createBasicKfmdLineDecoration(todoBackgroundColor, todoGutterIconPath)
  doneDecorationType = createBasicKfmdLineDecoration(doneBackgroundColor, doneGutterIconPath)

  activeEditor?.setDecorations(vscode.window.createTextEditorDecorationType({
    dark: {
      gutterIconPath: ''
    }
  }), [
    {
      range: new vscode.Range(new vscode.Position(0, 0), new vscode.Position(activeEditor.document.lineCount, 0)
      )
    }
  ])

  const current =
    vscode.workspace
      .getConfiguration("kfmd")
      .get("enableShowBackgroundColor", true);

  console.info(`KfmdDecoration todoDecorationType ${JSON.stringify(todoArr.map((r: vscode.DecorationOptions) => r.range.start.line + 1))}`)
  if (current) {
    activeEditor?.setDecorations(todoDecorationType, todoArr);
    activeEditor?.setDecorations(doneDecorationType, doneArr);
    todoArr = [];
    doneArr = [];

    const endTime = new Date().getTime()
    console.info(`KfmdDecoration update coast ${endTime - startTime}ms`)
  } else {

    console.info(`KfmdDecoration disenable`)
  }

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
  mContext = context;
  doneGutterIconPath = mContext?.asAbsolutePath('res/todolist_done.svg')
  todoGutterIconPath = mContext?.asAbsolutePath('res/todolist_todo.svg')
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
  triggerUpdateDecorations,
  initDecoration,
};
