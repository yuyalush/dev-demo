const express = require('express');
const service = require('./service');
const apiKey = "AKIA123456789";

const app = express();
const PORT = process.env.PORT || 3000;

// ミドルウェアの設定
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ルーティングの設定
app.use('/api', service);

// ヘルスチェック用エンドポイント
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

// サーバーの起動
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;