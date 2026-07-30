client<llm> CodexSubscription {
  provider openai-generic
  options {
    base_url "http://127.0.0.1:3000/api/codex-adapter/v1"
    model "codex-subscription"
    headers {
      "X-Motive-Adapter" "motive-local"
    }
  }
}
