// src/App.tsx
import React, { useState, useEffect } from "react";
import { ApolloClient, InMemoryCache, HttpLink, gql } from "@apollo/client";
import { ApolloProvider, useQuery } from "@apollo/client/react";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid"; // <-- Type-only import
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box, MenuItem, FormControl, Select, InputLabel } from "@mui/material";

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

// ------------------ Theme ------------------
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

// ------------------ Resources App ------------------
const ResourcesApp: React.FC = () => {
  const [selectedState, setSelectedState] = useState("New Jersey");
  const [county, setCounty] = useState<string | null>(null);
  const [town, setTown] = useState<string | null>(null);
  const [serviceType, setServiceType] = useState<string | null>(null);

  const { data: statesData } = useQuery(GET_STATES);
  const states = statesData?.states || [];

  const { data: countiesData, refetch: refetchCounties } = useQuery(
    GET_COUNTIES_BY_STATE,
    { variables: { state: selectedState } },
  );
  const counties = countiesData?.countiesByState || [];

  const { data: resourcesData, refetch: refetchResources } = useQuery(
    GET_RESOURCES,
    { variables: { county, city: town, serviceType } },
  );
  const resources = resourcesData?.resources || [];

  // ------------------ Effects ------------------
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

  // ------------------ DataGrid Columns ------------------
  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1, minWidth: 350 },
    {
      field: "serviceType",
      headerName: "Service Type",
      flex: 1,
      minWidth: 220,
    },
    { field: "county", headerName: "County", flex: 1, minWidth: 120 },
    { field: "city", headerName: "Town", flex: 1, minWidth: 120 },
    { field: "address", headerName: "Address", flex: 2, minWidth: 280 },
    {
      field: "phone",
      headerName: "Phone",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <a
          href={`tel:${params.value}`}
          target="_blank"
          rel="noreferrer"
          className="text-blue-400 underline"
          title={params.value}
        >
          {params.value}
        </a>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 250,
      renderCell: (params) => (
        <a
          href={`mailto:${params.value}`}
          target="_blank"
          rel="noreferrer"
          className="text-blue-400 underline"
          title={params.value}
        >
          {params.value}
        </a>
      ),
    },
    {
      field: "website",
      headerName: "Website",
      flex: 2,
      minWidth: 250,
      renderCell: (params) =>
        params.value ? (
          <a
            href={params.value}
            target="_blank"
            rel="noreferrer"
            className="text-blue-400 underline"
            title={params.value}
          >
            {params.value}
          </a>
        ) : null,
    },
    {
      field: "eligibility",
      headerName: "Eligibility",
      flex: 1.5,
      minWidth: 350,
    },
    { field: "hours", headerName: "Hours", flex: 1, minWidth: 280 },
    {
      field: "appointmentRequired",
      headerName: "Appt Req?",
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) =>
        params.value ? (
          <span className="text-red-400">Yes</span>
        ) : (
          <span className="text-green-400">No</span>
        ),
    },
    { field: "description", headerName: "Description", flex: 2, minWidth: 200 },
    {
      field: "sourceUrl",
      headerName: "Source",
      flex: 1.5,
      minWidth: 150,
      renderCell: (params) =>
        params.value ? (
          <a
            href={params.value}
            target="_blank"
            rel="noreferrer"
            className="text-blue-400 underline"
          >
            Source
          </a>
        ) : null,
    },
  ];

  return (
    <ThemeProvider theme={darkTheme}>
      <Box className="min-h-screen bg-gray-900 text-gray-100 p-6">
        <Box maxWidth="7xl" mx="auto">
          <h1 className="text-3xl font-bold mb-6">Community Resources</h1>

          {/* Filters */}
          <Box className="flex flex-wrap gap-4 mb-6">
            {/* State */}
            <FormControl sx={{ minWidth: 160 }}>
              <InputLabel>State</InputLabel>
              <Select
                value={selectedState}
                label="State"
                onChange={(e) => setSelectedState(e.target.value)}
              >
                {states.map((s: any) => (
                  <MenuItem key={s.id} value={s.name}>
                    {s.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* County */}
            <FormControl sx={{ minWidth: 160 }}>
              <InputLabel>County</InputLabel>
              <Select
                value={county || ""}
                label="County"
                onChange={(e) => setCounty(e.target.value || null)}
              >
                <MenuItem value="">All</MenuItem>
                {counties.map((c: any) => (
                  <MenuItem key={c.id} value={c.name}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Town */}
            {county && (
              <FormControl sx={{ minWidth: 160 }}>
                <InputLabel>Town</InputLabel>
                <Select
                  value={town || ""}
                  label="Town"
                  onChange={(e) => setTown(e.target.value || null)}
                >
                  <MenuItem value="">All</MenuItem>
                  {counties
                    .find((c: any) => c.name === county)
                    ?.towns.map((t: any) => (
                      <MenuItem key={t.id} value={t.name}>
                        {t.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            )}

            {/* Service Type */}
            <FormControl sx={{ minWidth: 160 }}>
              <InputLabel>Service Type</InputLabel>
              <Select
                value={serviceType || ""}
                label="Service Type"
                onChange={(e) => setServiceType(e.target.value || null)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Shelter">Shelter</MenuItem>
                <MenuItem value="Food Pantry">Food Pantry</MenuItem>
                <MenuItem value="Health Clinic">Health Clinic</MenuItem>
                <MenuItem value="Social Services">Social Services</MenuItem>
                <MenuItem value="Meals on Wheels">Meals on Wheels</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* DataGrid Table */}
          <Box sx={{ height: 600, width: "100%" }}>
            <DataGrid
              rows={resources}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 20, 50]}
              autoHeight
              getRowId={(row) => row.id}
              sx={{
                backgroundColor: "#111827",
                color: "#f9fafb",
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#1f2937",
                  color: "#f9fafb",
                },
                "& .MuiDataGrid-cell": { color: "#f9fafb" },
                "& .MuiDataGrid-footerContainer": {
                  backgroundColor: "#1f2937",
                  color: "#f9fafb",
                },
              }}
            />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

// ------------------ App Wrapper ------------------
const App: React.FC = () => (
  <ApolloProvider client={client}>
    <ResourcesApp />
  </ApolloProvider>
);

export default App;
