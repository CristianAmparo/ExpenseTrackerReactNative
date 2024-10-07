import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import defaultPreview from "../assets/defaultProfile.png";
import { Ionicons } from '@expo/vector-icons';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    image: null,
    fname: "",
    lname: "",
    username: "",
    password: "",
    password2: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const apiHost = "http://10.211.0.106:3000/";

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = async () => {
    try {
      await ImagePicker.requestCameraPermissionsAsync();
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.canceled) {
        const image = result.assets[0];
        setImagePreview(image);
        handleChange("image", image);
      }
    } catch (error) {
      console.error("Image selection error:", error);
    }
  };

  const handleSubmit = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append("fname", formData.fname);
    formDataToSend.append("lname", formData.lname);
    formDataToSend.append("username", formData.username);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("password2", formData.password2);

    if (formData.image) {
      formDataToSend.append("image", {
        uri: formData.image.uri,
        type: formData.image.mimeType,
        name: "profile.jpg",
      });
    }

    try {
      const response = await axios.post(`${apiHost}api/users/`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMessage(response.data.message);
      setErrorMessage("");
      resetForm();
      Alert.alert("Success!", response.data.message);
      setTimeout(() => navigation.navigate("Login"), 1200);
    } catch (error) {
      const errorMsg = error.response?.data?.error || "An error occurred";
      setErrorMessage(errorMsg);
      setSuccessMessage("");
    }
  };

  const resetForm = () => {
    setFormData({
      image: null,
      fname: "",
      lname: "",
      username: "",
      password: "",
      password2: "",
    });
    setImagePreview(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expense Tracker</Text>

      <View style={styles.imageContainer}>
        <View style={styles.wrapper}>
        <Image
          source={imagePreview ? { uri: imagePreview.uri } : defaultPreview}
          style={styles.image}
        />

        <TouchableOpacity
          onPress={handleImageSelect}
          style={styles.editImageButton}
        >
          <Ionicons name="camera-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        </View>
      </View>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={formData.fname}
        onChangeText={(value) => handleChange("fname", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={formData.lname}
        onChangeText={(value) => handleChange("lname", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={formData.username}
        onChangeText={(value) => handleChange("username", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={formData.password}
        onChangeText={(value) => handleChange("password", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Repeat Password"
        secureTextEntry
        value={formData.password2}
        onChangeText={(value) => handleChange("password2", value)}
      />

      {successMessage ? (
        <Text style={styles.successMessage}>{successMessage}</Text>
      ) : null}
      {errorMessage ? (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      ) : null}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <Text style={styles.link}>
        Already have an account?{" "}
        <Text
          style={styles.linkText}
          onPress={() => navigation.navigate("Login")}
        >
          Login!
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  wrapper: {
    borderRadius: 68.5,
    borderWidth: 3,
    borderColor: "#000000",
  },
  image: {
    width: 137,
    height: 137,
    borderRadius: 68.5,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  editImageButton: {
    position: "absolute",
    bottom: 1,
    right: 0,
    backgroundColor: "#6B7280",
    borderRadius: 20,
    padding: 8,
  },

  button: {
    backgroundColor: "black",
    borderRadius: 5,
    padding: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "#CCCCCC",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    padding: 10,
  },
  successMessage: {
    color: "green",
    textAlign: "center",
  },
  errorMessage: {
    color: "red",
    textAlign: "center",
  },
  link: {
    textAlign: "center",
    marginTop: 12,
  },
  linkText: {
    color: "#3B82F6",
    textDecorationLine: "underline",
  },
});

export default RegisterScreen;
