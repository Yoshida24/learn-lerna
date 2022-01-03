# learn-lerna
[WIP]情報が未整理のためまとめ直すこと

> ref. https://github.com/lerna/lerna#readme

## lernaでできること
- TypeScriptのビルド設定の共通化
- 共通のnode_modulesを一箇所にまとめること

### lernaがハマるケース
- 依存関係のあるパッケージの作成
- クライアント・サーバなどで中間にプロトコルを置きたいとき

### lernaがややハマるケース
- ビルド構成を統一したい時

## Commands

> 大原則： lernaを操作するときは基本的にルートディレクトリで操作します。

### Install

```
npm i -D lerna
```

### Init

```
lerna init
```

### create first package

```
lerna create @lemon-sour
```

`lemon-sour`パッケージが`packages`以下に生成されます. 

> @lerna-learn/lemon-sourと命名するのが良さそう。

### create more packages

```
lerna create cli
```

`cli` package is generated below packages. 

### gitignore

`packages`以下にそれぞれnode_modulesができるのでignore

```
echo "**/node_modules" >> .gitignore
echo "**/lib" >> .gitignore
echo "**/dist" >> .gitignore
```

### relate packages

`lemon-sour`の依存性を`cli`に含める。

```
lerna add lemon-sour --scope cli
```

> ノート：これがどのようにしてlemon-sour内部で読み込めるのかはまだ実験してない
> 多分package.jsonのmainプロパティが起点

### 全体で共通して使うnpm packageを追加

```
lerna add typescript # --devをつけるとdevDependenciesに入る
```

### 単一のpackageでだけ使うnpm packageを追加

```
lerna add lodash --scope lemon-sour
```

`lemon-sour`にだけパッケージが追加されます。

### 全パッケージで同時にnpm script実行

```
lerna run test
```

### 単一パッケージでnpm script実行

```
lerna run test --scope lemon-sour # 全パッケージでnpm run testが走る --scopeオプションでプロジェクト限定可能
```

### 単一のpackageから依存packageを削除

手動でpackage.jsonを操作 -> リセットするしかしない。

```
cd packages/A
vim package.json # **手動で消したいパッケージを削除**
lerna clean
lerna bootstrap
```

### 容量を節約
--hoist オプションをつけることで、package共通で使うモジュールは プロジェクトルートの node_modules/ にインストールされる。
各package配下では、 共通利用しているモジュールのみ node_modules/.bin/ にシンボリックリンクが生成され て利用可能になります。
プロジェクトルートの node_modules/ は lerna clean では消去できないので注意

```
lerna bootstrap --hoist
```

> 普通に`lerna clean`, `lerna bootstrap` をした場合、ルートのnode_modulesが83MBに対して、子のpackageのode_modulesの容量は60MB程度でほぼ節約されていなかった。

### typescript のビルド設定を共通化

- ルートに`tsconfig.json`を作成する
- `packages/server/tsconfig.json`,`packages/client/tsconfig.json`にextentsするjsonを作成する

```
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir":"./lib",
    "declarationDir": "./lib",
    "rootDir": "./src",
    "baseUrl": "./"
  },
  "include": ["./src"]
}
```

- `"build":"tsc"`各packageに追加する

> ノート：`^`をつけていると再インストール時にうっかりバージョンが上がるので注意

## 参考
https://qiita.com/hisasann/items/929b6702df1d6e871ce7
[CIでLerna publishするまで](https://qiita.com/Quramy/items/02f21e10c5cc8c8f5869)
[lerna bootstrap --hoistの使い方と注意点](https://sakebook.hatenablog.com/entry/2018/10/31/080905)