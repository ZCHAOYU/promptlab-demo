/* ============================================================
 * PromptLab V5 — 本地配置模板
 * ------------------------------------------------------------
 * 用法：把这个文件复制一份、改名成 config.local.js，然后填 key。
 *
 *   copy config.local.example.js config.local.js
 *
 * 不填也能用：语义检索还在（本地模型），只是「第 3 层 LLM 推理」
 * 和「理解输入（结构化抽取）」会静默跳过，输出退回纯词库拼装。
 *
 * 不想建文件也行：用环境变量（config.local.js 不存在时生效）
 *   PowerShell:  $env:DEEPSEEK_API_KEY='sk-...'; python serve.py 8777
 *   cmd:         set DEEPSEEK_API_KEY=sk-... && python serve.py 8777
 *
 * 注意：config.local.js 不要提交到公开仓库，也不要发给别人。
 * ============================================================ */
window.LLM_CONFIG = {
  endpoint: 'https://api.deepseek.com/v1',
  key: '',                       // ← 在这里填你的 key
  model: 'deepseek-flash',
  temperature: 0.2,
  maxTokens: 1500,
  timeoutMs: 24000
};
