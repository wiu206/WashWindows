## 修改專案方法

#### 1. Fork 組織專案
在 GitHub 上進入目標專案頁面，點擊右上角的 **Fork** 按鈕，將專案複製到個人帳號下。
![](https://i.imgur.com/nK91NTB.png)

#### 2. 複製專案路徑
點擊專案頁面的 Code 按鈕，選擇 **HTTPS** 複製專案路徑。
![](https://i.imgur.com/QHSwo25.png)

#### 3. 取得最新版本專案
使用指令初始化專案並拉取最新內容：
```bash
git init
git pull <專案路徑>
```
![](https://i.imgur.com/NTXh4qT.png)

#### 4. 上傳修改內容
**第一次設定**
- 如果是第一次設定該專案的遠程路徑，請使用以下指令：
    ```bash
    git branch -M main
    git remote add origin <專案路徑>
    ```
**查看檔案狀態**
- 檢查專案中的檔案狀態：
    ```bash
    git status
    ```
    - **紅色**：檔案尚未新增至追蹤 (**untracked**)
    - **綠色**：檔案已新增至追蹤，但尚未提交 (**staged**)

**提交修改**
- 將修改的檔案新增至追蹤並提交：
    ```bash
    git add <欲新增檔案> # 若要新增全部檔案: .
    git commit -m "內容紀錄"
    git push -u origin main
    ```
**返回未追蹤狀態**
- 如果需要取消追蹤已 staged 的檔案：
    ```bash
    git restore --staged <檔案名稱> # 若要新增全部檔案: .
    ```
![](https://i.imgur.com/M0x4vUz.png)

#### 5. 查看 Repository 並開啟 Pull Request
在 GitHub 頁面檢查個人 Fork 的 Repository，點擊 **Compare & Pull Request** 按鈕進行提交。
![](https://i.imgur.com/RTluhDK.png)

#### 6. 建立Pull Request
填寫相關資訊後，點擊 **Create Pull Request** 提交修改內容。
![](https://i.imgur.com/xBy0pLm.png)