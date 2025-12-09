
import { Language } from './types';

export const translations = {
  en: {
    app_title: "MindMatch AI",
    playing_theme: "Theme",
    moves: "Moves",
    time: "Time",
    time_left: "Time Left",
    matches: "Matches",
    score: "Score",
    level: "Level",
    
    // Modes
    mode_casual: "Casual Mode",
    mode_level: "Level Mode",
    
    // Difficulties
    diff_easy: "Easy (3x4)",
    diff_normal: "Normal (4x4)",
    diff_hard: "Hard (4x6)",
    diff_master: "Master (6x6)",
    
    // Records
    records_title: "Hall of Fame",
    records_btn: "Records",
    no_records: "No records yet.",
    best_time: "Best Time",
    fewest_moves: "Fewest Moves",
    max_level: "Max Level Reached",
    high_score: "High Score",
    casual_records: "Casual Best",
    level_records: "Level Progress",
    
    // Controls
    start_game: "Start Game",
    restart_game: "Restart",
    next_level: "Next Level",
    generate_btn: "Generate Deck",
    theme_placeholder: "Enter a theme (e.g., 'Cyberpunk City')",
    difficulty: "Difficulty",
    
    // Settings
    settings_title: "AI Configuration",
    config_list: "Configs",
    add_config: "New Config",
    
    // Form
    config_name: "Config Name",
    provider: "Provider",
    api_key: "API Key",
    api_key_placeholder: "Leave empty to use default env var (if set)",
    base_url: "Base URL",
    base_url_placeholder: "https://api.openai.com/v1",
    model_name: "Model Name",
    save_close: "Save & Close",
    cancel: "Cancel",
    delete: "Delete",
    
    // Messages
    win_title: "Fantastic Job!",
    win_msg_casual: "You completed the {theme} deck in {moves} moves.",
    win_msg_level: "Level {level} Complete! Getting harder...",
    game_over: "Game Over",
    game_over_timeout: "Time's up! You reached Level {level}.",
    try_again: "Try Again",
    loading_ai: "Dreaming up new cards...",
    error_ai: "AI Generation failed. Check your API settings.",
    
    // Providers
    provider_google: "Google (Gemini)",
    provider_openai: "OpenAI Compatible (DeepSeek, etc.)",
    provider_ollama: "Ollama (Local)",
  },
  zh: {
    app_title: "灵感对对碰 AI",
    playing_theme: "当前主题",
    moves: "步数",
    time: "用时",
    time_left: "剩余时间",
    matches: "匹配",
    score: "分数",
    level: "关卡",
    
    // Modes
    mode_casual: "休闲模式",
    mode_level: "闯关模式",
    
    // Difficulties
    diff_easy: "简单 (3x4)",
    diff_normal: "普通 (4x4)",
    diff_hard: "困难 (4x6)",
    diff_master: "大师 (6x6)",
    
    // Records
    records_title: "荣誉榜",
    records_btn: "记录",
    no_records: "暂无记录",
    best_time: "最佳用时",
    fewest_moves: "最少步数",
    max_level: "最高关卡",
    high_score: "最高分数",
    casual_records: "休闲模式记录",
    level_records: "闯关模式记录",
    
    // Controls
    start_game: "开始游戏",
    restart_game: "重新开始",
    next_level: "下一关",
    generate_btn: "生成卡组",
    theme_placeholder: "输入主题 (例如: '赛博朋克', '武侠')",
    difficulty: "难度",
    
    // Settings
    settings_title: "配置 AI 模型",
    config_list: "配置列表",
    add_config: "新建配置",
    
    // Form
    config_name: "配置名称",
    provider: "服务商",
    api_key: "API 密钥",
    api_key_placeholder: "留空以使用默认环境变量 (若已配置)",
    base_url: "API 地址 (Base URL)",
    base_url_placeholder: "https://api.example.com/v1",
    model_name: "模型名称",
    save_close: "保存并关闭",
    cancel: "取消",
    delete: "删除",
    
    // Messages
    win_title: "太棒了！",
    win_msg_casual: "你完成了【{theme}】主题，用了 {moves} 步。",
    win_msg_level: "第 {level} 关完成！难度升级...",
    game_over: "游戏结束",
    game_over_timeout: "时间到！你止步于第 {level} 关。",
    try_again: "再试一次",
    loading_ai: "正在构想新卡片...",
    error_ai: "AI 生成失败，请检查配置。",
    
    // Providers
    provider_google: "Google (Gemini)",
    provider_openai: "OpenAI 兼容 (DeepSeek / Claude 等)",
    provider_ollama: "Ollama (本地运行)",
  }
};

export const t = (lang: Language, key: keyof typeof translations['en'], params: Record<string, string | number> = {}) => {
  let text = translations[lang][key] || translations['en'][key] || key;
  Object.keys(params).forEach(param => {
    text = text.replace(`{${param}}`, String(params[param]));
  });
  return text;
};
