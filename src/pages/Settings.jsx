import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

function Settings() {
  return (
    <div>

      {/* PAGE HEADER */}

      <div className="mb-6">

        <h1 className="text-3xl font-bold">
          Settings
        </h1>

        <p className="text-gray-500 mt-1">
          Configure organization, pass settings, appearance and backups
        </p>

      </div>

      <div className="grid grid-cols-12 gap-6">

        {/* LEFT COLUMN */}

        <div className="col-span-8 space-y-6">

          {/* ORGANIZATION */}

          <Card>

            <h2 className="text-xl font-semibold mb-6">
              Organization Settings
            </h2>

            <div className="space-y-5">

              <Input
                label="Organization Name"
                placeholder="Enter organization name"
              />

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Organization Logo
                </label>

                <div className="flex items-center gap-6">

                  <div className="w-28 h-28 rounded-2xl border bg-gray-100 flex items-center justify-center text-gray-400">
                    Logo
                  </div>

                  <div className="flex flex-col gap-3">

                    <Button>
                      Choose Logo
                    </Button>

                    <Button className="bg-red-500 hover:bg-red-600">
                      Remove Logo
                    </Button>

                  </div>

                </div>

              </div>

            </div>

          </Card>

          {/* PASS SETTINGS */}

          <Card>

            <h2 className="text-xl font-semibold mb-6">
              Pass Settings
            </h2>

            <div className="grid grid-cols-2 gap-5">

              <Input
                label="Pass Prefix"
                placeholder="VIS"
              />

              <Input
                label="Starting Number"
                placeholder="0001"
              />

            </div>

            <div className="mt-5">

              <label className="flex items-center gap-3">

                <input
                  type="checkbox"
                  defaultChecked
                />

                <span>
                  Auto Increment Pass Number
                </span>

              </label>

            </div>

            <div className="mt-6 p-4 rounded-xl bg-gray-50 border">

              <p className="text-sm text-gray-500 mb-2">
                Pass Preview
              </p>

              <p className="text-2xl font-bold">
                VIS-0001
              </p>

            </div>

          </Card>

        </div>

        {/* RIGHT COLUMN */}

        <div className="col-span-4 space-y-6">

          {/* APPEARANCE */}

          <Card>

            <h2 className="text-xl font-semibold mb-6">
              Appearance
            </h2>

            <div className="space-y-5">

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Theme
                </label>

                <select className="w-full border rounded-xl px-4 py-3">

                  <option>
                    Light
                  </option>

                  <option>
                    Dark
                  </option>

                </select>

              </div>

              <Input
                label="Primary Color"
                type="color"
              />

              <Input
                label="Secondary Color"
                type="color"
              />

            </div>

          </Card>

          {/* DATA & BACKUP */}

          <Card>

            <h2 className="text-xl font-semibold mb-6">
              Data & Backup
            </h2>

            <div className="space-y-5">

              <label className="flex items-center gap-3">

                <input
                  type="checkbox"
                  defaultChecked
                />

                <span>
                  Enable Auto Backup
                </span>

              </label>

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Backup Frequency
                </label>

                <select className="w-full border rounded-xl px-4 py-3">

                  <option>
                    Daily
                  </option>

                  <option>
                    Weekly
                  </option>

                  <option>
                    Monthly
                  </option>

                </select>

              </div>

              <Input
                label="Backup Location"
                placeholder="C:\VisitorTracker\Backups"
              />

              <Button className="w-full">
                Browse Folder
              </Button>

              <Button className="w-full">
                Backup Database Now
              </Button>

            </div>

          </Card>

          {/* SYSTEM INFO */}

          <Card>

            <h2 className="text-xl font-semibold mb-6">
              System Information
            </h2>

            <div className="space-y-4 text-sm">

              <div className="flex justify-between">

                <span className="text-gray-500">
                  Database Status
                </span>

                <span className="font-medium text-green-600">
                  Connected
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-gray-500">
                  Database Size
                </span>

                <span>
                  2.3 MB
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-gray-500">
                  Version
                </span>

                <span>
                  1.0.0
                </span>

              </div>

            </div>

          </Card>

          {/* SAVE */}

          <Card>

            <Button className="w-full">
              Save Settings
            </Button>

          </Card>

        </div>

      </div>

    </div>
  );
}

export default Settings;