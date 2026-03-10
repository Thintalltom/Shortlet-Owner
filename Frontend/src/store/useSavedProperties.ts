import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./index";
import {
  fetchSavedProperties,
  savePropertyToServer,
  unsavePropertyFromServer,
  checkPropertySaved,
  clearError,
} from "./savedPropertiesSlice";

/**
 * Hook for managing saved properties
 * Provides easy access to saved properties state and actions
 */
export const useSavedProperties = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector(
    (state: RootState) => state.savedProperties,
  );

  return {
    savedProperties: list,
    loading,
    error,
    // Actions
    fetchAll: () => dispatch(fetchSavedProperties()),
    saveProperty: (propertyId: string) =>
      dispatch(savePropertyToServer(propertyId)),
    unsaveProperty: (propertyId: string) =>
      dispatch(unsavePropertyFromServer(propertyId)),
    checkSaved: (propertyId: string) =>
      dispatch(checkPropertySaved(propertyId)),
    clearError: () => dispatch(clearError()),
    // Helper to check if a property is saved
    isPropertySaved: (propertyId: string) =>
      list.some((p) => p.propertyId === propertyId),
  };
};
