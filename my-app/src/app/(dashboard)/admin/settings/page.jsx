import ChangePassword from "@/components/dashboard/ChangePassword";
export default function SettingsPage() {
  return (
    <div className="main-page">
      <div className="main-header">
        <div className="main-header-text">
          <h2 className="main-title">Settings</h2>
          <p className="main-subtitle">Configure system preferences</p>
        </div>
          </div>
          <ChangePassword />
    </div>
  );
}
