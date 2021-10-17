import * as vscode from "vscode";
import { bindDoneDecoration, bindTodoDecoration } from "../decoration/KfmdDecoration";


const buildBasicCodeLens = (
  command: vscode.Command,
  range: vscode.Range
): vscode.CodeLens => {
  const codelens = new vscode.CodeLens(range);
  codelens.command = command;
  return codelens;
};

const buildNormalCodeLens = (range: vscode.Range): vscode.CodeLens => {
  return buildBasicCodeLens(
    {
      title: "kfmd normal",
      command: "kfmd.helloWorld",
    },
    range
  );
};

const buildTodoCodeLens = (
  range: vscode.Range,
  document: vscode.TextDocument,
  position: vscode.Position,
  regRes: RegExpExecArray | null
): vscode.CodeLens => {
  return buildBasicCodeLens(
    {
      title: "Done",
      command: "kfmd.DoneThisItem",
      arguments: [range, document, position, regRes, "[DONE]"],
    },
    range
  );
};
const buildDoneCodeLens = (
  range: vscode.Range,
  document: vscode.TextDocument,
  position: vscode.Position,
  regRes: RegExpExecArray | null
): vscode.CodeLens => {
  return buildBasicCodeLens(
    {
      title: "Todo",
      command: "kfmd.ToDoThisItem",
      arguments: [range, document, position, regRes, "[TODO]"],
    },
    range
  );
};

/**
 * CodelensProvider
 */
export class KfmdCodelensProvider implements vscode.CodeLensProvider {
  private codeLenses: vscode.CodeLens[] = [];
  private regex: RegExp;
  private _onDidChangeCodeLenses: vscode.EventEmitter<void> =
    new vscode.EventEmitter<void>();
  public readonly onDidChangeCodeLenses: vscode.Event<void> =
    this._onDidChangeCodeLenses.event;

  private todoRegex: RegExp;
  private doneRegex: RegExp;

  constructor() {
    this.regex = /( +)?- (.+)/g;
    this.todoRegex = /.*?((\[?todo\]?)|(\[?TODO\]?))/g;
    this.doneRegex = /.*?((\[?done\]?)|(\[?DONE\]?))/g;
    vscode.workspace.onDidChangeConfiguration((_) => {
      this._onDidChangeCodeLenses.fire();
    });
  }

  public provideCodeLenses(
    document: vscode.TextDocument,
    token: vscode.CancellationToken
  ): vscode.CodeLens[] | Thenable<vscode.CodeLens[]> {
    if (vscode.workspace.getConfiguration("kfmd").get("enableCodeLens", true)) {
      this.codeLenses = [];
      const regex = new RegExp(this.regex);
      const text = document.getText();
      let matches;
      while ((matches = regex.exec(text)) !== null) {
        const line = document.lineAt(document.positionAt(matches.index).line);
        const indexOf = line.text.indexOf(matches[0]);
        const position = new vscode.Position(line.lineNumber, indexOf);
        const range = document.getWordRangeAtPosition(
          position,
          new RegExp(this.regex)
        );
        const todoRange = document.getWordRangeAtPosition(
          position,
          new RegExp(this.todoRegex)
        );
        const doneRange = document.getWordRangeAtPosition(
          position,
          new RegExp(this.doneRegex)
        );

        if (todoRange) {
          const regRes = new RegExp(this.todoRegex).exec(line.text)!!;
          this.codeLenses.push(
            buildTodoCodeLens(todoRange, document, position, regRes)
          );
          if (range) {
            bindTodoDecoration(range);
          }
        } else if (doneRange) {
          const regRes = new RegExp(this.doneRegex).exec(line.text)!!;
          this.codeLenses.push(
            buildDoneCodeLens(doneRange, document, position, regRes)
          );
          if (range) {
            bindDoneDecoration(range);
          }
        } else if (range) {
          this.codeLenses.push(
            buildTodoCodeLens(range, document, position, null)
          );
          this.codeLenses.push(
            buildDoneCodeLens(range, document, position, null)
          );
        }
      }
      return this.codeLenses;
    }
    return [];
  }

  public resolveCodeLens(
    codeLens: vscode.CodeLens,
    token: vscode.CancellationToken
  ) {
    if (vscode.workspace.getConfiguration("kfmd").get("enableCodeLens", true)) {
      return codeLens;
    }
    return null;
  }
}
