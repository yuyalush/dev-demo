# dev-demo
開発系のテーマのためのデモ用


## Action実行用の接続設定

```
az ad app create --display-name github-oidc-demo
az ad app federated-credential create --id <appId> --parameters credentials.json
```

以下をcredentials.jsonとして作成し、Azure CLIで実行する

```
{
  "name": "repo-oidc",
  "issuer": "https://token.actions.githubusercontent.com",
  "subject": "repo:yuyalush/dev-demo:ref:refs/heads/copilot/developed-butterfly",
  "audiences": ["api://AzureADTokenExchange"]
}
```