import { useState } from "react";

import {
  Search,
  Camera,
  Upload,
  UserPlus,
} from "lucide-react";

import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

import CreateVisitorModal from "../components/visitors/CreateVisitorModal";

import mockVisitors from "../data/mockVisitors";

function CheckIn() {
  const [search, setSearch] = useState("");

  const [selectedVisitor, setSelectedVisitor] =
    useState(null);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const filteredVisitors =
    mockVisitors.filter((visitor) =>
      visitor.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  return (
    <div>

      {/* HEADER */}

      <div className="mb-6">

        <h1 className="text-3xl font-bold">
          Visitor Check-In
        </h1>

        <p className="text-gray-500 mt-1">
          Search existing visitor or create a new one
        </p>

      </div>

      <div className="grid grid-cols-3 gap-6">

        {/* LEFT SECTION */}

        <div className="col-span-2 space-y-6">

          {/* SEARCH VISITOR */}

          <Card>

            <div className="flex items-center justify-between mb-5">

              <div>

                <h2 className="text-xl font-semibold">
                  Search Visitor
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                  Find existing visitor for faster check-in
                </p>

              </div>

              <Button
                className="flex items-center gap-2"
                onClick={() =>
                  setIsModalOpen(true)
                }
              >
                <UserPlus size={18} />
                New Visitor
              </Button>

            </div>

            <div className="relative">

              <Search
                size={18}
                className="absolute left-3 top-3.5 text-gray-400"
              />

              <Input
                placeholder="Search by name or phone..."
                className="pl-10"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

            {/* SEARCH RESULTS */}

            {search && (
              <div className="mt-5 space-y-3">

                {filteredVisitors.length > 0 ? (
                  filteredVisitors.map((visitor) => (
                    <div
                      key={visitor.id}
                      onClick={() =>
                        setSelectedVisitor(visitor)
                      }
                      className="border rounded-2xl p-4 cursor-pointer hover:border-blue-500 transition"
                    >

                      <div className="flex items-center justify-between">

                        <div>

                          <h3 className="font-semibold">
                            {visitor.name}
                          </h3>

                          <p className="text-sm text-gray-500">
                            {visitor.company}
                          </p>

                        </div>

                        <div className="text-sm text-gray-400">
                          {visitor.phone}
                        </div>

                      </div>

                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">

                    No visitor found

                    <div className="mt-4">
                      <Button
                        onClick={() =>
                          setIsModalOpen(true)
                        }
                      >
                        Create New Visitor
                      </Button>
                    </div>

                  </div>
                )}

              </div>
            )}

          </Card>

          {/* VISIT FORM */}

          <Card>

            <h2 className="text-xl font-semibold mb-6">
              Visit Information
            </h2>

            <div className="grid grid-cols-2 gap-5">

              <Input
                label="Purpose of Visit"
                placeholder="Meeting / Interview / Delivery"
              />

              <Input
                label="Employee to Meet"
                placeholder="Enter employee name"
              />

              <Input
                label="Department"
                placeholder="Enter department"
              />

              <Input
                label="Expected Duration"
                placeholder="1 Hour"
              />

            </div>

            {/* NOTES */}

            <div className="mt-5">

              <label className="text-sm font-medium text-gray-700">
                Visit Notes
              </label>

              <textarea
                rows={4}
                placeholder="Additional visit notes..."
                className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />

            </div>

            <div className="flex justify-end gap-4 mt-8">

              <Button className="bg-gray-300 hover:bg-gray-400 text-black">
                Reset
              </Button>

              <Button>
                Check In Visitor
              </Button>

            </div>

          </Card>

        </div>

        {/* RIGHT SECTION */}

        <div className="space-y-6">

          {/* SELECTED VISITOR */}

          <Card>

            <h2 className="text-xl font-semibold mb-5">
              Selected Visitor
            </h2>

            {selectedVisitor ? (
              <div>

                <div className="w-24 h-24 rounded-full bg-gray-300 mx-auto" />

                <div className="text-center mt-4">

                  <h3 className="text-xl font-bold">
                    {selectedVisitor.name}
                  </h3>

                  <p className="text-gray-500">
                    {selectedVisitor.company}
                  </p>

                </div>

                <div className="mt-6 space-y-4 text-sm">

                  <div className="flex justify-between">

                    <span className="text-gray-500">
                      Phone
                    </span>

                    <span>
                      {selectedVisitor.phone}
                    </span>

                  </div>

                  <div className="flex justify-between">

                    <span className="text-gray-500">
                      Email
                    </span>

                    <span>
                      {selectedVisitor.email}
                    </span>

                  </div>

                </div>

              </div>
            ) : (
              <div className="h-52 flex items-center justify-center text-gray-400">

                No visitor selected

              </div>
            )}

          </Card>

          {/* PHOTO */}

          <Card>

            <h2 className="text-xl font-semibold mb-5">
              Visitor Photo
            </h2>

            <div className="border-2 border-dashed border-gray-300 rounded-2xl h-60 flex flex-col items-center justify-center text-gray-500">

              <Camera size={45} />

              <p className="mt-4">
                Capture or Upload Photo
              </p>

              <Button className="mt-5 flex items-center gap-2">

                <Upload size={18} />

                Upload Photo

              </Button>

            </div>

          </Card>

        </div>

      </div>

      {/* NEW VISITOR MODAL */}

      <CreateVisitorModal
        isOpen={isModalOpen}
        onClose={() =>
          setIsModalOpen(false)
        }
      />

    </div>
  );
}

export default CheckIn;