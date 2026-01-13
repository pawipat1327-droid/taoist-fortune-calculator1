import React, { useState } from 'react';
import { Icons, CODE_GS_TEMPLATE } from '../constants';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  gasUrl: string;
  onSave: (url: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, gasUrl, onSave }) => {
  const [urlInput, setUrlInput] = useState(gasUrl);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(CODE_GS_TEMPLATE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl flex flex-col shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-gray-900/50">
          <div className="flex items-center space-x-2 text-purple-300">
            <Icons.CodeBracket />
            <h2 className="text-xl font-bold font-serif">Backend Setup (Google Apps Script)</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-teal-300">1. Deploy Backend Logic</h3>
            <p className="text-sm text-gray-300">
              To enable data logging, create a new Google Apps Script project, paste the code below into <code>Code.gs</code>, and deploy as a Web App.
            </p>
            <div className="relative group">
              <pre className="bg-gray-950 p-4 rounded-lg text-xs font-mono text-gray-300 overflow-x-auto border border-gray-700 h-48">
                {CODE_GS_TEMPLATE}
              </pre>
              <button 
                onClick={handleCopyCode}
                className="absolute top-2 right-2 bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-md transition-all flex items-center space-x-1 border border-gray-600 shadow-lg"
              >
                <Icons.Clipboard />
                <span className="text-xs">{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <div className="text-xs text-yellow-200/80 bg-yellow-900/20 p-3 rounded border border-yellow-700/30">
              <strong>Important Deployment Settings:</strong>
              <ul className="list-disc pl-4 mt-1 space-y-1">
                <li>Execute as: <strong>Me</strong> (your account)</li>
                <li>Who has access: <strong>Anyone</strong> (to allow the app to post data)</li>
              </ul>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-teal-300">2. Connect App</h3>
            <p className="text-sm text-gray-300">
              Paste the <strong>Web App URL</strong> (starts with <code>https://script.google.com/...</code>) below.
            </p>
            <input
              type="text"
              placeholder="https://script.google.com/macros/s/..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full bg-gray-900/50 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder-gray-600"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700 bg-gray-900/50 flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              onSave(urlInput);
              onClose();
            }}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold shadow-lg transition-all transform active:scale-95"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;