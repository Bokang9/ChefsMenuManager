# ChefsMenuManager

## 1. What The App Does
Chef's Menu Manager is a React Native mobile app built with Expo that helps a Chef manage his restaurant menu digitally. It allows the Chef to Add, View, Edit, Delete, Search, Filter by course, and see Statistics. All data is auto-saved with AsyncStorage so it remains after closing the app.

## 2. What It Includes
- Home Screen: Dashboard with 4 tiles and total count
- View All Items: Shows 10 default items with Edit/Delete
- Add Item: Form with validation + success alert
- Edit Item: Pre-filled form using map() to update
- Search & Filter: Live search + filter chips + count
- Statistics: Totals per course and most common course
- Persistence: AsyncStorage + DEFAULT_ITEMS

Default 10 Items: Bruschetta R65, Scallops R120, Arancini R85, Chicken R195, Risotto R165, Salmon R220, Ribeye R285, Tiramisu R80, Fondant R85, Crème Brûlée R75

## 3. How To Navigate & What Each Thing Does
Flow: Home -> All Items / Add / Search / Stats -> Edit

- Home: 4 buttons navigate via navigation.navigate()
- All Items: Card shows Name, Course badge, Price, Description. EDIT passes data via route.params. DELETE uses filter() and auto-saves.
- Add: Validates name required and price >0. Creates id with Date.now().toString(), adds with [...menuItems, newItem], saves with AsyncStorage.setItem().
- Edit: Pre-filled with useState(route.params.item.name). Updates with map() and saves.
- Search & Filter: Searches name/description with toLowerCase().includes(). Filters by course.
- Statistics: Calculates length and filter().length for totals.

## 4. How To Run
git clone https://github.com/Bokang9/ChefsMenuManager.git
cd ChefsMenuManager
npm install
npx expo start -c
Press w for web or scan QR with Expo Go

## POE Video Demonstration

YouTube Link (Unlisted): https://youtu.be/VhvNOVp7ae4

This video demonstrates the Chef Menu App running with:
npx expo start -c on http://localhost:8081
Includes: Add item fix, view all 10 menu items, search/filter.

## 5. Conclusion
In conclusion, the Chef's Menu Manager app successfully meets all POE requirements. It provides complete CRUD functionality with value-added features. The DEFAULT_ITEMS solution ensures data is visible on first launch for marking. The app demonstrates core mobile skills: React Native, hooks, navigation, AsyncStorage, validation. All 8 GitHub Actions workflows are passing green. Through this POE I learned to build practical user-friendly apps solving real hospitality problems.

## 6. Change Log - What Was Changed Since Part 2

This section documents all changes implemented since Part 2 submission as required.

### Part 2 Issues That Were Fixed:
1. **Empty Screen on First Launch (Critical Fix):** In Part 2 the app showed "No menu items" when lecturer opened it. FIXED by adding DEFAULT_ITEMS array with 10 realistic dishes. App now checks AsyncStorage first, if empty it loads DEFAULT_ITEMS.
2. **TransformError / Build Failure:** Part 2 had TransformError due to Picker import and non-serializable values warning. FIXED by correcting import from @react-native-picker/picker and ensuring App.js structure is clean. GitHub Actions now shows 8/8 green ticks.
3. **No Auto-Save:** Part 2 did not persist after closing. FIXED by implementing AsyncStorage.setItem on every add/edit/delete and getItem on app start with useEffect.
4. **Missing Validation:** Added proper validation - Name required Alert and Price must be >0 Alert. Part 2 allowed empty items.
5. **Missing Confirmation Alerts:** Added Success Alert "Menu item added" and Delete Confirmation "Are you sure?" as per POE spec.
6. **Added Search Count:** Added "Showing X of Y items" text in Search Screen which was missing in Part 2.
7. **Added Course Color Badges:** Added color-coded badges - Orange for Starter, Green for Main, Purple for Dessert for better UI.
8. **Added South African Pricing:** Changed all prices to Rands (R65-R285) to be locally relevant.
9. **README Overhaul:** Part 2 README was basic. Now includes full documentation, navigation guide, run instructions, conclusion, and this changelog.

### Refactoring - What Was Changed During Refactoring:
1. **Code Structure Refactored:** Moved all screens into single App.js with clean Stack.Navigator to avoid navigation prop issues that caused "navigation.navigate is not a function" error in Part 2.
2. **State Logic Refactored:** Consolidated menuItems state at top level in App.js and passed setter functions as props instead of passing non-serializable functions through route.params which caused yellow warning "Non-serializable values were found in navigation state".
3. **Storage Logic Refactored:** Created two separate useEffects - one for loading (empty dependency []) and one for saving (dependency [menuItems]) with check to prevent overwriting DEFAULT_ITEMS on first load.
4. **UI Refactored:** Replaced basic Views with styled Cards using StyleSheet, added shadows, borderRadius, and improved FlatList rendering with keyExtractor using item.id.
5. **Picker Refactored:** Changed Picker implementation from old community import to correct @react-native-picker/picker usage with proper style.
6. **Performance Refactored:** Used useState for filtered results in Search screen instead of filtering inside render to improve performance.
7. **Error Handling Refactored:** Added try/catch around all AsyncStorage operations to prevent app crash if storage fails.

