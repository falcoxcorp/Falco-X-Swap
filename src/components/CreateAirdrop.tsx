import React, { useState } from 'react';
import { Info, Check, X, Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CreateAirdrop: React.FC = () => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [tokenAddress, setTokenAddress] = useState('');
  const [airdropTitle, setAirdropTitle] = useState('');
  const [logo, setLogo] = useState('');
  const [website, setWebsite] = useState('');
  const [facebook, setFacebook] = useState('');
  const [twitter, setTwitter] = useState('');
  const [github, setGithub] = useState('');
  const [telegram, setTelegram] = useState('');
  const [instagram, setInstagram] = useState('');
  const [discord, setDiscord] = useState('');
  const [reddit, setReddit] = useState('');
  const [description, setDescription] = useState('');

  const handleNext = () => {
    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleCreate = () => {
    // Implement airdrop creation logic
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-xl sm:text-2xl font-bold text-white">Create Airdrop</h1>
          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">Coming Soon</span>
        </div>
        <p className="text-sm sm:text-base text-gray-400">Create a new token airdrop campaign</p>
      </div>

      <div className="bg-gray-900/30 backdrop-blur-md rounded-lg border border-gray-800 p-6">
        {currentStep === 1 ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Token Address</label>
              <input
                type="text"
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
                placeholder="Ex: Falco-X Moon"
                className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {!tokenAddress && (
                <div className="mt-1 text-xs text-red-400">Token address cannot be blank</div>
              )}
              <div className="mt-1 text-xs text-blue-400">Creation Fee: Soon</div>
            </div>

            <button
              onClick={handleNext}
              className="w-full py-2.5 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              Next
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Airdrop Title (optional)</label>
              <input
                type="text"
                value={airdropTitle}
                onChange={(e) => setAirdropTitle(e.target.value)}
                placeholder="Ex: Join my pinksale airdrop"
                className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Logo</label>
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center">
                  <button className="flex flex-col items-center justify-center w-full gap-2">
                    <Upload className="w-6 h-6 text-gray-400" />
                    <span className="text-sm text-gray-400">Upload</span>
                  </button>
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  You can either manually input the logo URL or use AI to generate it.
                  The URL must resolve to an image resource with a supported extension (png, jpg, jpeg, gif) and the size must be less than 2Mb.
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Website</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="Ex: https://"
                  className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Facebook (optional)</label>
                <input
                  type="url"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="Ex: https://"
                  className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Twitter (optional)</label>
                <input
                  type="url"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  placeholder="Ex: https://"
                  className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Github (optional)</label>
                <input
                  type="url"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="Ex: https://"
                  className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Telegram (optional)</label>
                <input
                  type="url"
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
                  placeholder="Ex: https://"
                  className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Instagram (optional)</label>
                <input
                  type="url"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="Ex: https://"
                  className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Discord (optional)</label>
                <input
                  type="url"
                  value={discord}
                  onChange={(e) => setDiscord(e.target.value)}
                  placeholder="Ex: https://"
                  className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Reddit (optional)</label>
              <input
                type="url"
                value={reddit}
                onChange={(e) => setReddit(e.target.value)}
                placeholder="Ex: https://"
                className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Description (optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Awesome project"
                rows={4}
                className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleBack}
                className="flex-1 py-2.5 bg-gray-700 text-white rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleCreate}
                className="flex-1 py-2.5 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                Create New Airdrop
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateAirdrop;