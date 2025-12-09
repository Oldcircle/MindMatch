import React, { useState, useEffect } from 'react';
import { X, Plus, Save, Trash2, Check } from 'lucide-react';
import { AIConfig, AIProvider, Language } from '../types';
import { DEFAULT_AI_CONFIGS } from '../constants';
import { t } from '../locales';

interface ModelSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  activeConfigId: string;
  onConfigChange: (id: string) => void;
  lang: Language;
}

export const ModelSettings: React.FC<ModelSettingsProps> = ({ 
  isOpen, onClose, activeConfigId, onConfigChange, lang 
}) => {
  const [configs, setConfigs] = useState<AIConfig[]>(() => {
    const saved = localStorage.getItem('mm_ai_configs');
    return saved ? JSON.parse(saved) : DEFAULT_AI_CONFIGS;
  });

  const [selectedId, setSelectedId] = useState<string>(activeConfigId);
  const [editingConfig, setEditingConfig] = useState<AIConfig | null>(null);

  // Sync with active when opening
  useEffect(() => {
    if (isOpen) {
      const found = configs.find(c => c.id === activeConfigId) || configs[0];
      setSelectedId(found.id);
      setEditingConfig(found);
    }
  }, [isOpen, activeConfigId, configs]);

  const handleSave = () => {
    if (!editingConfig) return;
    const newConfigs = configs.map(c => c.id === editingConfig.id ? editingConfig : c);
    setConfigs(newConfigs);
    localStorage.setItem('mm_ai_configs', JSON.stringify(newConfigs));
    
    // If we just edited the active config, trigger update
    if (editingConfig.id === activeConfigId) {
      onConfigChange(activeConfigId); 
    }
  };

  const handleSelect = (config: AIConfig) => {
    setSelectedId(config.id);
    setEditingConfig(config);
  };

  const handleAdd = () => {
    const newConfig: AIConfig = {
      id: Date.now().toString(),
      name: 'New Config',
      provider: 'openai',
      apiKey: '',
      baseUrl: '',
      modelName: 'gpt-3.5-turbo'
    };
    const newConfigs = [...configs, newConfig];
    setConfigs(newConfigs);
    handleSelect(newConfig);
    localStorage.setItem('mm_ai_configs', JSON.stringify(newConfigs));
  };

  const handleDelete = (id: string) => {
    if (configs.length <= 1) return; // Prevent deleting last
    const newConfigs = configs.filter(c => c.id !== id);
    setConfigs(newConfigs);
    localStorage.setItem('mm_ai_configs', JSON.stringify(newConfigs));
    
    if (id === selectedId) {
      handleSelect(newConfigs[0]);
    }
    if (id === activeConfigId) {
      onConfigChange(newConfigs[0].id);
    }
  };

  const handleActivate = () => {
    onConfigChange(selectedId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[600px] flex overflow-hidden flex-col md:flex-row">
        
        {/* Sidebar List */}
        <div className="w-full md:w-1/3 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white">
            <h2 className="font-bold text-slate-700">{t(lang, 'config_list')}</h2>
            <button onClick={handleAdd} className="p-1 hover:bg-slate-100 rounded-full text-primary transition-colors">
              <Plus size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {configs.map(config => (
              <div 
                key={config.id}
                onClick={() => handleSelect(config)}
                className={`p-3 rounded-lg cursor-pointer flex items-center justify-between group transition-all ${
                  selectedId === config.id 
                    ? 'bg-white shadow-md border-l-4 border-primary' 
                    : 'hover:bg-slate-100 border-l-4 border-transparent'
                }`}
              >
                <div className="flex flex-col min-w-0">
                  <span className={`font-medium truncate ${selectedId === config.id ? 'text-slate-800' : 'text-slate-600'}`}>
                    {config.name}
                  </span>
                  <span className="text-xs text-slate-400 capitalize truncate">{config.provider}</span>
                </div>
                {activeConfigId === config.id && (
                  <div className="w-2 h-2 bg-green-500 rounded-full shrink-0 ml-2" title="Active"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Edit Form */}
        <div className="flex-1 flex flex-col bg-white">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">{t(lang, 'settings_title')}</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <X size={24} />
            </button>
          </div>

          {editingConfig ? (
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t(lang, 'config_name')}</label>
                <input 
                  type="text" 
                  value={editingConfig.name}
                  onChange={e => setEditingConfig({...editingConfig, name: e.target.value})}
                  onBlur={handleSave}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                />
              </div>

              {/* Provider */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t(lang, 'provider')}</label>
                <select 
                  value={editingConfig.provider}
                  onChange={e => setEditingConfig({...editingConfig, provider: e.target.value as AIProvider})}
                  onBlur={handleSave}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none bg-white"
                >
                  <option value="google">{t(lang, 'provider_google')}</option>
                  <option value="openai">{t(lang, 'provider_openai')}</option>
                  <option value="ollama">{t(lang, 'provider_ollama')}</option>
                </select>
              </div>

              {/* Base URL */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t(lang, 'base_url')}</label>
                <input 
                  type="text" 
                  value={editingConfig.baseUrl || ''}
                  onChange={e => setEditingConfig({...editingConfig, baseUrl: e.target.value})}
                  onBlur={handleSave}
                  placeholder={
                    editingConfig.provider === 'openai' ? 'https://api.openai.com/v1' : 
                    editingConfig.provider === 'ollama' ? 'http://localhost:11434/v1' : ''
                  }
                  disabled={editingConfig.provider === 'google'}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none disabled:bg-slate-100 disabled:text-slate-400 font-mono text-sm"
                />
                <p className="text-xs text-slate-400 mt-1">
                  {editingConfig.provider === 'google' ? 'Google SDK handles base URL.' : t(lang, 'base_url_placeholder')}
                </p>
              </div>

              {/* API Key */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t(lang, 'api_key')}</label>
                <input 
                  type="password" 
                  value={editingConfig.apiKey || ''}
                  onChange={e => setEditingConfig({...editingConfig, apiKey: e.target.value})}
                  onBlur={handleSave}
                  placeholder={t(lang, 'api_key_placeholder')}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none font-mono text-sm tracking-widest"
                />
              </div>

              {/* Model Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t(lang, 'model_name')}</label>
                <input 
                  type="text" 
                  value={editingConfig.modelName}
                  onChange={e => setEditingConfig({...editingConfig, modelName: e.target.value})}
                  onBlur={handleSave}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none font-mono text-sm"
                />
              </div>

            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400">
              Select a configuration
            </div>
          )}

          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-br-2xl flex justify-between items-center">
             <button 
                onClick={() => handleDelete(selectedId)}
                disabled={configs.length <= 1}
                className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title={t(lang, 'delete')}
              >
                <Trash2 size={20} />
              </button>

              <div className="flex gap-3">
                <button 
                  onClick={onClose}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition-colors"
                >
                  {t(lang, 'cancel')}
                </button>
                <button 
                  onClick={handleActivate}
                  className="flex items-center gap-2 px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 shadow-md transition-all active:scale-95"
                >
                  <Check size={18} />
                  {selectedId === activeConfigId ? t(lang, 'save_close') : 'Use This Config'}
                </button>
              </div>
          </div>
        </div>

      </div>
    </div>
  );
};
