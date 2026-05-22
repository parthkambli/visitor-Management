const mockVisits = [
  {
    id: 1,

    visitorId: 1,

    purpose: "Business Meeting",
    host: "Amit Patel",

    status: "Checked In",

    checkIn: "22 May 2026 - 10:45 AM",
    checkOut: "--",

    location: "Main Office",

    notes:
      "Quarterly business discussion.",
  },

  {
    id: 2,

    visitorId: 2,

    purpose: "Interview",
    host: "Neha Shah",

    status: "Checked Out",

    checkIn: "22 May 2026 - 09:30 AM",
    checkOut: "22 May 2026 - 11:15 AM",

    location: "HR Office",

    notes:
      "Frontend developer interview.",
  },

  {
    id: 3,

    visitorId: 1,

    purpose: "Project Discussion",
    host: "Raj Mehta",

    status: "Checked Out",

    checkIn: "18 May 2026 - 02:00 PM",
    checkOut: "18 May 2026 - 03:20 PM",

    location: "Conference Room",

    notes:
      "Discussion about enterprise project.",
  },
];

export default mockVisits;