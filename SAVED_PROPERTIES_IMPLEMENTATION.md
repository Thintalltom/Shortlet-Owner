# Saved Properties Implementation Guide

## Overview

The saved properties system allows **guests** and **agents** to save properties for later reference. The data is stored in the database with role-based differentiation, so you can track which role saved which property.

---

## Database Schema

### SavedProperty Table

```
saved_properties (table)
├── id (Primary Key, Integer)
├── user_id (Foreign Key, Integer) - The authenticated user saving the property
├── property_id (Foreign Key, Integer) - The property being saved
├── role (String) - Role of user who saved (guest, agent, owner)
└── created_at (DateTime) - Timestamp of when it was saved
```

**Key Features:**

- One record per user-property combination (enforced at API level)
- Role automatically captured from authenticated user
- Timestamp tracking for analytics

---

## Backend Implementation

### Models (`models.py`)

```python
class SavedProperty(Base):
    __tablename__ = "saved_properties"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    property_id = Column(Integer, index=True)
    role = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
```

### Schemas (`schemas/saved_property.py`)

- `SavedPropertyCreate` - Request body for saving
- `SavedPropertyResponse` - Single saved property response
- `SavedPropertyList` - Enriched response with property details

### API Endpoints (`routers/saved_properties.py`)

#### 1. Save a Property

```
POST /saved-properties
Authorization: Bearer {token}
Body: { "property_id": 123 }

Response: 201 Created
{
  "id": 1,
  "user_id": 5,
  "property_id": 123,
  "role": "guest",
  "created_at": "2026-03-10T10:30:00"
}
```

#### 2. Get All Saved Properties (for current user)

```
GET /saved-properties
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "id": 1,
    "user_id": 5,
    "property_id": 123,
    "role": "guest",
    "created_at": "2026-03-10T10:30:00",
    "property_name": "Cozy Apartment",
    "price": 500,
    "city": "Lagos"
  },
  ...
]
```

#### 3. Unsave a Property

```
DELETE /saved-properties/{property_id}
Authorization: Bearer {token}

Response: 204 No Content
```

#### 4. Check if Property is Saved

```
GET /saved-properties/check/{property_id}
Authorization: Bearer {token}

Response: 200 OK
{
  "is_saved": true
}
```

#### 5. Role-Based Statistics (Admin/Owner only)

```
GET /saved-properties/role-stats/{role}
Authorization: Bearer {token}

Response: 200 OK
{
  "role": "guest",
  "total_saved": 45,
  "saved_properties": [...]
}
```

---

## Frontend Implementation

### Types (`src/types/index.ts`)

```typescript
interface SavedProperty {
  id: string;
  userId: string;
  propertyId: string;
  role: UserRole;
  savedAt: string;
}
```

### Redux Slice (`src/store/savedPropertiesSlice.ts`)

**State:**

```typescript
{
  savedProperties: {
    list: SavedProperty[],
    loading: boolean,
    error: string | null
  }
}
```

**Async Thunks:**

- `fetchSavedProperties()` - Fetch all saved properties
- `savePropertyToServer(propertyId)` - Save a property
- `unsavePropertyFromServer(propertyId)` - Unsave a property
- `checkPropertySaved(propertyId)` - Check if saved

**Local Actions:**

- `savePropertyLocal()` - Local-only save (optimistic UI)
- `unsavePropertyLocal()` - Local-only unsave
- `clearError()` - Clear error message

### Custom Hook (`src/store/useSavedProperties.ts`)

Easy access to saved properties everywhere:

```typescript
const {
  savedProperties, // Array of SavedProperty
  loading, // Loading state
  error, // Error message if any
  fetchAll, // Load saved properties
  saveProperty, // Save a property
  unsaveProperty, // Unsave a property
  checkSaved, // Check if saved
  isPropertySaved, // Helper: boolean check
} = useSavedProperties();
```

---

## Usage Examples

### Example 1: Display "Save" button on property card

```typescript
import { useSavedProperties } from '@/store/useSavedProperties';

function PropertyCard({ property }) {
  const { isPropertySaved, saveProperty, unsaveProperty } = useSavedProperties();
  const isSaved = isPropertySaved(property.id);

  const handleToggleSave = () => {
    if (isSaved) {
      unsaveProperty(property.id);
    } else {
      saveProperty(property.id);
    }
  };

  return (
    <div>
      <button onClick={handleToggleSave}>
        {isSaved ? '❤️ Saved' : '🤍 Save'}
      </button>
    </div>
  );
}
```

### Example 2: Load saved properties on page load

```typescript
import { useSavedProperties } from '@/store/useSavedProperties';
import { useEffect } from 'react';

function SavedPropertiesPage() {
  const { savedProperties, loading, fetchAll } = useSavedProperties();

  useEffect(() => {
    fetchAll();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {savedProperties.map(saved => (
        <div key={saved.id}>
          <h3>{saved.property_name}</h3>
          <p>Saved by: {saved.role}</p>
          <p>Price: ${saved.price}</p>
        </div>
      ))}
    </div>
  );
}
```

### Example 3: Filter by role

```typescript
const { savedProperties } = useSavedProperties();

const agentSaves = savedProperties.filter((s) => s.role === "agent");
const guestSaves = savedProperties.filter((s) => s.role === "guest");
```

---

## Setup Instructions

### 1. Backend Setup

✅ Already done:

- `SavedProperty` model added to `models.py`
- `saved_property.py` schema created
- `saved_properties.py` router created
- Router imported in `main.py`

**To apply changes:**

```bash
cd ShortletVM
# Run migrations (if using Alembic)
# Or simply restart the app - SQLite will auto-create tables
python main.py
```

### 2. Frontend Setup

✅ Already done:

- Updated `SavedProperty` type in `types/index.ts`
- Updated `savedPropertiesSlice.ts` with async thunks
- Created `useSavedProperties.ts` hook

**No additional setup needed** - just start using the hook in your components!

---

## Role Differentiation

The system automatically captures the role when a user saves a property:

### For Guests:

- Save properties they're interested in renting
- Can see their own saved properties
- Saved as `role: "guest"`

### For Agents:

- Save properties they want to manage or market
- Can see their own saved properties
- Saved as `role: "agent"`

### Admin Dashboard (future):

- Can view aggregate stats: "45 properties saved by guests, 23 by agents"
- Identify popular properties
- Analyze user engagement

---

## Error Handling

The hook provides error state:

```typescript
const { error, clearError, saveProperty } = useSavedProperties();

const handleSave = async () => {
  try {
    await saveProperty(propertyId);
    // Success!
  } catch (err) {
    console.error(error);
    clearError();
  }
};
```

Common errors:

- `"Property not found"` - Invalid property ID
- `"Property already saved"` - Trying to save duplicate
- `"Saved property not found"` - Trying to unsave non-existent save

---

## Testing the API

### Using cURL:

```bash
# Save a property
curl -X POST http://localhost:8000/saved-properties \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"property_id": 1}'

# Get all saved
curl -X GET http://localhost:8000/saved-properties \
  -H "Authorization: Bearer YOUR_TOKEN"

# Unsave
curl -X DELETE http://localhost:8000/saved-properties/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Database Queries

### Find all properties saved by guests:

```sql
SELECT sp.*, p.PropertyName, p.price
FROM saved_properties sp
JOIN properties p ON sp.property_id = p.id
WHERE sp.role = 'guest'
ORDER BY sp.created_at DESC;
```

### Find most saved properties:

```sql
SELECT property_id, COUNT(*) as save_count
FROM saved_properties
GROUP BY property_id
ORDER BY save_count DESC
LIMIT 10;
```

### Find user's saved properties:

```sql
SELECT sp.*, p.PropertyName, p.price
FROM saved_properties sp
JOIN properties p ON sp.property_id = p.id
WHERE sp.user_id = ? AND sp.role = ?;
```

---

## Next Steps (Future Enhancements)

1. **Notifications:** Alert agents when a guest saves their property
2. **Analytics:** Track which properties are most saved
3. **Collections:** Allow users to create folders/collections of saved properties
4. **Sharing:** Share saved properties with others
5. **Export:** Export saved properties list
6. **Recommendations:** Suggest similar properties based on saves
