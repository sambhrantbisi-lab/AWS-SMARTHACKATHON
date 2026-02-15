# Brutalist Admin Panel - Government Schemes Management

## Overview
A brutalist-styled admin panel for managing government schemes and services with full CRUD operations.

## Features

### 1. Dashboard
- **Statistics Display**:
  - Total schemes count
  - Number of categories
  - Active schemes count
  - Schemes added this month
- **Quick Actions**: Fast access to common tasks
- **Visual Stats**: Large, bold numbers in brutalist style

### 2. Add Scheme
Complete form for adding new government schemes with:
- **Basic Information**:
  - Scheme name
  - Category (dropdown with 10+ categories)
  - Description
  - Department
- **Contact & Links**:
  - Official website
  - Application URL
  - Helpline number
- **Details**:
  - Eligibility criteria
  - Required documents (multi-line)
  - Benefits description
- **Tags**: Dynamic tag system (press Enter to add)

### 3. Manage Schemes
- **List View**: All schemes in card format
- **Search**: Real-time search by name, description, or category
- **Actions**: Edit and delete buttons for each scheme
- **Scheme Cards**: Display key information at a glance

### 4. Categories
- **Category Overview**: All categories with scheme counts
- **Visual Display**: Large numbers showing schemes per category

## Design Features

### Brutalist Aesthetic
- **Typography**: Space Mono (monospace) and Space Grotesk
- **Colors**: Purple theme (#7b2cbf, #9d4edd, #c77dff)
- **Borders**: Thick 4-6px black borders
- **Layout**: Grid-based, bold and functional
- **Buttons**: Large, uppercase, high contrast
- **Forms**: Clear labels, thick borders, focus states

### Responsive Design
- **Desktop**: Sidebar + content grid
- **Mobile**: Stacked layout, full-width forms
- **Tablet**: Optimized for medium screens

## Usage

### Access the Panel
1. Navigate to `/admin-brutalist.html`
2. Login with admin credentials (redirects to `/admin.html` if not authenticated)
3. Token stored in localStorage

### Add a New Scheme
1. Click "ADD SCHEME" in sidebar
2. Fill in required fields (marked with *)
3. Add tags by typing and pressing Enter
4. Click "SAVE SCHEME"
5. Success message appears
6. Redirects to "MANAGE SCHEMES"

### Edit a Scheme
1. Go to "MANAGE SCHEMES"
2. Click edit button (✏️) on any scheme
3. Form pre-fills with existing data
4. Make changes
5. Click "SAVE SCHEME"
6. Scheme updates in database

### Delete a Scheme
1. Go to "MANAGE SCHEMES"
2. Click delete button (🗑️) on any scheme
3. Confirm deletion
4. Scheme removed from database

### Search Schemes
1. Go to "MANAGE SCHEMES"
2. Type in search box
3. Results filter in real-time
4. Searches name, description, and category

## API Integration

### Endpoints Used
```javascript
// Get all schemes
GET /api/services

// Create new scheme
POST /api/services
Headers: { Authorization: 'Bearer <token>' }
Body: { name, description, category, ... }

// Update scheme
PUT /api/services/:id
Headers: { Authorization: 'Bearer <token>' }
Body: { name, description, category, ... }

// Delete scheme
DELETE /api/services/:id
Headers: { Authorization: 'Bearer <token>' }
```

### Authentication
- Token stored in `localStorage.getItem('adminToken')`
- Sent in Authorization header
- Checked on page load
- Redirects to login if missing

## Categories Available

1. **Identity Documents** - Aadhaar, PAN, Passport, etc.
2. **Financial Services** - Banking, loans, subsidies
3. **Education** - Scholarships, schools, training
4. **Healthcare** - Medical schemes, insurance
5. **Agriculture** - Farming support, subsidies
6. **Employment** - Job schemes, skill development
7. **Housing** - Housing schemes, loans
8. **Social Welfare** - Pensions, welfare programs
9. **Business** - Entrepreneurship, startups
10. **Women Empowerment** - Women-focused schemes

## Form Fields

### Required Fields (*)
- Scheme Name
- Category
- Description
- Department

### Optional Fields
- Official Website
- Application URL
- Helpline Number
- Eligibility Criteria
- Required Documents
- Benefits
- Tags

## Data Structure

```javascript
{
  name: "Pradhan Mantri Awas Yojana",
  description: "Housing for all scheme...",
  category: "housing",
  department: "Ministry of Housing and Urban Affairs",
  officialWebsite: "https://pmaymis.gov.in",
  applicationUrl: "https://pmaymis.gov.in/Open/Find_Beneficiary.aspx",
  helpline: "1800-11-6163",
  eligibility: "Economically Weaker Section (EWS)...",
  requiredDocuments: [
    "Aadhaar Card",
    "Income Certificate",
    "Property Documents"
  ],
  benefits: "Financial assistance for house construction...",
  tags: ["housing", "subsidy", "urban", "rural"],
  isActive: true,
  createdAt: "2026-02-15T10:30:00.000Z"
}
```

## Keyboard Shortcuts

- **Enter** in tag input: Add tag
- **Escape**: Close modals (if implemented)
- **Tab**: Navigate form fields

## Visual Indicators

### Colors
- **Purple (#7b2cbf)**: Primary actions, active states
- **Black (#000)**: Borders, text
- **White (#fff)**: Backgrounds
- **Red (#ff0000)**: Delete actions, logout
- **Gray (#666)**: Secondary text

### Icons
- 📊 Dashboard
- ➕ Add Scheme
- 📋 Manage Schemes
- 🏷️ Categories
- ✏️ Edit
- 🗑️ Delete

## Error Handling

### Success Messages
- Green background (#c7fdff)
- "Scheme added successfully!"
- "Scheme updated successfully!"
- "Scheme deleted successfully!"
- "Data refreshed successfully!"

### Error Messages
- Red background (#ffc7c7)
- "Error loading schemes"
- "Error saving scheme"
- "Error deleting scheme"

### Validation
- Required fields checked on submit
- URL fields validate format
- Tags prevent duplicates
- Confirmation on delete

## Mobile Optimization

### Responsive Breakpoints
- **Desktop** (>968px): Sidebar + content grid
- **Tablet** (768-968px): Stacked layout
- **Mobile** (<768px): Full-width, single column

### Mobile Features
- Touch-friendly buttons (44px minimum)
- Scrollable forms
- Sticky sidebar becomes static
- Full-width inputs

## Performance

### Optimizations
- Client-side search (no API calls)
- Local state management
- Minimal re-renders
- Efficient DOM updates

### Loading States
- Dashboard stats update on load
- Schemes list loads once
- Real-time search filtering
- Instant UI feedback

## Security

### Authentication
- Token-based auth
- Stored in localStorage
- Sent with every API request
- Checked on page load

### Authorization
- Admin-only routes
- Middleware protection
- Role-based access

## Future Enhancements

Possible additions:
- Bulk import/export
- Image upload for schemes
- Multi-language support
- Approval workflow
- Version history
- Analytics dashboard
- Email notifications
- PDF generation
- Advanced filters
- Sorting options

## Testing

### Test Scenarios
1. Add a new scheme with all fields
2. Add a scheme with only required fields
3. Edit an existing scheme
4. Delete a scheme
5. Search for schemes
6. View categories
7. Check dashboard stats
8. Test responsive layout
9. Test tag system
10. Test form validation

## Troubleshooting

### Common Issues

**Schemes not loading**
- Check API endpoint `/api/services`
- Verify token in localStorage
- Check browser console for errors

**Can't save scheme**
- Verify all required fields filled
- Check token is valid
- Verify API endpoint accessible

**Search not working**
- Check schemes array populated
- Verify search input ID matches
- Check console for JavaScript errors

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support

## Accessibility

- Semantic HTML
- Keyboard navigation
- Focus indicators
- ARIA labels (can be added)
- High contrast
- Large touch targets
