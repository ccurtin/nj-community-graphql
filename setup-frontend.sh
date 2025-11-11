#!/bin/bash
# setup-frontend-vite.sh

set -e

FRONTEND_DIR="community-frontend"

echo "🚀 Creating Vite React + TypeScript frontend in $FRONTEND_DIR..."

# 1. Create Vite React TS app
npm create vite@latest $FRONTEND_DIR -- --template react-ts

cd $FRONTEND_DIR

# 2. Install Apollo Client + GraphQL
npm install @apollo/client graphql

# 3. Create directory structure
mkdir -p src/components src/graphql src/hooks

# 4. Create Apollo client file
cat > src/graphql/client.ts <<EOL
import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});
EOL

# 5. Create a sample hook for resources query
cat > src/hooks/useResources.ts <<EOL
import { gql, useQuery } from "@apollo/client";

export const GET_RESOURCES_BY_SERVICE_TYPE = gql\`
  query GetResourcesByServiceType(\$serviceType: String!) {
    resourcesByServiceType(serviceType: \$serviceType) {
      id
      name
      city
      county
      serviceType
      eligibility
      phone
      email
      address
      appointmentRequired
      website
      sourceUrl
      description
      hours
    }
  }
\`;

export function useResources(serviceType: string) {
  const { data, loading, error } = useQuery(GET_RESOURCES_BY_SERVICE_TYPE, {
    variables: { serviceType },
  });
  return { data, loading, error };
}
EOL

# 6. Replace App.tsx with basic example using dropdown
cat > src/App.tsx <<EOL
import React, { useState } from "react";
import { ApolloProvider } from "@apollo/client";
import { client } from "./graphql/client";
import { useResources } from "./hooks/useResources";

const serviceTypes = ["Food Pantry", "Shelter", "Health", "Social Services", "Meals on Wheels"];

function App() {
  const [serviceType, setServiceType] = useState(serviceTypes[0]);
  const { data, loading, error } = useResources(serviceType);

  return (
    <ApolloProvider client={client}>
      <div style={{ padding: "2rem" }}>
        <h1>Community Resources</h1>

        <label>
          Filter by Service Type:{" "}
          <select value={serviceType} onChange={(e) => setServiceType(e.target.value)}>
            {serviceTypes.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>

        {loading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}

        <ul>
          {data?.resourcesByServiceType?.map((r: any) => (
            <li key={r.id}>
              <strong>{r.name}</strong> - {r.city}, {r.county} ({r.serviceType})
              <br />
              {r.address} | {r.phone} | {r.email}
            </li>
          ))}
        </ul>
      </div>
    </ApolloProvider>
  );
}

export default App;
EOL

echo "✅ Frontend scaffold created successfully with Vite + React + Apollo."
echo "Next steps:"
echo "1. cd $FRONTEND_DIR"
echo "2. npm install"
echo "3. npm run dev"