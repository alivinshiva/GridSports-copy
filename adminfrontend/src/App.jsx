import { useState, useEffect } from "react";
import "./index.css";

function App() {
  const [activeTab, setActiveTab] = useState("create-weekend");
  const [races, setRaces] = useState([]);
  const [weekends, setWeekends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Weekend Form State
  const [weekendForm, setWeekendForm] = useState({
    name: "Australian Grand Prix",
    slug: "australian-grand-prix",
    startDate: "",
    endDate: "",
    round: "Round 01",
    image: null
  });

  // Race Form State
  const [raceForm, setRaceForm] = useState({
    name: "Melbourne Weekend",
    round: "Round 01",
    weekendId: "",
    practiceDate: "",
    qualifyingDate: "",
    raceDate: "",
    slug: "melbourne-weekend-r01",
    image: null
  });

  // Challenge Form State
  const [challengeForm, setChallengeForm] = useState({
    challengeId: "AUS_R01_C01",
    raceId: "",
    title: "",
    description: "",
    rules: "",
    type: "Photo",
    openTime: "",
    closeTime: "",
    raterTags: "",
    shareHook: "",
    image: null
  });

  useEffect(() => {
    fetchWeekends();
    fetchRaces();
  }, []);

  const fetchWeekends = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/admin/weekends");
      const data = await response.json();
      if (data.success) {
        setWeekends(data.data);
      }
    } catch (error) {
      console.error("Error fetching weekends", error);
    }
  };

  const fetchRaces = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/admin/races");
      const data = await response.json();
      if (data.success) {
        setRaces(data.data);
      } else {
        setMessage("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error fetching races", error);
      setMessage("Error fetching races");
    }
  };

  const handleCreateWeekend = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("name", weekendForm.name);
      formData.append("slug", weekendForm.slug);
      formData.append("startDate", weekendForm.startDate);
      formData.append("endDate", weekendForm.endDate);
      formData.append("round", weekendForm.round);
      formData.append("image", weekendForm.image);

      const response = await fetch("http://localhost:8000/api/v1/admin/create-weekend", {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        setMessage("Weekend Created Successfully!");
        fetchWeekends();
      } else {
        setMessage("Error: " + data.message);
      }
    } catch (error) {
      setMessage("Network Error");
    }
    setLoading(false);
  };

  const handleCreateRace = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("name", raceForm.name);
      formData.append("round", raceForm.round);
      formData.append("weekendId", raceForm.weekendId);
      formData.append("slug", raceForm.slug);
      formData.append("dates", JSON.stringify({
        practice: raceForm.practiceDate,
        qualifying: raceForm.qualifyingDate,
        race: raceForm.raceDate
      }));
      formData.append("image", raceForm.image);

      const response = await fetch("http://localhost:8000/api/v1/admin/create-race", {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        setMessage("Race Created Successfully!");
        fetchRaces();
      } else {
        setMessage("Error: " + data.message);
      }
    } catch (error) {
      setMessage("Network Error");
    }
    setLoading(false);
  };

  const handleCreateChallenge = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("challengeId", challengeForm.challengeId);
      formData.append("raceId", challengeForm.raceId);
      formData.append("title", challengeForm.title);
      formData.append("description", challengeForm.description);
      formData.append("rules", challengeForm.rules);
      formData.append("type", challengeForm.type);
      formData.append("openTime", challengeForm.openTime);
      formData.append("closeTime", challengeForm.closeTime);
      formData.append("raterTags", challengeForm.raterTags);
      formData.append("shareHook", challengeForm.shareHook);
      formData.append("image", challengeForm.image);

      const response = await fetch("http://localhost:8000/api/v1/admin/create-challenge", {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        setMessage("Challenge Created Successfully!");
      } else {
        setMessage("Error: " + data.message);
      }
    } catch (error) {
      setMessage("Network Error");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-red-600">GridSports Admin Control Center</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-700">
          <button
            onClick={() => setActiveTab("create-weekend")}
            className={`pb-2 px-4 font-medium ${activeTab === "create-weekend" ? "border-b-2 border-red-600 text-red-600" : "text-gray-500 hover:text-gray-300"}`}
          >
            Create Weekend
          </button>
          <button
            onClick={() => setActiveTab("create-race")}
            className={`pb-2 px-4 font-medium ${activeTab === "create-race" ? "border-b-2 border-red-600 text-red-600" : "text-gray-500 hover:text-gray-300"}`}
          >
            Create Race
          </button>
          <button
            onClick={() => setActiveTab("create-challenge")}
            className={`pb-2 px-4 font-medium ${activeTab === "create-challenge" ? "border-b-2 border-red-600 text-red-600" : "text-gray-500 hover:text-gray-300"}`}
          >
            Create Challenge
          </button>
          <button
            onClick={() => setActiveTab("view-races")}
            className={`pb-2 px-4 font-medium ${activeTab === "view-races" ? "border-b-2 border-red-600 text-red-600" : "text-gray-500 hover:text-gray-300"}`}
          >
            View Races
          </button>
        </div>

        {message && <div className="mb-4 p-4 bg-blue-900/50 text-blue-200 rounded border border-blue-800">{message}</div>}

        {/* Create Weekend Form */}
        {activeTab === "create-weekend" && (
          <form onSubmit={handleCreateWeekend} className="space-y-4 bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h2 className="text-xl font-bold">Create New Weekend</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Weekend Name (e.g. Australian Grand Prix)"
                value={weekendForm.name}
                onChange={e => setWeekendForm({ ...weekendForm, name: e.target.value })}
                className="p-3 rounded border bg-black border-gray-700 focus:border-red-600 outline-none"
                required
              />
              <input
                type="text"
                placeholder="Slug (e.g. australian-grand-prix)"
                value={weekendForm.slug}
                onChange={e => setWeekendForm({ ...weekendForm, slug: e.target.value })}
                className="p-3 rounded border bg-black border-gray-700 focus:border-red-600 outline-none"
                required
              />
              <input
                type="text"
                placeholder="Round (e.g. Round 01)"
                value={weekendForm.round}
                onChange={e => setWeekendForm({ ...weekendForm, round: e.target.value })}
                className="p-3 rounded border bg-black border-gray-700 focus:border-red-600 outline-none"
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={e => setWeekendForm({ ...weekendForm, image: e.target.files[0] })}
                className="p-3 rounded border bg-black border-gray-700 focus:border-red-600 outline-none"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Start Date</label>
                <input
                  type="date"
                  value={weekendForm.startDate}
                  onChange={e => setWeekendForm({ ...weekendForm, startDate: e.target.value })}
                  className="w-full p-3 rounded border bg-black border-gray-700 focus:border-red-600 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">End Date</label>
                <input
                  type="date"
                  value={weekendForm.endDate}
                  onChange={e => setWeekendForm({ ...weekendForm, endDate: e.target.value })}
                  className="w-full p-3 rounded border bg-black border-gray-700 focus:border-red-600 outline-none"
                  required
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-700 transition-colors">
              {loading ? "Creating..." : "Create Weekend"}
            </button>
          </form>
        )}

        {/* Create Race Form */}
        {activeTab === "create-race" && (
          <form onSubmit={handleCreateRace} className="space-y-4 bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h2 className="text-xl font-bold">Create New Race</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={raceForm.weekendId}
                onChange={e => setRaceForm({ ...raceForm, weekendId: e.target.value })}
                className="p-3 rounded border bg-black border-gray-700 focus:border-red-600 outline-none"
                required
              >
                <option value="">Select Weekend</option>
                {weekends.map(weekend => (
                  <option key={weekend._id} value={weekend._id}>{weekend.name} ({weekend.round})</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Race Name (e.g. Melbourne Weekend)"
                value={raceForm.name}
                onChange={e => setRaceForm({ ...raceForm, name: e.target.value })}
                className="p-3 rounded border bg-black border-gray-700 focus:border-red-600 outline-none"
                required
              />
              <input
                type="text"
                placeholder="Round (e.g. Round 01)"
                value={raceForm.round}
                onChange={e => setRaceForm({ ...raceForm, round: e.target.value })}
                className="p-3 rounded border bg-black border-gray-700 focus:border-red-600 outline-none"
                required
              />
              <input
                type="text"
                placeholder="Slug (e.g. melbourne-weekend-r01)"
                value={raceForm.slug}
                onChange={e => setRaceForm({ ...raceForm, slug: e.target.value })}
                className="p-3 rounded border bg-black border-gray-700 focus:border-red-600 outline-none"
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={e => setRaceForm({ ...raceForm, image: e.target.files[0] })}
                className="p-3 rounded border bg-black border-gray-700 focus:border-red-600 outline-none"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Practice Date</label>
                <input
                  type="datetime-local"
                  value={raceForm.practiceDate}
                  onChange={e => setRaceForm({ ...raceForm, practiceDate: e.target.value })}
                  className="w-full p-3 rounded border bg-black border-gray-700 focus:border-red-600 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Qualifying Date</label>
                <input
                  type="datetime-local"
                  value={raceForm.qualifyingDate}
                  onChange={e => setRaceForm({ ...raceForm, qualifyingDate: e.target.value })}
                  className="w-full p-3 rounded border bg-black border-gray-700 focus:border-red-600 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Race Date</label>
                <input
                  type="datetime-local"
                  value={raceForm.raceDate}
                  onChange={e => setRaceForm({ ...raceForm, raceDate: e.target.value })}
                  className="w-full p-3 rounded border bg-black border-gray-700 focus:border-red-600 outline-none"
                  required
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-700 transition-colors">
              {loading ? "Creating..." : "Create Race"}
            </button>
          </form>
        )}

        {/* Create Challenge Form */}
        {activeTab === "create-challenge" && (
          <form onSubmit={handleCreateChallenge} className="space-y-4 bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h2 className="text-xl font-bold">Create New Challenge</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={challengeForm.raceId}
                onChange={e => setChallengeForm({ ...challengeForm, raceId: e.target.value })}
                className="p-3 rounded border bg-black border-gray-700 focus:border-red-600 outline-none"
                required
              >
                <option value="">Select Race</option>
                {races.map(race => (
                  <option key={race._id} value={race._id}>{race.name} ({race.round})</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Challenge ID (e.g. AUS_R01_C01)"
                value={challengeForm.challengeId}
                onChange={e => setChallengeForm({ ...challengeForm, challengeId: e.target.value })}
                className="p-3 rounded border bg-black border-gray-700 focus:border-red-600 outline-none"
                required
              />
              <input
                type="text"
                placeholder="Title (e.g. Melbourne Vibe Poster)"
                value={challengeForm.title}
                onChange={e => setChallengeForm({ ...challengeForm, title: e.target.value })}
                className="p-3 rounded border bg-black border-gray-700 focus:border-red-600 outline-none"
                required
              />
              <select
                value={challengeForm.type}
                onChange={e => setChallengeForm({ ...challengeForm, type: e.target.value })}
                className="p-3 rounded border bg-black border-gray-700 focus:border-red-600 outline-none"
                required
              >
                <option value="Photo">Photo</option>
                <option value="Video">Video</option>
                <option value="Mixed">Mixed</option>
                <option value="Photo + text">Photo + text</option>
                <option value="Video (max 8s)">Video (max 8s)</option>
                <option value="Video (20–30s)">Video (20–30s)</option>
                <option value="Photo template (Top 10) or 10s video">Photo template (Top 10) or 10s video</option>
                <option value="Video (7–12s)">Video (7–12s)</option>
                <option value="Video (12–18s)">Video (12–18s)</option>
              </select>
            </div>
            <textarea
              placeholder="Description / Prompt"
              value={challengeForm.description}
              onChange={e => setChallengeForm({ ...challengeForm, description: e.target.value })}
              className="w-full p-3 rounded border bg-black border-gray-700 focus:border-red-600 outline-none h-24"
              required
            />
            <textarea
              placeholder="Rules & Timing Instructions"
              value={challengeForm.rules}
              onChange={e => setChallengeForm({ ...challengeForm, rules: e.target.value })}
              className="w-full p-3 rounded border bg-black border-gray-700 focus:border-red-600 outline-none h-24"
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Open Time</label>
                <input
                  type="datetime-local"
                  value={challengeForm.openTime}
                  onChange={e => setChallengeForm({ ...challengeForm, openTime: e.target.value })}
                  className="w-full p-3 rounded border bg-black border-gray-700 focus:border-red-600 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Close Time</label>
                <input
                  type="datetime-local"
                  value={challengeForm.closeTime}
                  onChange={e => setChallengeForm({ ...challengeForm, closeTime: e.target.value })}
                  className="w-full p-3 rounded border bg-black border-gray-700 focus:border-red-600 outline-none"
                  required
                />
              </div>
            </div>
            <input
              type="text"
              placeholder="Rater Tags (comma separated, e.g. Vibe, Authentic)"
              value={challengeForm.raterTags}
              onChange={e => setChallengeForm({ ...challengeForm, raterTags: e.target.value })}
              className="w-full p-3 rounded border bg-black border-gray-700 focus:border-red-600 outline-none"
              required
            />
            <input
              type="text"
              placeholder="Share Hook"
              value={challengeForm.shareHook}
              onChange={e => setChallengeForm({ ...challengeForm, shareHook: e.target.value })}
              className="w-full p-3 rounded border bg-black border-gray-700 focus:border-red-600 outline-none"
            />
            <input
              type="file"
              accept="image/*"
              onChange={e => setChallengeForm({ ...challengeForm, image: e.target.files[0] })}
              className="w-full p-3 rounded border bg-black border-gray-700 focus:border-red-600 outline-none"
              required
            />
            <button type="submit" disabled={loading} className="px-6 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-700 transition-colors">
              {loading ? "Creating..." : "Create Challenge"}
            </button>
          </form>
        )}

        {/* View Races */}
        {activeTab === "view-races" && (
          <div className="space-y-4">
            {races && races.length > 0 ? (
              races.map(race => (
                <div key={race._id} className="bg-gray-900 p-4 rounded-xl border border-gray-800">
                  <h3 className="text-lg font-bold">{race.name} ({race.round})</h3>
                  <p className="text-sm text-gray-500">Slug: {race.slug}</p>
                  <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Practice:</span>
                      <p className="text-gray-300">{race.dates?.practice ? new Date(race.dates.practice).toLocaleString() : 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Qualifying:</span>
                      <p className="text-gray-300">{race.dates?.qualifying ? new Date(race.dates.qualifying).toLocaleString() : 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Race:</span>
                      <p className="text-gray-300">{race.dates?.race ? new Date(race.dates.race).toLocaleString() : 'N/A'}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No races found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
