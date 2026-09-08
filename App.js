import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
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

const STORAGE_KEY = "@chef_menu_items_v1";

// YOUR 10 ITEMS - LECTURER WILL SEE THESE AUTOMATICALLY
const DEFAULT_ITEMS = [
  { id: "1", name: "Tiramisu Classico", description: "Traditional Italian tiramisu with espresso & mascarpone", course: "Dessert", price: "80.00", image: null },
  { id: "2", name: "Chocolate Fondant", description: "Warm dark chocolate fondant with vanilla ice cream", course: "Dessert", price: "85.00", image: null },
  { id: "3", name: "Crème Brûlée", description: "Classic vanilla bean crème brûlée with fresh berries", course: "Dessert", price: "75.00", image: null },
  { id: "4", name: "Chicken Supreme", description: "Free-range chicken breast with seasonal vegetables & thyme jus", course: "Main Course", price: "195.00", image: null },
  { id: "5", name: "Wild Mushroom Risotto", description: "Arborio rice with wild mushrooms, parmesan & truffle oil (V)", course: "Main Course", price: "165.00", image: null },
  { id: "6", name: "Pan-Seared Salmon", description: "Atlantic salmon with asparagus, baby potatoes & dill cream sauce", course: "Main Course", price: "220.00", image: null },
  { id: "7", name: "Grilled Ribeye Steak", description: "300g prime ribeye with rosemary potatoes and red wine jus", course: "Main Course", price: "285.00", image: null },
  { id: "8", name: "Bruschetta al Pomodoro", description: "Toasted sourdough with heirloom tomatoes, basil & extra virgin olive oil", course: "Starter", price: "65.00", image: null },
  { id: "9", name: "Seared Scallops", description: "Pan-seared scallops with cauliflower puree and lemon beurre Blanc", course: "Starter", price: "120.00", image: null },
  { id: "10", name: "Truffle Arancini", description: "Crispy risotto balls infused with black truffle & parmesan, served with aioli", course: "Starter", price: "85.00", image: null },
];

function usePersistentItems() {
  const [items, setItems] = useState(DEFAULT_ITEMS); // START WITH YOUR 10
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((s) => {
      if (s) {
        const saved = JSON.parse(s);
        // Only use saved if it's not empty, otherwise keep DEFAULT_ITEMS
        if (saved && saved.length > 0) setItems(saved);
      }
    }).catch(() => {});
  }, []);
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items)).catch(() => {});
  }, [items]);
  const addItem = (item) => setItems((prev) => [item,...prev]);
  const updateItem = (updated) => setItems((prev) => prev.map((it) => (it.id === updated.id? updated : it)));
  const deleteItem = (id) => setItems((prev) => prev.filter((it) => it.id!== id));
  return { items, addItem, updateItem, deleteItem };
}

function HomeScreen({ navigation, route }) {
  const { context } = route.params;
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerTitle}>Home / Menu Screen</Text>
        <View style={styles.banner}><Text style={styles.bannerIcon}>🍽️</Text><Text style={styles.bannerTitle}>Manage your menu</Text><Text style={styles.bannerSubtitle}>Quick. Simple. Easy.</Text></View>
        <View style={styles.tileRow}>
          <TouchableOpacity style={styles.tile} onPress={() => navigation.navigate("AddMenu", { context })}><Text style={styles.tilePlus}>＋</Text><Text style={styles.tileLabel}>ADD NEW ITEM</Text></TouchableOpacity>
          <TouchableOpacity style={styles.tile} onPress={() => navigation.navigate("ViewAll", { context })}><Text style={styles.tileList}>≡</Text><Text style={styles.tileLabel}>VIEW ALL ITEMS</Text></TouchableOpacity>
        </View>
        <View style={styles.tileRow}>
          <TouchableOpacity style={styles.tile} onPress={() => navigation.navigate("SearchFilter", { context })}><Text style={styles.tileSearch}>🔍</Text><Text style={styles.tileLabel}>SEARCH ITEMS</Text></TouchableOpacity>
          <TouchableOpacity style={styles.tile} onPress={() => navigation.navigate("SearchFilter", { context })}><Text style={styles.tileFilter}>⚲</Text><Text style={styles.tileLabel}>FILTER BY COURSE</Text></TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function AddMenuScreen({ navigation, route }) {
  const { addItem } = route.params.context;
  const [dishName, setDishName] = useState(""); const [description, setDescription] = useState(""); const [course, setCourse] = useState(""); const [price, setPrice] = useState(""); const [errors, setErrors] = useState({});
  const validate = () => { const e = {}; if (!dishName.trim()) e.dishName = "Dish Name is required."; if (!course) e.course = "Select a course."; if (!price.toString().trim()) e.price = "Price is required."; else { const n = Number(price); if (Number.isNaN(n) || n <= 0) e.price = "Enter a valid positive price."; } setErrors(e); return Object.keys(e).length === 0; };
  const onNext = () => {
    if (!validate()) return;
    const newItem = { id: Date.now().toString(), name: dishName.trim(), description: description.trim(), course, price: Number(price).toFixed(2), image: null };
    addItem(newItem);
    if (Platform.OS === 'web') {
      window.alert(`Success! ${dishName} added to menu`);
    } else {
      Alert.alert("Success", `${dishName} added to menu`);
    }
    navigation.navigate("ViewAll", route.params);
  };
  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView behavior={Platform.select({ ios: "padding", android: undefined })} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.formContainer}>
          <Text style={styles.formTitle}>ADD MENU ITEM</Text>
          <Text style={styles.label}>DISH NAME</Text><TextInput style={[styles.input, errors.dishName && styles.inputError]} placeholder="Enter dish name" value={dishName} onChangeText={setDishName} />{errors.dishName? <Text style={styles.errorText}>{errors.dishName}</Text> : null}
          <Text style={styles.label}>DESCRIPTION</Text><TextInput style={[styles.input, styles.textarea]} placeholder="Enter description" value={description} onChangeText={setDescription} multiline />
          <Text style={styles.label}>COURSE</Text><View style={[styles.pickerBox, errors.course && styles.inputError]}><Picker selectedValue={course} onValueChange={(v) => setCourse(v)}><Picker.Item label="Select course" value="" /><Picker.Item label="Starter" value="Starter" /><Picker.Item label="Main Course" value="Main Course" /><Picker.Item label="Dessert" value="Dessert" /></Picker></View>{errors.course? <Text style={styles.errorText}>{errors.course}</Text> : null}
          <Text style={styles.label}>PRICE (R)</Text><TextInput style={[styles.input, errors.price && styles.inputError]} placeholder="Enter price (e.g. R50.00)" value={price} onChangeText={setPrice} keyboardType="decimal-pad" />{errors.price? <Text style={styles.errorText}>{errors.price}</Text> : null}
          <TouchableOpacity style={styles.primaryButton} onPress={onNext}><Text style={styles.primaryButtonText}>NEXT</Text></TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.goBack()}><Text style={styles.secondaryButtonText}>CANCEL</Text></TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function EditMenuScreen({ navigation, route }) {
  const { item, updateItem, deleteItem } = route.params;
  const [dishName, setDishName] = useState(item.name); const [description, setDescription] = useState(item.description); const [course, setCourse] = useState(item.course); const [price, setPrice] = useState(item.price);
  const onSave = () => { const updated = {...item, name: dishName.trim(), description: description.trim(), course, price: Number(price).toFixed(2) }; updateItem(updated); navigation.goBack(); };
  const onDelete = () => {
    const doDelete = () => { deleteItem(item.id); navigation.goBack(); };
    if (Platform.OS === 'web') { if (window.confirm("Are you sure you want to delete this item?")) doDelete(); return; }
    Alert.alert("Confirm delete", "Are you sure?", [{ text: "Cancel", style: "cancel" }, { text: "Delete", style: "destructive", onPress: doDelete }]);
  };
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text style={styles.formTitle}>Edit MENU ITEM</Text>
        <Text style={styles.label}>Dish Name</Text><TextInput style={styles.input} value={dishName} onChangeText={setDishName} />
        <Text style={styles.label}>Description</Text><TextInput style={[styles.input, styles.textarea]} value={description} onChangeText={setDescription} multiline />
        <Text style={styles.label}>Price</Text><TextInput style={styles.input} value={price.toString()} onChangeText={setPrice} keyboardType="decimal-pad" />
        <Text style={styles.label}>Course</Text><View style={styles.pickerBox}><Picker selectedValue={course} onValueChange={(v) => setCourse(v)}><Picker.Item label="Starter" value="Starter" /><Picker.Item label="Main Course" value="Main Course" /><Picker.Item label="Dessert" value="Dessert" /></Picker></View>
        <TouchableOpacity style={styles.primaryButton} onPress={onSave}><Text style={styles.primaryButtonText}>SAVE MENU ITEM</Text></TouchableOpacity>
        <TouchableOpacity style={styles.dangerButton} onPress={onDelete}><Text style={styles.dangerButtonText}>DELETE</Text></TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.goBack()}><Text style={styles.secondaryButtonText}>CANCEL</Text></TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function ViewAllScreen({ navigation, route }) {
  const { items, deleteItem, updateItem } = route.params.context;
  const handleDelete = (id) => {
    if (Platform.OS === 'web') { if (window.confirm("Are you sure you want to delete this item?")) deleteItem(id); return; }
    Alert.alert("Confirm delete", "Are you sure?", [{ text: "Cancel", style: "cancel" }, { text: "Delete", style: "destructive", onPress: () => deleteItem(id) }]);
  };
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>All Menu Items ({items.length})</Text>
        {items.length === 0? <View style={styles.emptyBox}><Text style={styles.emptyText}>No menu items have been added yet. Start by adding a dish!</Text></View> : (
          <FlatList data={items} keyExtractor={(it) => it.id} renderItem={({ item }) => (
            <View style={styles.itemBox}>
              <View style={{flexDirection:'row', alignItems:'center'}}>
                <View style={{width:50, height:50, borderWidth:1, borderColor:'#000', alignItems:'center', justifyContent:'center', backgroundColor:'#fff', marginRight:10}}>
                  {item.image? <Image source={{uri: item.image}} style={{width:48, height:48}} /> : <Text>✕</Text>}
                </View>
                <View style={{flex:1}}>
                  <View style={styles.itemHeader}><Text style={styles.itemName}>{item.name}</Text><Text style={styles.itemPrice}>R{item.price}</Text></View>
                  <Text style={styles.itemCourse}>{item.course}</Text>
                </View>
              </View>
              {item.description? <Text style={styles.itemDesc}>{item.description}</Text> : null}
              <View style={{ flexDirection: 'row', marginTop: 8, gap: 10 }}>
                <TouchableOpacity style={styles.smallButton} onPress={() => navigation.navigate("EditMenu", { item, updateItem, deleteItem, context: route.params.context })}><Text style={styles.smallButtonText}>EDIT</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.smallButton, { backgroundColor: "#dc3545" }]} onPress={() => handleDelete(item.id)}><Text style={styles.smallButtonText}>DELETE</Text></TouchableOpacity>
              </View>
            </View>
          )} />
        )}
      </View>
    </SafeAreaView>
  );
}

function SearchFilterScreen({ navigation, route }) {
  const { items, deleteItem, updateItem } = route.params.context;
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const filtered = items.filter(it => {
    const q = query.toLowerCase().trim();
    const nameMatch = q === "" || it.name.toLowerCase().includes(q) || (it.description && it.description.toLowerCase().includes(q));
    const courseMatch = filter === "All" || it.course === filter;
    return nameMatch && courseMatch;
  });
  const isSearching = query.trim()!== "" || filter!== "All";
  const handleDelete = (id) => {
    if (Platform.OS === 'web') { if (window.confirm("Are you sure you want to delete this item?")) deleteItem(id); return; }
    Alert.alert("Confirm delete", "Are you sure?", [{ text: "Cancel", style: "cancel" }, { text: "Delete", style: "destructive", onPress: () => deleteItem(id) }]);
  };
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Search & Filter Screen</Text>
        <TouchableOpacity style={styles.fullAddButton} onPress={() => navigation.navigate("AddMenu", { context: route.params.context })}><Text style={styles.fullAddButtonText}>＋ ADD MENU ITEM</Text></TouchableOpacity>
        <TextInput style={styles.searchInput} placeholder="Search menu items..." value={query} onChangeText={setQuery} />
        <Text style={styles.label}>Filter by Course</Text>
        <View style={styles.pickerBox}><Picker selectedValue={filter} onValueChange={(v) => setFilter(v)}><Picker.Item label="All Courses" value="All" /><Picker.Item label="Starter" value="Starter" /><Picker.Item label="Main Course" value="Main Course" /><Picker.Item label="Dessert" value="Dessert" /></Picker></View>
        <Text style={{marginTop:10, color:'#666'}}>Showing {filtered.length} of {items.length} items</Text>
        <FlatList
          data={filtered}
          keyExtractor={(it) => it.id}
          ListEmptyComponent={<View style={styles.emptyBox}>{isSearching? <Text style={styles.emptyText}>No matching items for "{query}" in {filter}</Text> : items.length === 0? <Text style={styles.emptyText}>No menu items have been added yet. Start by adding a dish!</Text> : null}</View>}
          renderItem={({ item }) => (
            <View style={[styles.listItem, {alignItems: 'center'}]}>
              <View style={{width:60, height:60, borderWidth:1, borderColor:'#000', alignItems:'center', justifyContent:'center', backgroundColor:'#fff'}}>
                {item.image? <Image source={{uri: item.image}} style={{width:58, height:58}} resizeMode="cover" /> : <Text style={{fontSize:24, color:'#999'}}>✕</Text>}
              </View>
              <View style={styles.itemMain}><Text style={styles.listTitle}>{item.name}</Text><Text style={styles.listDesc}>{item.description || "Short description of the dish goes here..."}</Text><Text style={styles.listMeta}>Course: {item.course}</Text><Text style={styles.listMeta}>Price: R{item.price}</Text></View>
              <View style={styles.itemRight}>
                <TouchableOpacity style={styles.smallButton} onPress={() => navigation.navigate("EditMenu", { item, updateItem, deleteItem, context: route.params.context })}><Text style={styles.smallButtonText}>EDIT</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.smallButton, { marginTop: 8, backgroundColor: "#fff", borderWidth: 1, borderColor:'#000' }]} onPress={() => handleDelete(item.id)}><Text style={[styles.smallButtonText, { color: "#000" }]}>DELETE</Text></TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

function StatisticsScreen({ route }) {
  const { items } = route.params.context;
  const total = items.length;
  const starters = items.filter((i) => i.course === "Starter").length;
  const mains = items.filter((i) => i.course === "Main Course").length;
  const desserts = items.filter((i) => i.course === "Dessert").length;
  let mostCommon = "N/A";
  if (total > 0) {
    const arr = [{ n: "Starter", c: starters },{ n: "Main Course", c: mains },{ n: "Dessert", c: desserts },];
    arr.sort((a, b) => b.c - a.c);
    mostCommon = arr[0].n;
  }
  return (
    <SafeAreaView style={{flex:1, backgroundColor:'#fff'}}>
      <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', borderBottomWidth:1, borderColor:'#000', padding:12, backgroundColor:'#fff'}}>
        <Text style={{fontSize:18}}>{"<"}</Text>
        <Text style={{fontWeight:'700', fontSize:16}}>Statistics</Text>
        <View style={{width:18}} />
      </View>
      <View style={{padding:12, flex:1, backgroundColor:'#fff'}}>
        <View style={styles.statsCard}><View style={{flexDirection:'row', alignItems:'center'}}><Text style={styles.statsIcon}>☰</Text><Text style={styles.statsLabel}>Total Items</Text></View><Text style={styles.statsNumber}>{total}</Text></View>
        <View style={styles.statsCard}><View style={{flexDirection:'row', alignItems:'center'}}><Text style={styles.statsIcon}>☆</Text><Text style={styles.statsLabel}>Starters</Text></View><Text style={styles.statsNumber}>{starters}</Text></View>
        <View style={styles.statsCard}><View style={{flexDirection:'row', alignItems:'center'}}><Text style={styles.statsIcon}>🍲</Text><Text style={styles.statsLabel}>Main Courses</Text></View><Text style={styles.statsNumber}>{mains}</Text></View>
        <View style={styles.statsCard}><View style={{flexDirection:'row', alignItems:'center'}}><Text style={styles.statsIcon}>🎂</Text><Text style={styles.statsLabel}>Desserts</Text></View><Text style={styles.statsNumber}>{desserts}</Text></View>
        <View style={styles.statsCard}><View style={{flexDirection:'row', alignItems:'center'}}><Text style={styles.statsIcon}>📊</Text><View><Text style={styles.statsLabel}>Most Common Course</Text><Text style={{fontSize:13, fontWeight:'700', marginTop:2}}>{mostCommon}</Text></View></View></View>
      </View>
    </SafeAreaView>
  );
}

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
function MenuStack({ route }) {
  const { context } = route.params;
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} initialParams={{ context }} />
      <Stack.Screen name="AddMenu" component={AddMenuScreen} initialParams={{ context }} />
      <Stack.Screen name="ViewAll" component={ViewAllScreen} initialParams={{ context }} />
      <Stack.Screen name="EditMenu" component={EditMenuScreen} initialParams={{ context }} />
      <Stack.Screen name="SearchFilter" component={SearchFilterScreen} initialParams={{ context }} />
    </Stack.Navigator>
  );
}
export default function App() {
  const context = usePersistentItems();
  const boundContext = { items: context.items, addItem: context.addItem, updateItem: context.updateItem, deleteItem: context.deleteItem };
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle:{borderTopWidth:1, borderTopColor:'#000', height:60} }}>
        <Tab.Screen name="Menu" component={MenuStack} initialParams={{ context: boundContext }} options={{ tabBarLabel: "Menu", tabBarIcon: () => <Text>☰</Text> }} />
        <Tab.Screen name="Statistics" component={StatisticsScreen} initialParams={{ context: boundContext }} options={{ tabBarLabel: "Statistics", tabBarIcon: () => <Text>📊</Text> }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f8f8f8" }, container: { padding: 16, flex: 1 }, headerTitle: { fontSize: 18, fontWeight: "700", textAlign: "center", marginBottom: 12 },
  banner: { backgroundColor: "#fff", borderRadius: 8, padding: 18, alignItems: "center", marginBottom: 16 }, bannerIcon: { fontSize: 36 }, bannerTitle: { fontSize: 16, fontWeight: "700", marginTop: 8 }, bannerSubtitle: { color: "#666", marginTop: 4 },
  tileRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }, tile: { width: "48%", backgroundColor: "#fff", borderRadius: 8, padding: 16, alignItems: "center", justifyContent: "center", minHeight: 110 }, tilePlus: { fontSize: 36 }, tileList: { fontSize: 36 }, tileSearch: { fontSize: 32 }, tileFilter: { fontSize: 28 }, tileLabel: { marginTop: 8, fontWeight: "600" },
  formContainer: { padding: 16 }, formTitle:{fontSize:16, fontWeight:"700", textAlign:"center", marginBottom:12}, label: { marginTop: 8, marginBottom: 4, color: "#333", fontWeight:"600", fontSize:12 }, input: { backgroundColor: "#fff", borderRadius: 6, borderWidth: 1, borderColor: "#ddd", paddingHorizontal: 10, paddingVertical: 8 }, textarea: { minHeight: 80, textAlignVertical: "top" }, pickerBox: { backgroundColor: "#fff", borderRadius: 6, borderWidth: 1, borderColor: "#ddd" },
  primaryButton: { backgroundColor: "#111", paddingVertical: 12, borderRadius: 6, marginTop: 12, alignItems: "center" }, primaryButtonText: { color: "#fff", fontWeight: "700" }, secondaryButton: { borderWidth: 1, borderColor: "#ccc", paddingVertical: 12, borderRadius: 6, marginTop: 10, alignItems: "center" }, secondaryButtonText: { color: "#333", fontWeight: "600" }, dangerButton: { backgroundColor: "#ffdddd", borderRadius: 6, paddingVertical: 12, marginTop: 10, alignItems: "center", borderWidth: 1, borderColor: "#ff9999" }, dangerButtonText: { color: "#a00", fontWeight: "700" }, errorText: { color: "#b00020", marginTop: 6 }, inputError: { borderColor: "#b00020" },
  itemBox: { backgroundColor: "#fff", borderRadius: 8, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: "#000" }, itemHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }, itemName: { fontWeight: "700", fontSize: 16 }, itemPrice: { fontWeight: "700" }, itemCourse: { color: "#666", marginBottom: 6 }, itemDesc: { color: "#444" },
  smallButton: { backgroundColor: "#000", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 4, alignItems: "center", borderWidth:1, borderColor:'#000' }, smallButtonText: { color: "#fff", fontWeight: "600", fontSize:10 },
  fullAddButton: { borderWidth: 1, borderColor: "#000", paddingVertical: 10, borderRadius: 6, alignItems: "center", marginTop: 12, marginBottom: 12, backgroundColor: "#fff" }, fullAddButtonText: { fontWeight: "700" }, searchInput: { backgroundColor: "#fff", borderRadius: 6, borderWidth: 1, borderColor: "#ddd", paddingHorizontal: 10, paddingVertical: 8 }, listItem: { flexDirection: "row", backgroundColor: "#fff", borderRadius: 8, padding: 12, marginTop: 12, borderWidth: 1, borderColor: "#000" }, itemMain: { flex: 1, paddingHorizontal: 8 }, itemRight: { width: 84, justifyContent: "center", alignItems: "center" }, listTitle: { fontWeight: "700" }, listDesc: { color: "#666", fontSize: 12, marginTop: 2 }, listMeta: { color: "#444", marginTop: 6, fontSize: 12 },
  emptyBox: { padding: 20, alignItems: "center" }, emptyText: { color: "#666", textAlign:'center' },
  statsCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#000', borderRadius: 8, padding: 14, marginBottom: 10, backgroundColor: '#fff' },
  statsIcon: { fontSize: 20, marginRight: 12, width:24, textAlign:'center' },
  statsLabel: { fontSize: 13 },
  statsNumber: { fontSize: 20, fontWeight: '700' },
});