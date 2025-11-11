// src/App.tsx
import React, { useState, useEffect } from "react";
import { ApolloClient, InMemoryCache, HttpLink, gql } from "@apollo/client";
import { ApolloProvider, useQuery } from "@apollo/client/react";

// ------------------ Apollo Client ------------------
const client = new ApolloClient({
  link: new HttpLink({ uri: "http://localhost:4000/" }),
  cache: new InMemoryCache(),
});

// ------------------ GraphQL Queries ------------------
const GET_STATES = gql`
  query {
    states {
      id
      name
    }
  }
`;

const GET_COUNTIES_BY_STATE = gql`
  query CountiesByState($state: String!) {
    countiesByState(state: $state) {
      id
      name
      towns {
        id
        name
      }
    }
  }
`;

const GET_RESOURCES = gql`
  query Resources($county: String, $city: String, $serviceType: String) {
    resources(county: $county, city: $city, serviceType: $serviceType) {
      id
      name
      serviceType
      county
      city
      address
      phone
      email
      website
      eligibility
      appointmentRequired
      hours
      description
      sourceUrl
    }
  }
`;

// ------------------ React Components ------------------
const ResourcesApp: React.FC = () => {
  const [selectedState, setSelectedState] = useState("New Jersey");
  const [county, setCounty] = useState<string | null>(null);
  const [town, setTown] = useState<string | null>(null);
  const [serviceType, setServiceType] = useState<string | null>(null);

  const { data: statesData } = useQuery(GET_STATES);
  const states = statesData?.states || [];

  const { data: countiesData, refetch: refetchCounties } = useQuery(
    GET_COUNTIES_BY_STATE,
    { variables: { state: selectedState } }
  );
  const counties = countiesData?.countiesByState || [];

  const { data: resourcesData, refetch: refetchResources } = useQuery(
    GET_RESOURCES,
    { variables: { county, city: town, serviceType } }
  );
  const resources = resourcesData?.resources || [];

  useEffect(() => {
    setCounty(null);
    setTown(null);
    refetchCounties({ state: selectedState });
    refetchResources({ county: null, city: null, serviceType });
  }, [selectedState]);

  useEffect(() => {
    setTown(null);
    refetchResources({ county, city: null, serviceType });
  }, [county]);

  useEffect(() => {
    refetchResources({ county, city: town, serviceType });
  }, [serviceType]);

  // ------------------ Render ------------------
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Community Resources</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          {/* State */}
          <div>
            <label className="block text-sm font-medium mb-1">State</label>
            <select
              className="bg-gray-800 border border-gray-700 text-gray-100 rounded p-2 w-48"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
            >
              {states.map((s: any) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* County */}
          <div>
            <label className="block text-sm font-medium mb-1">County</label>
            <select
              className="bg-gray-800 border border-gray-700 text-gray-100 rounded p-2 w-48"
              value={county || ""}
              onChange={(e) => setCounty(e.target.value || null)}
            >
              <option value="">All</option>
              {counties?.map((c: any) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Town */}
          {county && (
            <div>
              <label className="block text-sm font-medium mb-1">Town</label>
              <select
                className="bg-gray-800 border border-gray-700 text-gray-100 rounded p-2 w-48"
                value={town || ""}
                onChange={(e) => setTown(e.target.value || null)}
              >
                <option value="">All</option>
                {counties
                  .find((c: any) => c.name === county)
                  ?.towns.map((t: any) => (
                    <option key={t.id} value={t.name}>
                      {t.name}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* Service Type */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Service Type
            </label>
            <select
              className="bg-gray-800 border border-gray-700 text-gray-100 rounded p-2 w-48"
              value={serviceType || ""}
              onChange={(e) => setServiceType(e.target.value || null)}
            >
              <option value="">All</option>
              <option value="Shelter">Shelter</option>
              <option value="Food Pantry">Food Pantry</option>
              <option value="Health Clinic">Health Clinic</option>
              <option value="Social Services">Social Services</option>
              <option value="Meals on Wheels">Meals on Wheels</option>
            </select>
          </div>
        </div>

        {/* Resource Table */}
        <div className="overflow-x-auto bg-gray-800 rounded shadow">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium">Name</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Service</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Address</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Town/County</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Phone</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Website</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {resources.map((r: any) => (
                <tr key={r.id} className="hover:bg-gray-700">
                  <td className="px-4 py-2">{r.name}</td>
                  <td className="px-4 py-2">{r.serviceType}</td>
                  <td className="px-4 py-2">{r.address}</td>
                  <td className="px-4 py-2">
                    {r.city}, {r.county}
                  </td>
                  <td className="px-4 py-2">{r.phone}</td>
                  <td className="px-4 py-2">
                    {r.website && (
                      <a
                        href={r.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 underline"
                      >
                        Link
                      </a>
                    )}
                  </td>
                </tr>
              ))}
              {resources.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-4 text-center text-gray-400"
                  >
                    No resources found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ------------------ App Wrapper ------------------
const App: React.FC = () => (
  <ApolloProvider client={client}>
    <ResourcesApp />
  </ApolloProvider>
);

export default App;