import React, { useState } from 'react';
import { Info, Calendar, X, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import DatePicker from './DatePicker';

interface StepProps {
  number: number;
  title: string;
  active: boolean;
  completed: boolean;
}

const Step: React.FC<StepProps> = ({ number, title, active, completed }) => (
  <div className="flex-1 relative">
    <div className="flex items-center">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
        completed ? 'bg-green-500' : active ? 'bg-yellow-500' : 'bg-gray-700'
      }`}>
        {completed ? (
          <Check className="w-5 h-5 text-white" />
        ) : (
          <span className="text-white font-medium">{number}</span>
        )}
      </div>
      <div className={`h-1 flex-1 ${active || completed ? 'bg-yellow-500' : 'bg-gray-700'}`} />
    </div>
    <span className={`absolute top-10 left-0 text-sm ${active ? 'text-yellow-500' : 'text-gray-400'}`}>
      {title}
    </span>
  </div>
);

const CreateStaking: React.FC = () => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [stakedToken, setStakedToken] = useState('');
  const [rewardToken, setRewardToken] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [rewardPerBlock, setRewardPerBlock] = useState('');
  const [poolLimit, setPoolLimit] = useState('');
  const [userLimit, setUserLimit] = useState(false);
  const [userLimitDate, setUserLimitDate] = useState<Date | null>(null);
  const [payByToken, setPayByToken] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleCalculate = () => {
    // Implement calculation logic
  };

  const handleCreateToken = () => {
    // Implement token creation logic
  };

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleCreateStaking = () => {
    // Implement staking creation logic
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-xl sm:text-2xl font-bold text-white">{t('menu.staking.create')}</h1>
          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">Coming Soon</span>
        </div>
        <p className="text-sm sm:text-base text-gray-400">Create a new staking pool for your token</p>
      </div>

      <div className="bg-gray-900/30 backdrop-blur-md rounded-lg border border-gray-800 p-6">
        {/* Progress Steps */}
        <div className="mb-16">
          <div className="flex gap-4">
            <Step
              number={1}
              title="Blockchain"
              active={currentStep === 1}
              completed={currentStep > 1}
            />
            <Step
              number={2}
              title="Staking Initialization"
              active={currentStep === 2}
              completed={currentStep > 2}
            />
            <Step
              number={3}
              title="Confirmation"
              active={currentStep === 3}
              completed={currentStep > 3}
            />
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Staked Token */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Staked Token *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={stakedToken}
                  onChange={(e) => setStakedToken(e.target.value)}
                  placeholder="Enter token address"
                  className="flex-1 bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <button
                  onClick={handleCreateToken}
                  className="px-4 py-2 bg-yellow-500 text-black rounded-lg text-sm font-medium hover:bg-yellow-400 transition-colors"
                >
                  Create Token
                </button>
              </div>
            </div>

            {/* Reward Token */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Reward Token *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={rewardToken}
                  onChange={(e) => setRewardToken(e.target.value)}
                  placeholder="Enter token address"
                  className="flex-1 bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <button
                  onClick={handleCreateToken}
                  className="px-4 py-2 bg-yellow-500 text-black rounded-lg text-sm font-medium hover:bg-yellow-400 transition-colors"
                >
                  Create Token
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Start Date */}
            <DatePicker
              label="Start Date of Reward"
              value={startDate}
              onChange={setStartDate}
              minDate={new Date()}
              required
            />

            {/* End Date */}
            <DatePicker
              label="End Date of Reward"
              value={endDate}
              onChange={setEndDate}
              minDate={startDate || new Date()}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Reward per Block */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Reward per Block *
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={rewardPerBlock}
                  onChange={(e) => setRewardPerBlock(e.target.value)}
                  placeholder="0"
                  className="flex-1 bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <button
                  onClick={handleCalculate}
                  className="px-4 py-2 bg-yellow-500 text-black rounded-lg text-sm font-medium hover:bg-yellow-400 transition-colors"
                >
                  Calculate
                </button>
              </div>
            </div>

            {/* Pool Limit */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Pool Limit per User *
              </label>
              <input
                type="number"
                value={poolLimit}
                onChange={(e) => setPoolLimit(e.target.value)}
                placeholder="0"
                className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                If set to 0, there is no limit to the amount of tokens a user can deposit.
              </p>
            </div>
          </div>

          {/* User Limit Date */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={userLimit}
                  onChange={(e) => setUserLimit(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-yellow-500"></div>
              </div>
              <span className="text-sm text-gray-400">
                Set the deadline for new users. If left inactive, there is no user limit.
              </span>
            </div>
            {userLimit && (
              <DatePicker
                label="User Limit Date"
                value={userLimitDate}
                onChange={setUserLimitDate}
                minDate={startDate || new Date()}
                maxDate={endDate || undefined}
              />
            )}
            <p className="mt-1 text-xs text-gray-500">
              Set the deadline for new users, between the start date and the end date of the staking.
            </p>
          </div>

          {/* Pay by Token */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="checkbox"
                checked={payByToken}
                onChange={(e) => setPayByToken(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-yellow-500"></div>
            </div>
            <span className="text-sm text-gray-400">Pay by Token</span>
          </div>

          {/* Info Messages */}
          <div className="space-y-4">
            <div className="bg-green-900/20 border border-green-900 rounded-lg p-4 flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-400">
                It only takes 10 seconds to successfully initiate the staking process, with no need for manual intervention. After successful confirmation, stakes are automatically assigned to the creator/owner address. The staking system has no copyright restrictions, it is automatically deployed on the main network, and verified.
              </p>
              <button className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-900 rounded-lg p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-400">
                All tokens have been reviewed by the security audit company and have successfully passed the contract security audit.
              </p>
              <button className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-1"
            />
            <p className="text-sm text-gray-400">
              I agree to STAKING TOOL security policies. To review the security policies, please visit the following link:{' '}
              <a href="#" className="text-yellow-500 hover:text-yellow-400">
                STAKING TOOL Security Policies
              </a>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleBack}
              className="flex-1 py-2.5 bg-gray-700 text-white rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors"
            >
              Back
            </button>
            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                className="flex-1 py-2.5 bg-gray-700 text-white rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleCreateStaking}
                className="flex-1 py-2.5 bg-yellow-500 text-black rounded-lg text-sm font-medium hover:bg-yellow-400 transition-colors"
              >
                Create Staking
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateStaking;