import fs from "fs";
import { Octokit } from "octokit";
import { createPullRequest } from "octokit-plugin-create-pull-request";
import ts from "typescript";
import { ObjectLiteralExpression, Project } from "ts-morph";

export default async function handler(req, res) {
  const { languageID, namespace, items } = req.body;

  const project = new Project();

  const MyOctokit = Octokit.plugin(createPullRequest);

  const octokit = new MyOctokit({
    auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
  });

  // get list of files in directory
  const sourceFile = project.addSourceFileAtPathIfExists(
    `src/translations/locales/${languageID}/${namespace}.ts`
  );

  //get list of object literals in file

  const propertyToUpdate = sourceFile.getVariableDeclarationOrThrow(namespace);

  let objectLiteralExpression =
    propertyToUpdate.getInitializer() as ObjectLiteralExpression;

  if (items.length > 0) {
    if (sourceFile) {
      items.forEach(async (item) => {
        if (!item.translationKey) {
          return;
        }

        objectLiteralExpression.getPropertyOrThrow(item.translationKey).set({
          initializer: `'${item.translationValue}'`,
        });

        const modifiedCode = sourceFile.getText();

        if (modifiedCode) {
          //check if pull request already exists
          const { data: pullRequests } = await octokit.request(
            "GET /repos/{owner}/{repo}/pulls",
            {
              owner: "kyllolive",
              repo: "nextjs-octokit-demo",
              state: "open",
              head: `update-translation`,
            }
          );
          const result = await octokit.createPullRequest({
            owner: "kyllolive",
            repo: "nextjs-octokit-demo",
            title: "Update translation",
            body: "Update translation",
            head: "update-translation",
            base: "main",
            update: pullRequests[0]?.state === "open" ? true : false,
            changes: [
              {
                files: {
                  [`src/translations/locales/${languageID}/${namespace}.ts`]:
                    modifiedCode,
                },
                commit: "Update translation",
              },
            ],
          });

          console.log("Done!", result);
        }
      });
    }
  }

  //loop through imported files and search for the object literal
  //   for (const importedFile of importedFiles) {
  //     const importedFileObjectLiteral = importedFile
  //       .getModuleSpecifierSourceFile()
  //       .getVariableDeclarationOrThrow(namespace)
  //       .getInitializer() as ObjectLiteralExpression;
  //     try {
  //       importedFileObjectLiteral
  //         .getPropertyOrThrow(item.translationKey)
  //         .set({ initializer: `'${item.translationValue}'` });
  //     } catch (error) {
  //       if (error.name === "InvalidOperationError") {
  //         continue;
  //       }
  //     }
  //   }
  // }else {

  // const properties = propertyToUpdate
  //   .getFirstDescendantByKind(ts.SyntaxKind.ObjectLiteralExpression)
  //   .getProperties();

  // for (const property of properties) {
  //   if (ts.isSpreadAssignment(property.compilerNode)) {
  //     const identifier = property.compilerNode
  //       .expression as ts.Identifier;
  //     console.log(identifier.text);
  //     const importDeclaration = sourceFile.getImportDeclaration(
  //       `./commons/${identifier.text}`
  //     );

  //     console.log(importDeclaration);
  //   }
  // }

  // let objectLiteralExpression =
  //   propertyToUpdate.getInitializer() as ObjectLiteralExpression;

  // const test = propertyToUpdate.getText();
  // console.log("test", test);

  //only set initializer if it's not the same as the existing one
  // if (
  //   objectLiteralExpression
  //     .getPropertyOrThrow(item.translationKey)
  //     .getText() === item.translationValue
  // ) {
  //   return;
  // }

  // objectLiteralExpression.getPropertyOrThrow(item.translationKey).set({
  //   initializer: item.translationValue,
  // });

  // const modifiedCode = sourceFile.getText();

  // get spread operator assignment

  // const test = objectLiteralExpression.getPropertyOrThrow((p) => {
  //   console.log(p);
  //   return p.getText() === "...topNav";
  // });

  // if (objectLiteralExpression.getProperty(item.translationKey)) {
  //check if translationValue is not the same as the existing one
  // if (
  //   objectLiteralExpression
  //     .getPropertyOrThrow(item.translationKey)
  //     .getText() === item.translationValue
  // ) {
  //   return;
  // }

  //   objectLiteralExpression.getPropertyOrThrow(
  //     item.translationKey
  //   ).set({
  //     initializer: item.translationValue,
  //   });
  // } else {
  //   objectLiteralExpression.addPropertyAssignment({
  //     name: item.translationKey,
  //     initializer: item.translationValue,
  //   });
  // }

  // objectLiteralExpression.getPropertyOrThrow("LABEL_SIGN_UP").set({
  //   initializer: "Sign Up!",
  // });

  // const modifiedCode = sourceFile.getText();

  // if (sourceFile) {
  //   const propertyToUpdate =
  //     sourceFile.getVariableDeclarationOrThrow(namespace);

  //   console.log(propertyToUpdate);
  // }

  // Read the file
  // fs.readFile("src/translations/locales/en/about.ts", "utf8", (err, data) => {
  //   if (err) {
  //     console.error(err);
  //     return;
  //   }

  // Parse the file with the TypeScript compiler
  // const sourceFile = ts.createSourceFile(
  //   "./account.ts",
  //   data,
  //   ts.ScriptTarget.Latest,
  //   true
  // );

  // console.log(sourceFile);

  // Convert the updated ast back to code
  // const output = ts.createPrinter().printFile(sourceFile);

  // Write the modified code to a variable
  // or you can save it back to file using `fs.writeFile`

  // const getFile = fs.readFileSync(
  //   "src/translations/locales/en/about.ts",
  //   "utf8"
  // );

  // traverse folder based on req.body.languageID

  // copy content of file to new file

  // get all req.body.items translationKey and translationValue and update the new file

  //submit new file as PR to epico-bot branch targeting the repository translations folder

  // const octokit_result = await octokit.createPullRequest({
  //   owner: "kyllolive",
  //   repo: "nextjs-octokit-demo",
  //   title: "update translations",
  //   body: "update translations",
  //   head: "epico-bot",
  //   base: "main",
  //   changes: [
  //     {
  //       files: {
  //         // [`translations/${languageID}.json`]: content,
  //         [`translations/${languageID}.json`]: ({
  //           exists,
  //           encoding,
  //           content,
  //         }) => {
  //           // do not create the file if it does not exist
  //           if (!exists) return null;

  //           return Buffer.from(content, encoding)
  //             .toString("utf-8")
  //             .toUpperCase();
  //         },
  //       },
  //       commit: "update translations",
  //     },
  //   ],
  // });

  // .res
  //   .status(200)
  //   .json({ name: req.body });
  res.status(200).json({ name: "pullRequest" });

  //Traverse the AST and find the property
  // function findProperty(node) {
  //   if (ts.isPropertyAssignment(node)) {
  //     console.log("test", node);
  //     const name = node.name;
  //     // console.log("test", name.getText());
  //     if (name.getText() === "LABEL_SIGN_IN") {
  //       // Update the value of the property
  //       node.initializer = ts.createStringLiteral("Sign in");
  //     }
  //   }
  //   ts.forEachChild(node, findProperty);
  // }
}
