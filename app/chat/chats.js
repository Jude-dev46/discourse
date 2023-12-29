import { useEffect, useState } from "react";
import { FlatList, View, StyleSheet, Text, Pressable } from "react-native";
import { Tabs, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Contacts from "expo-contacts";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Colors } from "../../constants/style";
import { fetchRegisteredUsers } from "../../http/user";
import ChatPreview from "../../components/chatItems/ChatPreview";

const Chat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [contactNo, setContactNo] = useState([]);
  const [contactList, setContactList] = useState([]);
  const [registeredContacts, setRegisteredContacts] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const users = await fetchRegisteredUsers();

        if (users) {
          setRegisteredContacts(users);
        }
      } catch (error) {
        console.log("Error");
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();

      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: Contacts.Fields.Emails,
        });

        setContactList(data);
        AsyncStorage.setItem("contacts", JSON.stringify(data));
      }
    })();
  }, []);

  function renderContacts(itemData) {
    return <ChatPreview {...itemData.item} contactList={contactList} />;
  }

  let contactNumbers = [];

  function navigateToSettings() {
    router.replace("/settings");
  }

  useEffect(() => {
    (async () => {
      try {
        if (contactList) {
          for (const contact of contactList) {
            if (contact && Array.isArray(contact.phoneNumbers)) {
              for (const innerObject of contact.phoneNumbers) {
                if (innerObject && innerObject.number) {
                  const { number } = innerObject;
                  contactNumbers.push(number);
                }
              }
            }
          }
          setContactNo(contactNumbers);
        }
      } catch (error) {
        console.log("Error!", error);
      }
    })();
  }, []);

  const regContacts = contactList.filter((contact) =>
    contact.phoneNumbers?.some((innerObject) => {
      if (innerObject && innerObject.number) {
        const { number } = innerObject;
        const normalizedNumber = number.replace(/\D/g, "");

        if (normalizedNumber.length === 11 || normalizedNumber.length === 13) {
          return registeredContacts.some((reg) => {
            const regPhoneNo = reg.phoneNo.toString();
            const regPhoneNoNormalized = regPhoneNo.replace(/\D/g, "");
            return (
              regPhoneNoNormalized === normalizedNumber ||
              `+${regPhoneNoNormalized}` === normalizedNumber ||
              `0${regPhoneNoNormalized}` === normalizedNumber
            );
          });
        }
      }
      return false;
    })
  );

  const filteredData = Array.from(
    regContacts
      .reduce((map, contact) => map.set(contact.name, contact), new Map())
      .values()
  );

  function menuHandler() {
    if (!isOpen) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }

  return (
    <View style={styles.container}>
      <Tabs.Screen
        options={{
          headerRight: ({ tintColor }) => (
            <View style={styles.headerIcons}>
              <Ionicons name="search" color={tintColor} size={24} />
              <Ionicons
                name="menu"
                color={tintColor}
                size={24}
                onPress={menuHandler}
              />
            </View>
          ),
          headerRightContainerStyle: { marginRight: 12 },
        }}
      />
      <FlatList
        data={filteredData}
        renderItem={renderContacts}
        keyExtractor={(item) => item.id}
      />
      {isOpen && (
        <View style={styles.menu}>
          <Pressable
            style={({ pressed }) => pressed && styles.pressed}
            onPress={navigateToSettings}
          >
            <Text style={styles.menuText}>Settings</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    backgroundColor: Colors.primary900,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 18,
  },
  menu: {
    backgroundColor: Colors.primary700,
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 20,
    borderTopRightRadius: 0,
    position: "absolute",
    top: 6,
    right: 10,
    zIndex: 1,
  },
  menuText: {
    color: Colors.primary50,
    fontFamily: "outfit-md",
    fontSize: 24,
  },
  pressed: {
    opacity: 0.7,
  },
});
