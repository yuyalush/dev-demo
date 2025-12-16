# dev-demo
開発系のテーマのためのデモ用

## Azureデプロイ先の作成

```
RG_NAME="demo-rg"
ACR_NAME="demoacr1216"
az group create -n $RG_NAME -l japaneast
az acr create -n $ACR_NAME -g $RG_NAME --sku Basic
az containerapp env create -g $RG_NAME -n demo-ca-env -l japaneast
az containerapp create -g $RG_NAME -n demo-api --environment demo-ca-env --image mcr.microsoft.com/azuredocs/containerapps-helloworld:latest --ingress external --target-port 80

```


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
az containerapp identity assign -g $RG_NAME -n demo-api --system-assigned
PRINCIPAL_ID=$(az containerapp show -g $RG_NAME -n demo-api --query identity.principalId -o tsv)
ACR_ID=$(az acr show -n $ACR_NAME --query id -o tsv)
az role assignment create --assignee $PRINCIPAL_ID --role "AcrPull" --scope $ACR_ID
az containerapp registry set -g $RG_NAME -n demo-api --server $ACR_NAME.azurecr.io --identity system
```

