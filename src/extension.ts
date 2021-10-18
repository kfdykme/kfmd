// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { KfmdCodelensProvider } from "./codelens/KfmdCodelensProvider";
import { initDecoration, triggerUpdateDecorations } from "./decoration/KfmdDecoration";

const viewType = "kfmd";

// const createPanel = () => {
//   const column = vscode.window.activeTextEditor
//     ? vscode.window.activeTextEditor.viewColumn
//     : undefined;

//   const panel = vscode.window.createWebviewPanel(
//     viewType,
//     "kfmd",
//     column || vscode.ViewColumn.One
//   );

//   panel.webview.options = {
//     enableScripts: true,
//   };
//   panel.webview.html = getWebviewContent();
// };

const bindCommand = (
  context: vscode.ExtensionContext,
  name: string,
  f: any
) => {
  console.info("kfmd bindCommand", name);
  let disposable = vscode.commands.registerCommand(name, f);

  context.subscriptions.push(disposable);
};

// const getWebviewContent = () => {
//   return `<!DOCTYPE html>
// 	<html lang="en">
// 	  <head>
// 		<meta charset="UTF-8" /> 
// 		<title>Kfmd Webview: </title>
// 	  </head>
// 	  <body >
// 		<!-- <webview id="foo" src="http://blog.kfdykme.life" style="display:inline-flex; width:640px; height:480px"></webview> -->
// 		<input type="text" id="url" />
// 		<input type="button" value="enter" id="btnUrl" />
// 		<iframe sandbox="allow-same-origin allow-scripts allow-popups allow-forms" src="http://blog.kfdykme.life" width="100%" id="webview" height="960px"> </iframe>
// 		<script>
// 		  const btn = document.getElementById("btnUrl");
// 		  const inputUrl = document.getElementById("url");
// 		  const webview = document.getElementById("webview");
// 		  btn.onclick = () => {
// 			let value = inputUrl.value;

// 			if (!value.startsWith('http://')) {
// 				value = 'http://' + value
// 			}

// 			webview.src = value


// 		  };
// 		</script>
// 	  </body>
// 	</html>
// 	`;
// };

const toggleReplace = (
  range: vscode.Range,
  document: vscode.TextDocument,
  position: vscode.Position,
  regRes: RegExpExecArray | null,
  targetText: string
) => {
  // The code you place here will be executed every time your command is executed
  // Display a message box to the user

  const edit = new vscode.WorkspaceEdit();
  const lineText = document.lineAt(position).text;

  if (regRes !== null) {
    const target = regRes[1];
    edit.replace(document.uri, range, lineText.replace(target, targetText));
  } else {
    edit.insert(document.uri, range.end, ` ${targetText}`);
  }
  vscode.workspace.applyEdit(edit);
};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "kfmd" is now active!');

  vscode.languages.registerCodeLensProvider("*", new KfmdCodelensProvider());

  bindCommand(context, "kfmd.active", () => {
    vscode.window.showInformationMessage("kfmd active!");

    vscode.workspace
      .getConfiguration("kfmd")
      .update("enableCodeLens", true, true);
  });

  bindCommand(context, "kfmd.disactive", () => {
    vscode.workspace
      .getConfiguration("kfmd")
      .update("enableCodeLens", false, true);
  });

  bindCommand(context, "kfmd.toggleColor", () => {
    const current =
      vscode.workspace
        .getConfiguration("kfmd")
        .get("enableShowBackgroundColor", true);


    vscode.workspace
      .getConfiguration("kfmd")
      .update("enableShowBackgroundColor", !current, true);
      triggerUpdateDecorations()
      vscode.window.showInformationMessage("kfmd enableShowBackgroundColor: " + !current);
  })

  //   bindCommand(context, "kfmd.helloWorld", () => {
  //     // The code you place here will be executed every time your command is executed
  //     // Display a message box to the user
  //     vscode.window.showInformationMessage("Hello World from kfmd!");
  //   });

  bindCommand(context, "kfmd.DoneThisItem", toggleReplace);
  bindCommand(context, "kfmd.ToDoThisItem", toggleReplace);

  //   bindCommand(context, "kfmd.webview", () => {
  //     createPanel();
  //   });

  initDecoration(context);
}

// this method is called when your extension is deactivated
export function deactivate() { }
