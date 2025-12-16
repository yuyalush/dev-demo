# dev-demo
開発系のテーマのためのデモ用


## Action実行用の接続設定

以下をcredentials.jsonとして作成し、Azure CLIで実行する

```
{
  "name": "repo-oidc",
  "issuer": "https://token.actions.githubusercontent.com",
  "subject": "repo:yuyalush/dev-demo:ref:refs/heads/copilot/developed-butterfly",
  "audiences": ["api://AzureADTokenExchange"]
}
```

- 当該テナントにアプリケーションを登録
- サービス プリンシパルを作成
- Federated Credential の設定
- ACR へ push するため AcrPush を付与
- Container Apps を更新できる権限を付与

```
az ad app create --display-name github-oidc-demo
az ad sp create --id <appID>
az ad app federated-credential create --id <appId> --parameters credentials.json
ACR_ID=$(az acr show -n $ACR_NAME --query id -o tsv)
az role assignment create --assignee <AZURE_CLIENT_ID> --role "AcrPush" --scope $ACR_ID
RG_ID=$(az group show -n $RG_NAME --query id -o tsv)
az role assignment create --assignee <AZURE_CLIENT_ID> --role "Contributor" --scope $RG_ID
```

- コンテナーアプリにシステム割り当てIDを付与
- レジストリをマネージドIDで関連付け

```
az containerapp identity assign -g <rg> -n demo-api --system-assigned
PRINCIPAL_ID=$(az containerapp show -g <rg> -n demo-api --query identity.principalId -o tsv)
ACR_ID=$(az acr show -n devdemoacr1216 --query id -o tsv)
az role assignment create --assignee $PRINCIPAL_ID --role "AcrPull" --scope $ACR_ID
az containerapp registry set -g <rg> -n demo-api --server devdemoacr1216.azurecr.io --identity system
```

