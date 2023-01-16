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

  // do magic here

  const repoName = "nextjs-octokit-demo";
  const folderPath = `src/translations/locales/${languageID}/${namespace}.ts`;
  const folderPathInGithub = `src/translations/locales/${languageID}`;
  const impotedModule = `src/translations/locales/${languageID}/commons`;

  //if string not in namespace, concat imported module to folderPath [impotedModule, importedModuleName].join("/")

  const sourceFileFromGithub = await octokit.request(
    "GET /repos/{owner}/{repo}/contents/{path}",
    {
      owner: "kyllolive",
      repo: repoName,
      path: folderPathInGithub,
    }
  );

  console.log(sourceFileFromGithub);
}
