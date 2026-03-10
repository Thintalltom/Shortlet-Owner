import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { SavedProperty, UserRole } from "../types";

interface SavedPropertiesState {
  list: SavedProperty[];
  loading: boolean;
  error: string | null;
}

const initialState: SavedPropertiesState = {
  list: [],
  loading: false,
  error: null,
};

// Async thunks for API calls
export const fetchSavedProperties = createAsyncThunk(
  "savedProperties/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://localhost:8000/saved-properties", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch saved properties");
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const savePropertyToServer = createAsyncThunk(
  "savedProperties/save",
  async (propertyId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://localhost:8000/saved-properties", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ property_id: propertyId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to save property");
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const unsavePropertyFromServer = createAsyncThunk(
  "savedProperties/unsave",
  async (propertyId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `http://localhost:8000/saved-properties/${propertyId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) throw new Error("Failed to unsave property");
      return propertyId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const checkPropertySaved = createAsyncThunk(
  "savedProperties/check",
  async (propertyId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `http://localhost:8000/saved-properties/check/${propertyId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) throw new Error("Failed to check property");
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const savedPropertiesSlice = createSlice({
  name: "savedProperties",
  initialState,
  reducers: {
    // Local only save (before API sync)
    savePropertyLocal: (state, action: PayloadAction<SavedProperty>) => {
      const exists = state.list.find(
        (s) => s.propertyId === action.payload.propertyId,
      );
      if (!exists) {
        state.list.push(action.payload);
      }
    },
    // Local only unsave (before API sync)
    unsavePropertyLocal: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((s) => s.propertyId !== action.payload);
    },
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch saved properties
    builder
      .addCase(fetchSavedProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSavedProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.map((item: any) => ({
          id: item.id,
          userId: item.user_id,
          propertyId: item.property_id,
          role: item.role,
          savedAt: item.created_at,
        }));
      })
      .addCase(fetchSavedProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Save property
    builder
      .addCase(savePropertyToServer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(savePropertyToServer.fulfilled, (state, action) => {
        state.loading = false;
        const newSaved: SavedProperty = {
          id: action.payload.id,
          userId: action.payload.user_id,
          propertyId: action.payload.property_id,
          role: action.payload.role,
          savedAt: action.payload.created_at,
        };
        const exists = state.list.find(
          (s) => s.propertyId === newSaved.propertyId,
        );
        if (!exists) {
          state.list.push(newSaved);
        }
      })
      .addCase(savePropertyToServer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Unsave property
    builder
      .addCase(unsavePropertyFromServer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unsavePropertyFromServer.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((s) => s.propertyId !== action.payload);
      })
      .addCase(unsavePropertyFromServer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { savePropertyLocal, unsavePropertyLocal, clearError } =
  savedPropertiesSlice.actions;
export default savedPropertiesSlice.reducer;
