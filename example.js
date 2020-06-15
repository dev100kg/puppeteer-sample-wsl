const chromeFinder = require("chrome-launcher/dist/chrome-finder");
const puppeteer = require("puppeteer-core");

//接続先URL
const connectUrl = "http://google.co.jp";
//Google検索文字列
const googleSerchStr = "マクドナルド";

//ブラウザオブジェクトとページオブジェクトの生成
const setup = async () => {
  //ヘッドレスモードで起動
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: chromeFinder.wsl()[0],
    userDataDir: process.env.UDD,
  });
  //新しいページオブジェクトの作成
  const page = await browser.newPage();
  //ViewPortの設定
  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
  });
  //ブラウザオブジェクトとページオブジェクトを返却
  return { browser, page };
};

(async () => {
  //ブラウザオブジェクトとページオブジェクトの準備
  const { browser, page } = await setup();
  //Googleに遷移
  await page.goto(connectUrl);
  //検索窓に「マクドナルド」と入力させる
  await page.type("input[name=q]", googleSerchStr, { delay: 50 });
  //検索ボタン押下
  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle2" }),
    page.click('input[type="submit"]'),
  ]);
  //スクショを取る(google.png)
  await page.screenshot({ path: "google.png" });
  //ブラウザオブジェクトの破棄
  await browser.close();
})();
