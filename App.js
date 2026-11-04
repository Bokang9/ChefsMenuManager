import React, { useEffect, useState, createContext, useContext } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { formatCurrency } from "./src/utils/currency";

const STORAGE_KEY = "@chef_menu_items_v1";

const DEFAULT_ITEMS = [
  {
    id: "1",
    name: "Tiramisu Classico",
    description: "Traditional Italian tiramisu with espresso & mascarpone",
    course: "Dessert",
    price: "80.00",
    image: null,
  },
  {
    id: "2",
    name: "Chocolate Fondant",
    description: "Warm dark chocolate fondant with vanilla ice cream",
    course: "Dessert",
    price: "85.00",
    image: null,
  },
  {
    id: "3",
    name: "Crème Brûlée",
    description: "Classic vanilla bean crème brûlée with fresh berries",
    course: "Dessert",
    price: "75.00",
    image: null,
  },
  {
    id: "4",
    name: "Chicken Supreme",
    description: "Free-range chicken breast with seasonal vegetables & thyme jus",
    course: "Main Course",
    price: "195.00",
    image: null,
  },
  {
    id: "5",
    name: "Wild Mushroom Risotto",
    description: "Arborio rice with wild mushrooms, parmesan & truffle oil (V)",
    course: "Main Course",
    price: "165.00",
    image: null,
  },
  {
    id: "6",
    name: "Pan-Seared Salmon",
    description: "Atlantic salmon with asparagus, baby potatoes & dill cream sauce",
    course: "Main Course",
    price: "220.00",
    image: null,
  },
  {
    id: "7",
    name: "Grilled Ribeye Steak",
    description: "300g prime ribeye with rosemary potatoes and red wine jus",
    course: "Main Course",
    price: "285.00",
    image: null,
  },
  {
    id: "8",
    name: "Bruschetta al Pomodoro",
    description: "Toasted sourdough with heirloom tomatoes, basil & olive oil",
    course: "Starter",
    price: "65.00",
    image: null,
  },
  {
    id: "9",
    name: "Seared Scallops",
    description: "Pan-seared scallops with cauliflower puree and lemon beurre blanc",
    course: "Starter",
    price: "120.00",
    image: null,
  },
  {
    id: "10",
    name: "Truffle Arancini",
    description: "Crispy risotto balls with black truffle, parmesan and aioli",
    course: "Starter",
    price: "85.00",
    image: null,
  },
];

const COURSE_OPTIONS = ["Starter", "Main Course", "Dessert"];
const MenuContext = createContext(null);

function usePersistentItems() {
  const [items, setItems] = useState(DEFAULT_ITEMS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const savedItems = await AsyncStorage.getItem(STORAGE_KEY);

        if (savedItems) {
          const parsedItems = JSON.parse(savedItems);

          if (Array.isArray(parsedItems)) {
            setItems(parsedItems);
          }
        }
      } catch {
        // Keep the default menu if saved data cannot be loaded.
      } finally {
        setIsLoaded(true);
      }
    };

    loadItems();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items)).catch(() => {
      // The app remains usable if storage is unavailable.
    });
  }, [items, isLoaded]);

  const addItem = (newItem) => {
    setItems((currentItems) => [newItem, ...currentItems]);
  };

  const updateItem = (updatedItem) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      )
    );
  };

  const deleteItem = (id) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== id)
    );
  };

  return { items, addItem, updateItem, deleteItem };
}

function showMessage(message, title = "Notice") {
  if (Platform.OS === "web") {
    window.alert(message);
  } else {
    Alert.alert(title, message);
  }
}

function getCourseEmoji(course) {
  if (course === "Starter") return "🥗";
  if (course === "Main Course") return "🍲";
  if (course === "Dessert") return "🍰";
  return "🍽️";
}

function DishIcon({ course, size = 56 }) {
  return (
    <View
      style={[
        styles.dishIcon,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      <Text style={{ fontSize: size * 0.48 }}>{getCourseEmoji(course)}</Text>
    </View>
  );
}

function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.homeContainer}>
        <View style={styles.homeHeader}>
          <View>
            <Text style={styles.eyebrow}>CHEF’S MENU MANAGER</Text>
            <Text style={styles.homeTitle}>Home / Menu Screen</Text>
          </View>
          <View style={styles.headerIconCircle}>
            <Text style={styles.headerIcon}>👨‍🍳</Text>
          </View>
        </View>

        <View style={styles.banner}>
          <View style={styles.bannerIconCircle}>
            <Text style={styles.bannerIcon}>🍽️</Text>
          </View>
          <Text style={styles.bannerTitle}>Manage your menu</Text>
          <Text style={styles.bannerSubtitle}>
            Your menu, organised and ready to serve.
          </Text>
        </View>

        <Text style={styles.sectionHeading}>What would you like to do?</Text>

        <View style={styles.tileRow}>
          <TouchableOpacity
            style={[styles.tile, styles.tileBlue]}
            onPress={() => navigation.navigate("AddMenu")}
            activeOpacity={0.8}
          >
            <View style={[styles.tileIconCircle, styles.tileIconBlue]}>
              <Text style={styles.tileIcon}>＋</Text>
            </View>
            <Text style={styles.tileLabel}>ADD NEW ITEM</Text>
            <Text style={styles.tileDescription}>Create a dish</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tile, styles.tileGreen]}
            onPress={() => navigation.navigate("ViewAll")}
            activeOpacity={0.8}
          >
            <View style={[styles.tileIconCircle, styles.tileIconGreen]}>
              <Text style={styles.tileIcon}>☷</Text>
            </View>
            <Text style={styles.tileLabel}>VIEW ALL ITEMS</Text>
            <Text style={styles.tileDescription}>Manage your menu</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tileRow}>
          <TouchableOpacity
            style={[styles.tile, styles.tileOrange]}
            onPress={() => navigation.navigate("SearchFilter")}
            activeOpacity={0.8}
          >
            <View style={[styles.tileIconCircle, styles.tileIconOrange]}>
              <Text style={styles.tileIcon}>⌕</Text>
            </View>
            <Text style={styles.tileLabel}>SEARCH ITEMS</Text>
            <Text style={styles.tileDescription}>Find a dish by name</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tile, styles.tilePurple]}
            onPress={() => navigation.navigate("SearchFilter")}
            activeOpacity={0.8}
          >
            <View style={[styles.tileIconCircle, styles.tileIconPurple]}>
              <Text style={styles.tileIcon}>⚲</Text>
            </View>
            <Text style={styles.tileLabel}>FILTER BY COURSE</Text>
            <Text style={styles.tileDescription}>Browse by category</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function AddMenuScreen({ navigation }) {
  const { addItem } = useContext(MenuContext);

  const [dishName, setDishName] = useState("");
  const [description, setDescription] = useState("");
  const [course, setCourse] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {};
    const numericPrice = Number(price);

    if (!dishName.trim()) {
      nextErrors.dishName = "Dish name is required.";
    }

    if (!course) {
      nextErrors.course = "Please select a course.";
    }

    if (!price.trim()) {
      nextErrors.price = "Price is required.";
    } else if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      nextErrors.price = "Enter a valid price greater than zero.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleAddItem = () => {
    if (!validate()) return;

    const newItem = {
      id: Date.now().toString(),
      name: dishName.trim(),
      description: description.trim(),
      course,
      price: Number(price).toFixed(2),
      image: null,
    };

    addItem(newItem);
    showMessage(`${newItem.name} has been added to the menu.`, "Success");
    navigation.navigate("ViewAll");
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.formContainer}>
          <View style={styles.formHeadingRow}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.formTitle}>ADD MENU ITEM</Text>
            <View style={styles.backButtonPlaceholder} />
          </View>

          <Text style={styles.formIntro}>
            Add the details of a new dish to your menu.
          </Text>

          <Text style={styles.label}>DISH NAME</Text>
          <TextInput
            style={[styles.input, errors.dishName && styles.inputError]}
            placeholder="Enter dish name"
            placeholderTextColor={COLORS.placeholder}
            value={dishName}
            onChangeText={(value) => {
              setDishName(value);
              if (errors.dishName) {
                setErrors((previous) => ({ ...previous, dishName: "" }));
              }
            }}
          />
          {errors.dishName ? (
            <Text style={styles.errorText}>{errors.dishName}</Text>
          ) : null}

          <Text style={styles.label}>DESCRIPTION</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Describe the dish"
            placeholderTextColor={COLORS.placeholder}
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <Text style={styles.label}>COURSE</Text>
          <View style={[styles.pickerBox, errors.course && styles.inputError]}>
            <Picker
              selectedValue={course}
              onValueChange={(value) => {
                setCourse(value);
                if (errors.course) {
                  setErrors((previous) => ({ ...previous, course: "" }));
                }
              }}
            >
              <Picker.Item label="Select course" value="" />
              {COURSE_OPTIONS.map((option) => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          </View>
          {errors.course ? (
            <Text style={styles.errorText}>{errors.course}</Text>
          ) : null}

          <Text style={styles.label}>PRICE (R)</Text>
          <TextInput
            style={[styles.input, errors.price && styles.inputError]}
            placeholder="Enter price (e.g. 50.00)"
            placeholderTextColor={COLORS.placeholder}
            value={price}
            onChangeText={(value) => {
              setPrice(value);
              if (errors.price) {
                setErrors((previous) => ({ ...previous, price: "" }));
              }
            }}
            keyboardType="decimal-pad"
          />
          {errors.price ? (
            <Text style={styles.errorText}>{errors.price}</Text>
          ) : null}

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleAddItem}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>SAVE MENU ITEM</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.85}
          >
            <Text style={styles.secondaryButtonText}>CANCEL</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function EditMenuScreen({ navigation, route }) {
  const { item } = route.params;
  const { updateItem, deleteItem } = useContext(MenuContext);

  const [dishName, setDishName] = useState(item.name);
  const [description, setDescription] = useState(item.description || "");
  const [course, setCourse] = useState(item.course);
  const [price, setPrice] = useState(String(item.price));

  const handleSave = () => {
    const cleanName = dishName.trim();
    const numericPrice = Number(price);

    if (!cleanName) {
      showMessage("Dish name is required.", "Check the details");
      return;
    }

    if (!course) {
      showMessage("Please select a course.", "Check the details");
      return;
    }

    if (!price.trim() || Number.isNaN(numericPrice) || numericPrice <= 0) {
      showMessage("Enter a valid price greater than zero.", "Check the details");
      return;
    }

    updateItem({
      ...item,
      name: cleanName,
      description: description.trim(),
      course,
      price: numericPrice.toFixed(2),
    });

    navigation.goBack();
  };

  const handleDelete = () => {
    const confirmDelete = () => {
      deleteItem(item.id);
      navigation.goBack();
    };

    if (Platform.OS === "web") {
      if (window.confirm(`Delete "${item.name}" from the menu?`)) {
        confirmDelete();
      }
      return;
    }

    Alert.alert(
      "Delete menu item",
      `Are you sure you want to delete "${item.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: confirmDelete,
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.formContainer}>
        <View style={styles.formHeadingRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.formTitle}>EDIT MENU ITEM</Text>
          <View style={styles.backButtonPlaceholder} />
        </View>

        <Text style={styles.formIntro}>
          Update the details of this menu item.
        </Text>

        <Text style={styles.label}>DISH NAME</Text>
        <TextInput
          style={styles.input}
          value={dishName}
          onChangeText={setDishName}
          placeholder="Enter dish name"
          placeholderTextColor={COLORS.placeholder}
        />

        <Text style={styles.label}>DESCRIPTION</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Describe the dish"
          placeholderTextColor={COLORS.placeholder}
          multiline
        />

        <Text style={styles.label}>COURSE</Text>
        <View style={styles.pickerBox}>
          <Picker selectedValue={course} onValueChange={setCourse}>
            {COURSE_OPTIONS.map((option) => (
              <Picker.Item key={option} label={option} value={option} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>PRICE (R)</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          placeholder="Enter price (e.g. 50.00)"
          placeholderTextColor={COLORS.placeholder}
          keyboardType="decimal-pad"
        />

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleSave}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>SAVE MENU ITEM</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          activeOpacity={0.85}
        >
          <Text style={styles.deleteButtonText}>DELETE MENU ITEM</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
        >
          <Text style={styles.secondaryButtonText}>CANCEL</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuItemCard({ item, onEdit, onDelete }) {
  return (
    <View style={styles.menuItemCard}>
      <DishIcon course={item.course} />

      <View style={styles.menuItemDetails}>
        <View style={styles.menuItemTitleRow}>
          <Text style={styles.menuItemName}>{item.name}</Text>
          <Text style={styles.menuItemPrice}>
            {formatCurrency(item.price)}
          </Text>
        </View>

        <View style={styles.courseBadge}>
          <Text style={styles.courseBadgeText}>{item.course}</Text>
        </View>

        {item.description ? (
          <Text style={styles.menuItemDescription} numberOfLines={2}>
            {item.description}
          </Text>
        ) : null}

        <View style={styles.menuItemActions}>
          <TouchableOpacity
            style={styles.editAction}
            onPress={() => onEdit(item)}
            activeOpacity={0.85}
          >
            <Text style={styles.editActionText}>EDIT</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteAction}
            onPress={() => onDelete(item.id)}
            activeOpacity={0.85}
          >
            <Text style={styles.deleteActionText}>DELETE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function ViewAllScreen({ navigation }) {
  const { items, deleteItem } = useContext(MenuContext);

  const handleDelete = (item) => {
    const confirmDelete = () => deleteItem(item.id);

    if (Platform.OS === "web") {
      if (window.confirm(`Delete "${item.name}" from the menu?`)) {
        confirmDelete();
      }
      return;
    }

    Alert.alert(
      "Delete menu item",
      `Are you sure you want to delete "${item.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: confirmDelete,
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.listScreenContainer}>
        <View style={styles.listHeader}>
          <Text style={styles.listScreenTitle}>All Menu Items</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{items.length}</Text>
          </View>
        </View>

        {items.length === 0 ? (
          <View style={styles.emptyStateCard}>
            <Text style={styles.emptyStateIcon}>🍽️</Text>
            <Text style={styles.emptyStateTitle}>Your menu is empty</Text>
            <Text style={styles.emptyText}>
              Add a dish to start building your menu.
            </Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate("AddMenu")}
            >
              <Text style={styles.primaryButtonText}>ADD MENU ITEM</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.menuList}
            renderItem={({ item }) => (
              <MenuItemCard
                item={item}
                onEdit={(selectedItem) =>
                  navigation.navigate("EditMenu", { item: selectedItem })
                }
                onDelete={() => handleDelete(item)}
              />
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

function SearchFilterScreen({ navigation }) {
  const { items, deleteItem } = useContext(MenuContext);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");

  const normalizedQuery = query.trim().toLowerCase();

  const filteredItems = items.filter((item) => {
    const nameMatches =
      normalizedQuery === "" ||
      item.name.toLowerCase().includes(normalizedQuery);

    const courseMatches = filter === "All" || item.course === filter;

    return nameMatches && courseMatches;
  });

  const hasActiveSearch = normalizedQuery !== "" || filter !== "All";

  const handleDelete = (item) => {
    const confirmDelete = () => deleteItem(item.id);

    if (Platform.OS === "web") {
      if (window.confirm(`Delete "${item.name}" from the menu?`)) {
        confirmDelete();
      }
      return;
    }

    Alert.alert(
      "Delete menu item",
      `Are you sure you want to delete "${item.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: confirmDelete,
        },
      ]
    );
  };

  const clearSearchAndFilter = () => {
    setQuery("");
    setFilter("All");
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.searchScreenContainer}>
        <Text style={styles.listScreenTitle}>Search & Filter</Text>
        <Text style={styles.formIntro}>
          Find dishes by name or browse by course.
        </Text>

        <TouchableOpacity
          style={styles.searchAddButton}
          onPress={() => navigation.navigate("AddMenu")}
          activeOpacity={0.85}
        >
          <Text style={styles.searchAddButtonText}>＋  ADD MENU ITEM</Text>
        </TouchableOpacity>

        <View style={styles.searchInputWrap}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search menu items by name..."
            placeholderTextColor={COLORS.placeholder}
            value={query}
            onChangeText={setQuery}
          />
        </View>

        <Text style={styles.label}>FILTER BY COURSE</Text>
        <View style={styles.pickerBox}>
          <Picker
            selectedValue={filter}
            onValueChange={(value) => setFilter(value)}
          >
            <Picker.Item label="All Courses" value="All" />
            {COURSE_OPTIONS.map((option) => (
              <Picker.Item key={option} label={option} value={option} />
            ))}
          </Picker>
        </View>

        <View style={styles.resultsRow}>
          <Text style={styles.resultsText}>
            Showing {filteredItems.length} of {items.length} items
          </Text>

          {hasActiveSearch ? (
            <TouchableOpacity onPress={clearSearchAndFilter}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.menuList}
          ListEmptyComponent={
            <View style={styles.emptyStateCard}>
              <Text style={styles.emptyStateIcon}>
                {items.length === 0 ? "🍽️" : "🔎"}
              </Text>
              <Text style={styles.emptyStateTitle}>
                {items.length === 0 ? "Your menu is empty" : "No dishes found"}
              </Text>
              <Text style={styles.emptyText}>
                {items.length === 0
                  ? "Add a dish to start building your menu."
                  : "Try another dish name or choose a different course."}
              </Text>
              {hasActiveSearch ? (
                <TouchableOpacity
                  style={styles.clearLargeButton}
                  onPress={clearSearchAndFilter}
                >
                  <Text style={styles.clearLargeButtonText}>
                    CLEAR SEARCH AND FILTER
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          }
          renderItem={({ item }) => (
            <MenuItemCard
              item={item}
              onEdit={(selectedItem) =>
                navigation.navigate("EditMenu", { item: selectedItem })
              }
              onDelete={() => handleDelete(item)}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
}

function StatCard({ icon, label, value, accent }) {
  return (
    <View style={[styles.statsCard, { borderLeftColor: accent }]}>
      <View style={styles.statsCardInfo}>
        <View style={[styles.statsIconCircle, { backgroundColor: accent }]}>
          <Text style={styles.statsIcon}>{icon}</Text>
        </View>
        <Text style={styles.statsLabel}>{label}</Text>
      </View>
      <Text style={styles.statsValue}>{value}</Text>
    </View>
  );
}

function StatisticsScreen() {
  const { items } = useContext(MenuContext);

  const totalItems = items.length;

  const courseCounts = items.reduce(
    (counts, item) => {
      if (item.course === "Starter") counts.starters += 1;
      if (item.course === "Main Course") counts.mains += 1;
      if (item.course === "Dessert") counts.desserts += 1;
      return counts;
    },
    { starters: 0, mains: 0, desserts: 0 }
  );

  const totalPrice = items.reduce(
    (sum, item) => sum + (Number(item.price) || 0),
    0
  );

  const averagePrice = totalItems > 0 ? totalPrice / totalItems : 0;

  const courseCountsForMostCommon = [
    { name: "Starter", count: courseCounts.starters },
    { name: "Main Course", count: courseCounts.mains },
    { name: "Dessert", count: courseCounts.desserts },
  ];

  const mostCommonCourse =
    totalItems === 0
      ? "N/A"
      : courseCountsForMostCommon.reduce((highest, current) =>
          current.count > highest.count ? current : highest
        ).name;

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.statsScreenContainer}>
        <View style={styles.statsHeading}>
          <Text style={styles.eyebrow}>MENU OVERVIEW</Text>
          <Text style={styles.statsScreenTitle}>Statistics</Text>
          <Text style={styles.formIntro}>
            A quick look at your menu at a glance.
          </Text>
        </View>

        <ScrollView contentContainerStyle={styles.statsList}>
          <StatCard
            icon="☷"
            label="Total Items"
            value={totalItems}
            accent={COLORS.blue}
          />
          <StatCard
            icon="R"
            label="Average Price"
            value={formatCurrency(averagePrice)}
            accent={COLORS.green}
          />
          <StatCard
            icon="🥗"
            label="Starters"
            value={courseCounts.starters}
            accent={COLORS.orange}
          />
          <StatCard
            icon="🍲"
            label="Main Courses"
            value={courseCounts.mains}
            accent={COLORS.purple}
          />
          <StatCard
            icon="🍰"
            label="Desserts"
            value={courseCounts.desserts}
            accent={COLORS.pink}
          />

          <View style={styles.mostCommonCard}>
            <View style={styles.mostCommonIconCircle}>
              <Text style={styles.mostCommonIcon}>📊</Text>
            </View>
            <View style={styles.mostCommonTextWrap}>
              <Text style={styles.statsLabel}>Most Common Course</Text>
              <Text style={styles.mostCommonValue}>{mostCommonCourse}</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const COLORS = {
  background: "#F4F7FB",
  white: "#FFFFFF",
  ink: "#183153",
  muted: "#718096",
  placeholder: "#9AA9BA",
  border: "#E2E8F0",
  blue: "#3977E8",
  green: "#1FA987",
  orange: "#F29B38",
  purple: "#8B69D3",
  pink: "#E56B91",
  red: "#D9485F",
};

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MenuStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="AddMenu" component={AddMenuScreen} />
      <Stack.Screen name="ViewAll" component={ViewAllScreen} />
      <Stack.Screen name="EditMenu" component={EditMenuScreen} />
      <Stack.Screen name="SearchFilter" component={SearchFilterScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  const menuContextValue = usePersistentItems();

  return (
    <MenuContext.Provider value={menuContextValue}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: COLORS.blue,
            tabBarInactiveTintColor: "#8996A8",
            tabBarStyle: styles.tabBar,
            tabBarLabelStyle: styles.tabBarLabel,
          }}
        >
          <Tab.Screen
            name="Menu"
            component={MenuStack}
            options={{
              tabBarLabel: "Menu",
              tabBarIcon: ({ color }) => (
                <Text style={[styles.tabIcon, { color }]}>☷</Text>
              ),
            }}
          />
          <Tab.Screen
            name="Statistics"
            component={StatisticsScreen}
            options={{
              tabBarLabel: "Statistics",
              tabBarIcon: ({ color }) => (
                <Text style={[styles.tabIcon, { color }]}>▥</Text>
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </MenuContext.Provider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  homeContainer: {
    padding: 18,
    paddingBottom: 28,
  },

  homeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  eyebrow: {
    color: COLORS.blue,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.4,
    marginBottom: 5,
  },

  homeTitle: {
    color: COLORS.ink,
    fontSize: 22,
    fontWeight: "800",
  },

  headerIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E8F0FF",
  },

  headerIcon: {
    fontSize: 25,
  },

  banner: {
    backgroundColor: COLORS.ink,
    borderRadius: 20,
    padding: 22,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: COLORS.ink,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },

  bannerIconCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  bannerIcon: {
    fontSize: 32,
  },

  bannerTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "800",
    marginTop: 2,
  },

  bannerSubtitle: {
    color: "#D6E2F2",
    fontSize: 13,
    marginTop: 6,
    textAlign: "center",
  },

  sectionHeading: {
    color: COLORS.ink,
    fontWeight: "800",
    fontSize: 16,
    marginBottom: 12,
  },

  tileRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  tile: {
    width: "48%",
    minHeight: 140,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#344563",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },

  tileBlue: {
    borderTopWidth: 4,
    borderTopColor: COLORS.blue,
  },

  tileGreen: {
    borderTopWidth: 4,
    borderTopColor: COLORS.green,
  },

  tileOrange: {
    borderTopWidth: 4,
    borderTopColor: COLORS.orange,
  },

  tilePurple: {
    borderTopWidth: 4,
    borderTopColor: COLORS.purple,
  },

  tileIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  tileIconBlue: {
    backgroundColor: "#E8F0FF",
  },

  tileIconGreen: {
    backgroundColor: "#E5F7F1",
  },

  tileIconOrange: {
    backgroundColor: "#FFF2E2",
  },

  tileIconPurple: {
    backgroundColor: "#F0EBFC",
  },

  tileIcon: {
    color: COLORS.ink,
    fontSize: 25,
    fontWeight: "700",
  },

  tileLabel: {
    color: COLORS.ink,
    fontSize: 12,
    fontWeight: "800",
  },

  tileDescription: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 4,
  },

  formContainer: {
    padding: 18,
    paddingBottom: 30,
  },

  formHeadingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 10,
  },

  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#E8F0FF",
    alignItems: "center",
    justifyContent: "center",
  },

  backButtonText: {
    color: COLORS.blue,
    fontSize: 30,
    lineHeight: 32,
    fontWeight: "500",
    marginTop: -4,
  },

  backButtonPlaceholder: {
    width: 34,
  },

  formTitle: {
    flex: 1,
    color: COLORS.ink,
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
  },

  formIntro: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 12,
  },

  label: {
    color: COLORS.ink,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
    marginTop: 12,
    marginBottom: 6,
  },

  input: {
    minHeight: 46,
    backgroundColor: COLORS.white,
    color: COLORS.ink,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },

  textarea: {
    minHeight: 92,
    textAlignVertical: "top",
  },

  pickerBox: {
    overflow: "hidden",
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  inputError: {
    borderColor: COLORS.red,
  },

  errorText: {
    color: COLORS.red,
    fontSize: 12,
    marginTop: 5,
  },

  primaryButton: {
    minHeight: 48,
    backgroundColor: COLORS.blue,
    paddingVertical: 13,
    borderRadius: 10,
    marginTop: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.blue,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 2,
  },

  primaryButtonText: {
    color: COLORS.white,
    fontWeight: "800",
    fontSize: 13,
    letterSpacing: 0.5,
  },

  secondaryButton: {
    minHeight: 46,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryButtonText: {
    color: COLORS.ink,
    fontWeight: "700",
    fontSize: 13,
  },

  deleteButton: {
    minHeight: 46,
    backgroundColor: "#FFF0F1",
    borderWidth: 1,
    borderColor: "#F5C6CB",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  deleteButtonText: {
    color: COLORS.red,
    fontWeight: "800",
    fontSize: 13,
  },

  listScreenContainer: {
    flex: 1,
    padding: 16,
  },

  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  listScreenTitle: {
    color: COLORS.ink,
    fontSize: 21,
    fontWeight: "800",
  },

  countBadge: {
    minWidth: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#E8F0FF",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 9,
    paddingHorizontal: 8,
  },

  countBadgeText: {
    color: COLORS.blue,
    fontSize: 13,
    fontWeight: "800",
  },

  menuList: {
    paddingBottom: 20,
  },

  menuItemCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 12,
    marginBottom: 11,
    shadowColor: "#344563",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },

  dishIcon: {
    backgroundColor: "#FFF3E5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#F9E2C7",
  },

  menuItemDetails: {
    flex: 1,
  },

  menuItemTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  menuItemName: {
    flex: 1,
    color: COLORS.ink,
    fontSize: 15,
    fontWeight: "800",
    marginRight: 8,
  },

  menuItemPrice: {
    color: COLORS.green,
    fontSize: 13,
    fontWeight: "800",
  },

  courseBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#EAF2FF",
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 4,
    marginTop: 6,
  },

  courseBadgeText: {
    color: COLORS.blue,
    fontSize: 10,
    fontWeight: "800",
  },

  menuItemDescription: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 7,
  },

  menuItemActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },

  editAction: {
    backgroundColor: "#E8F0FF",
    borderRadius: 7,
    paddingHorizontal: 13,
    paddingVertical: 7,
    marginRight: 8,
  },

  editActionText: {
    color: COLORS.blue,
    fontWeight: "800",
    fontSize: 10,
  },

  deleteAction: {
    backgroundColor: "#FFF0F1",
    borderRadius: 7,
    paddingHorizontal: 13,
    paddingVertical: 7,
  },

  deleteActionText: {
    color: COLORS.red,
    fontWeight: "800",
    fontSize: 10,
  },

  emptyStateCard: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 24,
    marginTop: 14,
  },

  emptyStateIcon: {
    fontSize: 42,
    marginBottom: 8,
  },

  emptyStateTitle: {
    color: COLORS.ink,
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 5,
  },

  emptyText: {
    color: COLORS.muted,
    textAlign: "center",
    fontSize: 13,
    lineHeight: 19,
  },

  searchScreenContainer: {
    flex: 1,
    padding: 16,
  },

  searchAddButton: {
    minHeight: 42,
    backgroundColor: COLORS.blue,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 7,
    marginBottom: 12,
  },

  searchAddButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "800",
  },

  searchInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingLeft: 11,
  },

  searchIcon: {
    color: COLORS.blue,
    fontSize: 24,
    marginRight: 6,
  },

  searchInput: {
    flex: 1,
    minHeight: 44,
    color: COLORS.ink,
    paddingHorizontal: 5,
    paddingVertical: 8,
    fontSize: 14,
  },

  resultsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 11,
    marginBottom: 3,
  },

  resultsText: {
    color: COLORS.muted,
    fontSize: 12,
  },

  clearButtonText: {
    color: COLORS.blue,
    fontSize: 12,
    fontWeight: "800",
  },

  clearLargeButton: {
    backgroundColor: "#E8F0FF",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 15,
  },

  clearLargeButtonText: {
    color: COLORS.blue,
    fontSize: 11,
    fontWeight: "800",
  },

  statsScreenContainer: {
    flex: 1,
    padding: 16,
  },

  statsHeading: {
    marginBottom: 12,
  },

  statsScreenTitle: {
    color: COLORS.ink,
    fontSize: 25,
    fontWeight: "800",
    marginBottom: 4,
  },

  statsList: {
    paddingBottom: 18,
  },

  statsCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 72,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 5,
    borderRadius: 13,
    paddingHorizontal: 13,
    paddingVertical: 12,
    marginBottom: 10,
    shadowColor: "#344563",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },

  statsCardInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  statsIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  statsIcon: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "800",
  },

  statsLabel: {
    color: COLORS.muted,
    fontSize: 13,
    fontWeight: "600",
  },

  statsValue: {
    color: COLORS.ink,
    fontSize: 19,
    fontWeight: "800",
    marginLeft: 8,
  },

  mostCommonCard: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 76,
    backgroundColor: "#FFF8EA",
    borderWidth: 1,
    borderColor: "#F4E3B8",
    borderRadius: 13,
    padding: 14,
    marginTop: 2,
  },

  mostCommonIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FCE9B8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  mostCommonIcon: {
    fontSize: 19,
  },

  mostCommonTextWrap: {
    flex: 1,
  },

  mostCommonValue: {
    color: COLORS.ink,
    fontSize: 15,
    fontWeight: "800",
    marginTop: 3,
  },

  tabBar: {
    height: 62,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: COLORS.white,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
  },

  tabBarLabel: {
    fontSize: 11,
    fontWeight: "700",
  },

  tabIcon: {
    fontSize: 21,
    fontWeight: "700",
  },
});