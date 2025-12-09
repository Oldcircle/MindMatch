# MindMatch AI (灵感对对碰)

**[English]** | [中文](#chinese)

A modern, AI-powered Memory Card Game that generates unique game themes on the fly using Large Language Models (LLMs). Built with React, Tailwind CSS, and supports multiple AI providers including Gemini, OpenAI, DeepSeek, and local Ollama.

## Features

- 🧠 **AI-Powered Themes**: Type anything (e.g., "Cyberpunk", "80s Retro", "Sushi"), and the AI generates matching emojis.
- 🎮 **Two Game Modes**:
  - **Casual Mode**: Relaxed play with standard difficulty.
  - **Level Mode**: Progressively harder levels with increasing card counts.
- ⚙️ **Multi-Model Support**:
  - **Google Gemini**: Native support via Google GenAI SDK.
  - **OpenAI Compatible**: Supports DeepSeek, Moonshot, Claude (via proxy), etc.
  - **Ollama**: Connect to your local LLM (e.g., Llama3, Mistral).
- 🌍 **Bilingual**: Full English and Chinese (Simplified) support.
- 🎨 **Modern UI**: Smooth 3D animations, responsive design, and glassmorphism effects.

## Quick Start

1. Open `index.html` in your browser.
2. (Optional) Click the **Settings** icon to configure your own API Key.
   - By default, it uses the environment's `API_KEY` for Gemini.
   - You can add your own OpenAI / DeepSeek / Ollama keys in the UI.

## Configuration Guide

Click the **Settings** button in the top right to open the model manager.

- **Google (Gemini)**:
  - Model: `gemini-2.5-flash` (Recommended)
  - Key: Your Google AI Studio key.
- **DeepSeek (OpenAI Compatible)**:
  - Base URL: `https://api.deepseek.com`
  - Model: `deepseek-chat`
- **Local Ollama**:
  - Base URL: `http://localhost:11434/v1`
  - Model: `llama3`
  - *Note: Ensure your Ollama server allows CORS (`OLLAMA_ORIGINS="*" ollama serve`).*

---

<a name="chinese"></a>
# 灵感对对碰 AI (MindMatch AI)

一个现代化的、由 AI 驱动的记忆翻牌游戏。它利用大语言模型（LLM）实时生成独一无二的游戏主题。基于 React 和 Tailwind CSS 构建，支持 Gemini、OpenAI、DeepSeek 以及本地 Ollama 等多种模型。

## 功能特色

- 🧠 **AI 主题生成**: 输入任何关键词（如“赛博朋克”、“80年代复古”、“寿司”），AI 即刻为你生成专属卡牌 Emoji。
- 🎮 **双游戏模式**:
  - **休闲模式**: 轻松游玩，标准难度。
  - **闯关模式**: 难度循序渐进，卡牌数量随关卡增加。
- ⚙️ **多模型支持**:
  - **Google Gemini**: 原生支持。
  - **OpenAI 兼容**: 支持 DeepSeek (深度求索)、Moonshot (月之暗面) 等。
  - **Ollama**: 支持连接本地运行的模型 (如 Llama3)。
- 🌍 **双语支持**: 完美支持中文与英文界面切换。
- 🎨 **精美 UI**: 流畅的 3D 翻转动画，响应式布局与毛玻璃效果。

## 快速开始

1. 直接在浏览器中打开 `index.html`。
2. (可选) 点击右上角的 **设置** 图标配置您的 API 密钥。
   - 默认情况下，它会尝试使用环境变量中的 `API_KEY` (针对 Gemini)。
   - 您可以在界面中添加 DeepSeek / OpenAI / Ollama 的配置。

## 模型配置指南

点击顶部的 **设置 (Settings)** 按钮打开模型管理器：

- **Google (Gemini)**:
  - 模型: 推荐 `gemini-2.5-flash`
- **DeepSeek (OpenAI 兼容)**:
  - Base URL: `https://api.deepseek.com`
  - 模型: `deepseek-chat`
- **本地 Ollama**:
  - Base URL: `http://localhost:11434/v1`
  - 模型: `llama3`
  - *注意: 请确保您的 Ollama 服务已开启 CORS 跨域支持 (`OLLAMA_ORIGINS="*" ollama serve`)。*
