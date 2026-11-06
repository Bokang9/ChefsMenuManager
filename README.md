# Chef’s Menu Manager

## Part 3: Application Development and Evaluation

**Application:** Chef’s Menu Manager  
**Platform:** React Native with Expo  
**Intended user:** Christoffel, restaurant owner and chef  
**Submission date:** 6 November 2026  

## 1. Application Description

Chef’s Menu Manager is a mobile application that helps Christoffel manage the restaurant’s menu digitally. It stores each dish’s name, description, course, and price. The chef can add, view, edit, delete, search, and filter menu items, and view statistics about the menu.

The application uses React Native and Expo. Menu data is managed through shared React context and saved locally using AsyncStorage, allowing it to be loaded again when the application is reopened.

## 2. Objectives

The objectives of the application are to:

1. Provide the chef with one place to manage menu items using a mobile device.
2. Allow the chef to add, view, edit, and delete dishes.
3. Help the chef find items using name search and course filters.
4. Reduce input mistakes through validation and clear error messages.
5. Provide an overview of menu items and prices through automatically updated statistics.
6. Offer a consistent, clear, and user-friendly interface.

## 3. User Requirements and How the Application Meets Them

| User requirement | How the application meets it |
|---|---|
| Store menu information | Each item includes a dish name, description, course, and price. |
| Add dishes | The Add Menu Item screen lets the chef enter the required information and save a dish. |
| View the menu | The View All Items screen displays the saved items and their details. |
| Update menu information | The Edit Menu Item screen allows the chef to update an existing dish. |
| Remove dishes | The chef can delete items, with a confirmation prompt to help avoid accidental deletion. |
| Find menu items | The Search & Filter screen supports searching by dish name. |
| Browse by course | The chef can filter items by Starter, Main Course, or Dessert. Search and filtering can be cleared to show all items again. |
| Review menu data | The Statistics screen displays total items, average price, counts by course, and the most common course. |
| Avoid incomplete or invalid data | Forms validate the dish name, course, and price, and show messages when information is missing or invalid. |
| Keep menu data between sessions | AsyncStorage saves menu data locally on the device. |

## 4. Navigation and Application Flow

The application has two bottom-tab sections: **Menu** and **Statistics**. The Menu tab contains the main menu-management screens.

| Screen | Navigation | Purpose |
|---|---|---|
| **Home / Menu** | Opens from the Menu tab | Provides shortcuts to add an item, view all items, search, or filter by course. |
| **Add Menu Item** | Select **Add New Item** from Home or **Add Menu Item** from Search & Filter | Allows the chef to enter a dish name, description, course, and price. |
| **View All Items** | Select **View All Items** from Home | Shows menu items and their Edit and Delete actions. |
| **Search & Filter** | Select **Search Items** or **Filter by Course** from Home | Lets the chef search by name, filter by course, or use both together. |
| **Edit Menu Item** | Select **Edit** on a menu item | Allows the chef to update or delete an existing item, or cancel and return. |
| **Statistics** | Select the Statistics tab | Displays the current menu totals, average price, course counts, and most common course. |

### Typical user flow

1. The chef opens the Home / Menu screen.
2. The chef selects an action: add an item, view the menu, search, or filter.
3. When adding or editing a dish, the chef enters or updates its details.
4. The application validates the information.
5. If information is missing or invalid, an error message appears so the chef can correct it.
6. Valid information is saved, and the updated menu is shown.
7. Statistics recalculate using the current menu data.

## 5. Main Features

### 5.1 Menu management

The chef can add new dishes, view the menu, edit item details, and delete items. Each menu item contains:

- Dish name
- Description
- Course
- Price

### 5.2 Search and filtering

The Search & Filter screen allows the chef to search by dish name and filter by Starter, Main Course, or Dessert. The chef can combine a search and course filter. A Clear action resets the search and filter to show the full menu again.

### 5.3 Statistics

The Statistics screen displays:

- Total number of menu items
- Average price of all menu items
- Number of Starter items
- Number of Main Course items
- Number of Dessert items
- Most common course

The statistics are calculated from the shared menu data and update when an item is added, edited, or deleted.

### 5.4 Data persistence

AsyncStorage saves the menu data locally on the device. When the application is reopened, it attempts to load the saved items.

## 6. User Interface and Colour Palette

The interface uses a consistent style with a light background, readable text, coloured accents, and rounded cards.

| Colour | Hex value | Use |
|---|---|---|
| Soft background | `#F4F7FB` | Screen backgrounds |
| White | `#FFFFFF` | Cards, forms, and tab bar |
| Navy | `#183153` | Headings and primary text |
| Blue | `#3977E8` | Primary actions and highlights |
| Green | `#1FA987` | Positive accents and average-price statistic |
| Orange | `#F29B38` | Starter course accent |
| Purple | `#8B69D3` | Main Course accent |
| Pink | `#E56B91` | Dessert accent |
| Red | `#D9485F` | Delete actions and validation errors |
| Muted grey | `#718096` | Descriptions and secondary text |

The light background and white cards help keep the screens readable. Navy provides contrast for important text, while blue identifies primary actions. Different accent colours help distinguish course categories and statistics. Red is used for destructive actions and errors so they are easy to recognise.

## 7. Validation and User Feedback

The application validates menu information before saving:

- Dish name is required.
- A course must be selected.
- Price is required and must be a positive number.

When information is invalid, an error message tells the user what to correct. The application also provides success feedback after adding or updating an item and asks for confirmation before deleting one. Empty-state messages help explain when there are no menu items or no search results.

## 8. Reusable Components and Code Organisation

Reusable components help keep the interface consistent and reduce repeated code:

- `DishIcon` displays a course-themed icon beside a dish.
- `MenuItemCard` displays dish details and Edit/Delete actions.
- `StatCard` displays a statistic with its label and value.
- `showMessage` provides platform-appropriate feedback messages.

Shared menu state allows the list and statistics screens to use the same current data.

## Conclusion

Chef’s Menu Manager provides Christoffel with a practical way to manage restaurant menu information from a mobile device. It supports adding, viewing, editing, deleting, searching, and filtering menu items, while its Statistics screen gives the chef an overview of the menu. Validation, confirmation prompts, and feedback messages help make the application easier to use and reduce mistakes. The consistent visual design and reusable components support a clear, user-friendly experience.

The application meets the needs of the user by giving the chef a simple digital way to organise menu items without relying on manual paper records. It is also suitable for a mobile environment because it is intuitive, responsive, and designed to help the chef work efficiently.

In conclusion, the application meets the project requirements by combining menu management, user validation, search and filtering, statistics, persistence, and a polished interface in one functional mobile solution.

## References

- Expo. (n.d.). *Expo Documentation*. [ONLINE] Available at: https://docs.expo.dev/ [Accessed 6 November 2026].
- React Native. (n.d.). *React Native Documentation*. [ONLINE] Available at: https://reactnative.dev/docs/getting-started [Accessed 6 November 2026].
- React Navigation. (n.d.). *React Navigation Documentation*. [ONLINE] Available at: https://reactnavigation.org/docs/getting-started [Accessed 6 November 2026].
- AsyncStorage. (n.d.). *AsyncStorage Documentation*. [ONLINE] Available at: https://react-native-async-storage.github.io/async-storage/ [Accessed 6 November 2026].
- GitHub. (2026). *ChefsMenuManager repository*. [ONLINE] Available at: https://github.com/Bokang9/ChefsMenuManager [Accessed 6 November 2026].
- YouTube. (2026). *Chef’s Menu Manager demonstration video*. [ONLINE] Available at: https://youtu.be/VhvNOVp7ae4 [Accessed 6 November 2026].
- diagrams.net. (2026). *Chef’s Menu Manager application flow*. [ONLINE] Available at: https://drive.google.com/file/d/1eBMyDxSUZkuMpgHg6JvvHYWqmA7zBM1r/view?usp=sharing [Accessed 6 November 2026].