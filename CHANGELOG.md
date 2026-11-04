## Application Changelog

| Date | Area | Changes made |
|---|---|---|
| 25 October 2026 | **Menu data and storage** | Menu items are managed in shared React context and saved using AsyncStorage, so menu data is retained between app sessions. |
| 26 October 2026 | **Add menu item** | Added validation for the dish name, course, and positive price. Added field-level error messages and a success message after saving. |
| 27 October 2026 | **Edit menu item** | Added validation for the dish name, course, and price. Saving updates the existing item and displays a confirmation message. |
| 28 October 2026 | **Delete menu item** | Added a confirmation prompt before deleting an item from the edit screen or menu lists. |
| 29 October 2026 | **Search** | Users can search for dishes by name. The search ignores uppercase/lowercase differences and extra spaces. |
| 30 October 2026 | **Course filter** | Users can filter by Starter, Main Course, or Dessert, and combine a course filter with a name search. |
| 31 October 2026 | **Clear search and filter** | Added a Clear control that resets the search field and restores the course filter to All Courses. |
| 1 November 2026 | **Menu item lists** | Added reusable menu-item cards showing each dish’s name, price, course, description, and Edit/Delete actions. Added course-themed emoji icons as visual accents. |
| 2 November 2026 | **Statistics** | Displays the total number of menu items, average price, counts for each course, and the most common course. Statistics recalculate when items are added, edited, or deleted. |
| 3 November 2026 | **Empty states** | Added clearer messages when the menu is empty or a search/filter has no matching results. |
| 4 November 2026 | **Visual design** | Applied a consistent chef-app theme with navy headings, blue and green accents, colored course icons, rounded cards, subtle shadows, and a styled bottom tab bar. |
| 5 November 2026 | **Code, accessibility, and usability** | Added reusable components and helper functions, including `DishIcon`, `MenuItemCard`, `StatCard`, and `showMessage`. Improved input placeholders, button labels, and touch feedback to make the app clearer and easier to use. |
| 6 November 2026 | **Submission** | Submitted the POE. |

### Summary

The application was improved to make it more polished, user-friendly, and consistent across screens. It retains the required menu-management, search, filtering, and statistics features while improving validation, feedback, visual presentation, and code reusability.