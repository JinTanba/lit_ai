import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// 環境変数の読み込み
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// ミドルウェアの設定
app.use(cors());
app.use(express.json());

// ヘルスチェックエンドポイント
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

app.post("/chat", () => {
})

// エラーハンドリングミドルウェア
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error'
  });
});

// サーバーの起動
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
