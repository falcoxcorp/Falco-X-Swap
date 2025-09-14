import React, { useState } from 'react';
import { Info, Check, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface FairlaunchDetails {
  tokenAddress: string;
  tokenName: string;
  decimals: string;
  mainFee: string;
  tokenFee: string;
  currency: string;
  chain: string;
  totalSellingAmount: string;
  sellingAmount: string;
  whitelist: boolean;
  softCap: string;
  router: string;
  liquidity: string;
  startTime: string;
  endTime: string;
  liquidityLockupDays: string;
  choosenAccount: string;
  logoUrl: string;
  website: string;
  facebook: string;
  twitter: string;
  github: string;
  telegram: string;
  instagram: string;
  discord: string;
  reddit: string;
  youtube: string;
  whitelistLink: string;
  description: string;
  maxContribution: boolean;
  maxBuy: string;
}

const CreateFairlaunch: React.FC = () => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FairlaunchDetails>({
    tokenAddress: '',
    tokenName: '',
    decimals: '18',
    mainFee: '5%',
    tokenFee: '0%',
    currency: 'CORE',
    chain: 'Core',
    totalSellingAmount: '',
    sellingAmount: '',
    whitelist: true,
    softCap: '',
    router: 'falcox',
    liquidity: '',
    startTime: '',
    endTime: '',
    liquidityLockupDays: '',
    choosenAccount: '',
    logoUrl: '',
    website: '',
    facebook: '',
    twitter: '',
    github: '',
    telegram: '',
    instagram: '',
    discord: '',
    reddit: '',
    youtube: '',
    whitelistLink: '',
    description: '',
    maxContribution: false,
    maxBuy: ''
  });

  const handleInputChange = (field: keyof FairlaunchDetails, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      {/* Token Address */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">
          Token Address *
        </label>
        <input
          type="text"
          value={formData.tokenAddress}
          onChange={(e) => handleInputChange('tokenAddress', e.target.value)}
          placeholder="Input token address"
          className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        <p className="text-xs text-gray-500 mt-1">Enter the token address and verify</p>
      </div>

      {/* Currency */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">
          Currency
        </label>
        <select
          value={formData.currency}
          onChange={(e) => handleInputChange('currency', e.target.value)}
          className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 appearance-none"
        >
          <option value="CORE">CORE</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">Users will pay with CORE for your token</p>
      </div>

      {/* Fee Options */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">
          Fee Options
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={formData.mainFee === '5%'}
              onChange={() => {
                handleInputChange('mainFee', '5%');
                handleInputChange('tokenFee', '0%');
              }}
              className="text-yellow-500 focus:ring-yellow-500 bg-gray-800 border-gray-700"
            />
            <span className="text-sm text-white">5% CORE raised only</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={formData.mainFee === '2%'}
              onChange={() => {
                handleInputChange('mainFee', '2%');
                handleInputChange('tokenFee', '2%');
              }}
              className="text-yellow-500 focus:ring-yellow-500 bg-gray-800 border-gray-700"
            />
            <span className="text-sm text-white">2% CORE raised + 2% token sold</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm text-gray-400 mb-2">
          Total Selling Amount *
        </label>
        <input
          type="text"
          value={formData.totalSellingAmount}
          onChange={(e) => handleInputChange('totalSellingAmount', e.target.value)}
          placeholder="Enter Total Selling Amount"
          className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        <p className="text-xs text-gray-500 mt-1">If I spend 1 CORE, how many tokens will I receive?</p>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2">Whitelist</label>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={formData.whitelist}
              onChange={() => handleInputChange('whitelist', true)}
              className="text-yellow-500 focus:ring-yellow-500 bg-gray-800 border-gray-700"
            />
            <span className="text-sm text-white">Enable</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={!formData.whitelist}
              onChange={() => handleInputChange('whitelist', false)}
              className="text-yellow-500 focus:ring-yellow-500 bg-gray-800 border-gray-700"
            />
            <span className="text-sm text-white">Disable</span>
          </label>
        </div>
        <p className="text-xs text-gray-500 mt-1">You can enable/disable whitelist anytime.</p>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2">
          SoftCap (CORE) *
        </label>
        <input
          type="text"
          value={formData.softCap}
          onChange={(e) => handleInputChange('softCap', e.target.value)}
          placeholder="Enter softCap"
          className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={formData.maxContribution}
          onChange={(e) => handleInputChange('maxContribution', e.target.checked)}
          className="rounded border-gray-700 bg-gray-800 text-yellow-500 focus:ring-yellow-500"
        />
        <label className="text-sm text-gray-400">
          Setting max contribution?
        </label>
      </div>

      {formData.maxContribution && (
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Maximum buy (CORE) *
          </label>
          <input
            type="text"
            value={formData.maxBuy}
            onChange={(e) => handleInputChange('maxBuy', e.target.value)}
            placeholder="Enter maximum buy"
            className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
      )}

      <div>
        <label className="block text-sm text-gray-400 mb-2">
          Liquidity (%) *
        </label>
        <input
          type="text"
          value={formData.liquidity}
          onChange={(e) => handleInputChange('liquidity', e.target.value)}
          placeholder="Enter liquidity percentage"
          className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Start Time (Local) *</label>
          <input
            type="datetime-local"
            value={formData.startTime}
            onChange={(e) => handleInputChange('startTime', e.target.value)}
            className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">End Time (Local) *</label>
          <input
            type="datetime-local"
            value={formData.endTime}
            onChange={(e) => handleInputChange('endTime', e.target.value)}
            className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2">
          Liquidity lockup (days) *
        </label>
        <input
          type="number"
          value={formData.liquidityLockupDays}
          onChange={(e) => handleInputChange('liquidityLockupDays', e.target.value)}
          placeholder="Enter Liquidity lockup days"
          className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm text-gray-400 mb-2">
          Logo URL *
        </label>
        <input
          type="text"
          value={formData.logoUrl}
          onChange={(e) => handleInputChange('logoUrl', e.target.value)}
          placeholder="Enter logo URL"
          className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        <p className="text-xs text-gray-500 mt-1">URL must end with a supported image extension png, jpg, jpeg, or gif.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Website *</label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => handleInputChange('website', e.target.value)}
            placeholder="Enter website URL"
            className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Facebook</label>
          <input
            type="url"
            value={formData.facebook}
            onChange={(e) => handleInputChange('facebook', e.target.value)}
            placeholder="Enter Facebook URL"
            className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Twitter</label>
          <input
            type="url"
            value={formData.twitter}
            onChange={(e) => handleInputChange('twitter', e.target.value)}
            placeholder="Enter Twitter URL"
            className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Github</label>
          <input
            type="url"
            value={formData.github}
            onChange={(e) => handleInputChange('github', e.target.value)}
            placeholder="Enter Github URL"
            className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Telegram</label>
          <input
            type="url"
            value={formData.telegram}
            onChange={(e) => handleInputChange('telegram', e.target.value)}
            placeholder="Enter Telegram URL"
            className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Instagram</label>
          <input
            type="url"
            value={formData.instagram}
            onChange={(e) => handleInputChange('instagram', e.target.value)}
            placeholder="Enter Instagram URL"
            className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Discord</label>
          <input
            type="url"
            value={formData.discord}
            onChange={(e) => handleInputChange('discord', e.target.value)}
            placeholder="Enter Discord URL"
            className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Reddit</label>
          <input
            type="url"
            value={formData.reddit}
            onChange={(e) => handleInputChange('reddit', e.target.value)}
            placeholder="Enter Reddit URL"
            className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2">Youtube</label>
        <input
          type="url"
          value={formData.youtube}
          onChange={(e) => handleInputChange('youtube', e.target.value)}
          placeholder="Enter Youtube URL"
          className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Enter description"
          rows={4}
          className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white mb-4">PLEASE VERIFY THE DETAILS ENTERED:-</h2>
      <div className="bg-gray-800 rounded-lg p-6 space-y-3">
        {Object.entries(formData).map(([key, value]) => (
          <div key={key} className="flex items-start gap-2">
            <span className="text-gray-400 min-w-[180px] capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
            <span className="text-white break-all">{typeof value === 'boolean' ? value.toString() : value || '-'}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return null;
    }
  };

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    // Implement submit logic
    console.log('Submitting fairlaunch:', formData);
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-xl sm:text-2xl font-bold text-white">Create Fairlaunch</h1>
          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">Coming Soon</span>
        </div>
        <p className="text-sm sm:text-base text-gray-400">Launch your token with our fairlaunch platform</p>
      </div>

      <div className="bg-gray-900/30 backdrop-blur-md rounded-lg border border-gray-800 p-6">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex items-center ${step < 4 ? 'flex-1' : ''}`}
              >
                <div className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  step === currentStep
                    ? 'border-yellow-500 bg-yellow-500/20 text-yellow-500'
                    : step < currentStep
                    ? 'border-green-500 bg-green-500 text-white'
                    : 'border-gray-700 bg-gray-800 text-gray-500'
                }`}>
                  {step < currentStep ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span className="text-sm">{step}</span>
                  )}
                </div>
                {step < 4 && (
                  <div className={`flex-1 h-[2px] ${
                    step < currentStep ? 'bg-green-500' : 'bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-2 text-sm text-yellow-500">
            Step {currentStep} of 4
          </div>
        </div>

        {renderStepContent()}

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              currentStep === 1
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            Back
          </button>
          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              className="flex-1 py-2.5 bg-yellow-500 text-black rounded-lg text-sm font-medium hover:bg-yellow-400 transition-colors"
            >
              Next
            </button>
          ) : (
            <>
              <button
                onClick={() => {}}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
              >
                Approve
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-2.5 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                Submit
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateFairlaunch;