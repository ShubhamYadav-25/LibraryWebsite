import { useState } from 'react';
import { 
  Settings, 
  Save,
  Building,
  Bell,
  Clock,
  DollarSign,
  Shield,
  Mail,
  Database,
  Palette,
  Globe,
  Key,
  Users,
  BookOpen,
  Calendar,
  AlertCircle
} from 'lucide-react';

// Settings Section Component
const SettingsSection = ({ title, description, icon: Icon, children }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
    <div className="flex items-start space-x-4 mb-6">
      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
        <Icon className="w-6 h-6 text-purple-600" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
    {children}
  </div>
);

// Input Field Component
const InputField = ({ label, type = 'text', value, onChange, placeholder, required = false }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
    />
  </div>
);

// Toggle Switch Component
const ToggleSwitch = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between py-3">
    <div>
      <p className="text-left font-medium text-gray-900">{label}</p>
      {description && <p className="text-sm text-gray-600">{description}</p>}
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-purple-500' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

// Main Settings Page Component
const SettingsPage = () => {
  // Library Information State
  const [libraryName, setLibraryName] = useState('University Library');
  const [libraryEmail, setLibraryEmail] = useState('library@university.edu');
  const [libraryPhone, setLibraryPhone] = useState('+1 (555) 123-4567');
  const [libraryAddress, setLibraryAddress] = useState('123 Campus Drive, University City');

  // Loan Settings State
  const [defaultLoanPeriod, setDefaultLoanPeriod] = useState('14');
  const [maxRenewals, setMaxRenewals] = useState('1');
  const [maxBooksPerUser, setMaxBooksPerUser] = useState('5');
  const [lateFeePerDay, setLateFeePerDay] = useState('0.50');

  // Notification Settings State
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [overdueReminders, setOverdueReminders] = useState(true);
  const [dueReminders, setDueReminders] = useState(true);
  const [reservationAlerts, setReservationAlerts] = useState(true);

  // System Settings State
  const [autoBackup, setAutoBackup] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  const handleSave = () => {
    console.log('Settings saved');
    // Add save logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your library system configuration and preferences</p>
        </div>

        {/* Library Information */}
      <div className="mb-8 grid md:grid-cols-2 gap-6">
        <SettingsSection
          title="Library Information"
          description="Basic information about your library"
          icon={Building}
        >
          <div className="grid md:grid-cols-2 gap-6">
            <InputField
              label="Library Name"
              value={libraryName}
              onChange={(e) => setLibraryName(e.target.value)}
              placeholder="Enter library name"
              required
            />
            <InputField
              label="Email Address"
              type="email"
              value={libraryEmail}
              onChange={(e) => setLibraryEmail(e.target.value)}
              placeholder="library@example.com"
              required
            />
            <InputField
              label="Phone Number"
              type="tel"
              value={libraryPhone}
              onChange={(e) => setLibraryPhone(e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
            <InputField
              label="Website"
              type="url"
              placeholder="https://library.example.com"
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                value={libraryAddress}
                onChange={(e) => setLibraryAddress(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter complete address"
              />
            </div>
          </div>
        </SettingsSection>

        {/* Loan Settings */}
        <SettingsSection
          title="Loan Settings"
          description="Configure borrowing rules and policies"
          icon={BookOpen}
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Loan Period (days)
              </label>
              <input
                type="number"
                value={defaultLoanPeriod}
                onChange={(e) => setDefaultLoanPeriod(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Renewals
              </label>
              <input
                type="number"
                value={maxRenewals}
                onChange={(e) => setMaxRenewals(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Books Per User
              </label>
              <input
                type="number"
                value={maxBooksPerUser}
                onChange={(e) => setMaxBooksPerUser(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Late Fee Per Day ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={lateFeePerDay}
                onChange={(e) => setLateFeePerDay(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </SettingsSection>

        {/* Operating Hours */}
        <SettingsSection
          title="Operating Hours"
          description="Set your library's opening and closing times"
          icon={Clock}
        >
          <div className="space-y-4">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
              <div key={day} className="grid grid-cols-4 gap-4 items-center">
                <div className="font-medium text-gray-900">{day}</div>
                <input
                  type="time"
                  defaultValue="09:00"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <input
                  type="time"
                  defaultValue="17:00"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <div className="flex items-center">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-purple-500 rounded" />
                  <span className="ml-2 text-sm text-gray-600">Open</span>
                </div>
              </div>
            ))}
          </div>
        </SettingsSection>

        {/* Notification Settings */}
        <SettingsSection
          title="Notification Settings"
          description="Configure how users receive notifications"
          icon={Bell}
        >
          <div className="space-y-4">
            <ToggleSwitch
              label="Email Notifications"
              description="Send notifications via email"
              checked={emailNotifications}
              onChange={setEmailNotifications}
            />
            <ToggleSwitch
              label="SMS Notifications"
              description="Send notifications via SMS"
              checked={smsNotifications}
              onChange={setSmsNotifications}
            />
            <div className="border-t border-gray-200 pt-4 mt-4">
              <p className="font-medium text-gray-900 mb-3">Automatic Reminders</p>
              <div className="space-y-3">
                <ToggleSwitch
                  label="Overdue Reminders"
                  description="Send reminders for overdue books"
                  checked={overdueReminders}
                  onChange={setOverdueReminders}
                />
                <ToggleSwitch
                  label="Due Date Reminders"
                  description="Send reminders 3 days before due date"
                  checked={dueReminders}
                  onChange={setDueReminders}
                />
                <ToggleSwitch
                  label="Reservation Alerts"
                  description="Notify when reserved books become available"
                  checked={reservationAlerts}
                  onChange={setReservationAlerts}
                />
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Fine Settings */}
        <SettingsSection
          title="Fine Settings"
          description="Configure fines and penalties"
          icon={DollarSign}
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Late Fee Per Day ($)
              </label>
              <input
                type="number"
                step="0.01"
                defaultValue="0.50"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Fine Amount ($)
              </label>
              <input
                type="number"
                step="0.01"
                defaultValue="50.00"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lost Book Fee ($)
              </label>
              <input
                type="number"
                step="0.01"
                defaultValue="25.00"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Damaged Book Fee ($)
              </label>
              <input
                type="number"
                step="0.01"
                defaultValue="15.00"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </SettingsSection>

        {/* Security Settings */}
        <SettingsSection
          title="Security Settings"
          description="Manage security and access control"
          icon={Shield}
        >
          <div className="space-y-4">
            <ToggleSwitch
              label="Two-Factor Authentication"
              description="Require 2FA for admin accounts"
              checked={twoFactorAuth}
              onChange={setTwoFactorAuth}
            />
            <div className="pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                defaultValue="30"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password Expiry (days)
              </label>
              <input
                type="number"
                defaultValue="90"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </SettingsSection>

        {/* System Settings */}
        <SettingsSection
          title="System Settings"
          description="Advanced system configuration"
          icon={Database}
        >
          <div className="space-y-4">
            <ToggleSwitch
              label="Automatic Backup"
              description="Enable daily automatic database backups"
              checked={autoBackup}
              onChange={setAutoBackup}
            />
            <ToggleSwitch
              label="Maintenance Mode"
              description="Enable maintenance mode (users cannot access the system)"
              checked={maintenanceMode}
              onChange={setMaintenanceMode}
            />
            
            <div className="pt-4 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">Backup & Restore</h4>
              <div className="flex space-x-3">
                <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors">
                  Create Backup Now
                </button>
                <button className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition-colors">
                  Restore from Backup
                </button>
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Appearance Settings */}
        <SettingsSection
          title="Appearance"
          description="Customize the look and feel"
          icon={Palette}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option>Light</option>
                <option>Dark</option>
                <option>Auto</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Color
              </label>
              <div className="flex space-x-3">
                {['bg-purple-500', 'bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-orange-500', 'bg-pink-500'].map((color) => (
                  <button
                    key={color}
                    className={`w-10 h-10 ${color} rounded-lg border-2 border-transparent hover:border-gray-400 transition-colors`}
                  />
                ))}
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Save Button */}
        <div className="flex justify-end space-x-4 mt-8">
          <button className="bg-gray-100 px-6 py-3 border border-gray-250 hover:bg-gray-300 rounded-lg font-semibold transition-colors shadow-sm">
            Reset to Defaults
          </button>
          <button
            onClick={handleSave}
            className="px-8 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-colors flex items-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>Save Changes</span>
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;